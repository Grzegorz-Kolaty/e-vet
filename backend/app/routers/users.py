import uuid
from datetime import timedelta
from io import BytesIO
from pathlib import Path

from PIL import Image, UnidentifiedImageError
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app import models
from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas import (
    EmailChangeConfirm,
    EmailChangeRequest,
    UserRead,
    UserUpdate,
)

from app.security import verify_password
from app.services.email_service import EmailSendError, email_service
from app.services.auth_token_service import (
    AUTH_TOKEN_PURPOSE_EMAIL_CHANGE,
    consume_auth_token,
    create_auth_token,
)

router = APIRouter(tags=["users"])

UPLOAD_DIR = Path("uploads/users")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_IMAGE_WIDTH = 4096
MAX_IMAGE_HEIGHT = 4096

ALLOWED_IMAGE_FORMATS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
}


def validate_image(content: bytes) -> str:
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image is too large",
        )

    try:
        with Image.open(BytesIO(content)) as image:
            image.verify()

        with Image.open(BytesIO(content)) as image:
            if image.format not in ALLOWED_IMAGE_FORMATS:
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported image format",
                )

            if image.width > MAX_IMAGE_WIDTH or image.height > MAX_IMAGE_HEIGHT:
                raise HTTPException(
                    status_code=400,
                    detail="Image dimensions are too large",
                )

            return ALLOWED_IMAGE_FORMATS[image.format]

    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file",
        )


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    changes = payload.model_dump(exclude_unset=True)

    if "name" in changes:
        current_user.name = changes["name"]

    db.commit()
    db.refresh(current_user)

    return current_user


@router.put("/me/photo", response_model=UserRead)
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = await file.read(MAX_FILE_SIZE + 1)

    extension = validate_image(content)

    filename = f"{uuid.uuid4()}{extension}"
    path = UPLOAD_DIR / filename

    old_photo_url = current_user.photo_url

    try:
        path.write_bytes(content)

        current_user.photo_url = f"/uploads/users/{filename}"

        db.commit()
        db.refresh(current_user)

    except Exception:
        db.rollback()

        if path.exists():
            path.unlink()

        raise

    if old_photo_url:
        old_path = Path(old_photo_url.lstrip("/"))

        if old_path.exists():
            old_path.unlink()

    return current_user


@router.post("/me/email-change")
async def request_email_change(
    payload: EmailChangeRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(
        payload.password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password",
        )

    new_email = str(payload.email).lower()

    if new_email == current_user.email.lower():
        raise HTTPException(
            status_code=400,
            detail="New email must be different from current email",
        )

    existing_user = db.execute(
        select(models.User).where(
            models.User.email == new_email
        )
    ).scalar_one_or_none()

    if existing_user is not None:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    current_user.pending_email = new_email

    user_id = current_user.id

    if not isinstance(user_id, uuid.UUID):
        raise HTTPException(
            status_code=500,
            detail="Invalid user id",
        )

    token = create_auth_token(
        db=db,
        user_id=user_id,
        purpose=AUTH_TOKEN_PURPOSE_EMAIL_CHANGE,
        expires_in=timedelta(hours=1),
    )

    try:
        await email_service.send_email_change_email(
            to=new_email,
            name=current_user.name,
            token=token,
        )

    except EmailSendError as exc:
        current_user.pending_email = None
        db.commit()

        raise HTTPException(
            status_code=502,
            detail=str(exc),
        )

    return {
        "status": "email_change_verification_sent"
    }


@router.post("/me/email-change/confirm")
def confirm_email_change(
    payload: EmailChangeConfirm,
    db: Session = Depends(get_db),
):
    auth_token = consume_auth_token(
        db=db,
        token=payload.token,
        purpose=AUTH_TOKEN_PURPOSE_EMAIL_CHANGE,
    )

    if auth_token is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token",
        )

    user = db.get(models.User, auth_token.user_id)

    if user is None or user.pending_email is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid email change request",
        )

    existing_user = db.execute(
        select(models.User).where(
            models.User.email == user.pending_email,
            models.User.id != user.id,
        )
    ).scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    user.email = user.pending_email
    user.pending_email = None
    user.is_email_verified = True

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    return {
        "status": "email_changed"
    }

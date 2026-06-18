from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, Response, status
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import models
from app.core.config import settings
from app.db import get_db

from app.schemas import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserCreate,
    UserLogin,
    UserRead,
    VerifyEmailRequest,
)

from app.services.email_service import EmailSendError, email_service
from app.services.auth_token_service import (
    AUTH_TOKEN_PURPOSE_EMAIL_VERIFICATION,
    AUTH_TOKEN_PURPOSE_PASSWORD_RESET,
    consume_auth_token,
    create_auth_token,
)

from app.security import (
    create_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)

router = APIRouter(tags=["auth"])


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> models.User:
    session_token = request.cookies.get(settings.session_cookie_name)

    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    session_token_hash = hash_session_token(session_token)
    now = datetime.now(timezone.utc)

    auth_session = db.execute(
        select(models.AuthSession).where(
            models.AuthSession.session_token_hash == session_token_hash,
            models.AuthSession.revoked_at.is_(None),
            models.AuthSession.expires_at > now,
        )
    ).scalar_one_or_none()

    if auth_session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    user = db.get(models.User, auth_session.user_id)

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return user


@router.post(
    "/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED
)
def register_user(
    payload: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    email = str(payload.email).lower()

    existing_user = db.execute(
        select(models.User).where(models.User.email == email)
    ).scalar_one_or_none()

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    allowed_roles = {"user", "vet"}
    if payload.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role"
        )

    user = models.User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        role=payload.role,
    )

    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    db.refresh(user)

    verification_token = create_auth_token(
        db=db,
        user_id=user.id,
        purpose=AUTH_TOKEN_PURPOSE_EMAIL_VERIFICATION,
        expires_in=timedelta(hours=24),
    )

    background_tasks.add_task(
        email_service.send_verify_email,
        to=user.email,
        name=user.name,
        token=verification_token,
    )

    return user


@router.post("/auth/login", response_model=UserRead)
def login_user(
    payload: UserLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    email = str(payload.email).lower()

    user = db.execute(
        select(models.User).where(models.User.email == email)
    ).scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    session_token = create_session_token()
    session_token_hash = hash_session_token(session_token)

    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.session_ttl_days,
    )

    user_agent = request.headers.get("user-agent")
    ip_address = request.client.host if request.client else None

    auth_session = models.AuthSession(
        user_id=user.id,
        session_token_hash=session_token_hash,
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=expires_at,
    )

    db.add(auth_session)
    db.commit()

    response.set_cookie(
        key=settings.session_cookie_name,
        value=session_token,
        max_age=settings.session_ttl_days * 24 * 60 * 60,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        path="/",
    )

    return user


@router.post("/auth/logout")
def logout_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session_token = request.cookies.get(settings.session_cookie_name)

    if session_token:
        session_token_hash = hash_session_token(session_token)

        auth_session = db.execute(
            select(models.AuthSession).where(
                models.AuthSession.session_token_hash == session_token_hash,
                models.AuthSession.revoked_at.is_(None),
            )
        ).scalar_one_or_none()

        if auth_session is not None:
            auth_session.revoked_at = datetime.now(timezone.utc)
            db.commit()

    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
    )

    return {"status": "logged_out"}


@router.get("/me", response_model=UserRead)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.post("/auth/verify-email")
def verify_email(
    payload: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    auth_token = consume_auth_token(
        db=db,
        token=payload.token,
        purpose=AUTH_TOKEN_PURPOSE_EMAIL_VERIFICATION,
    )

    if auth_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )

    user = db.get(models.User, auth_token.user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token",
        )

    user.is_email_verified = True
    user.updated_at = datetime.now(timezone.utc)

    db.commit()

    return {"status": "email_verified"}


@router.post("/auth/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    email = str(payload.email).lower()

    user = db.execute(
        select(models.User).where(models.User.email == email)
    ).scalar_one_or_none()

    if user is not None and user.is_active:
        reset_token = create_auth_token(
            db=db,
            user_id=user.id,
            purpose=AUTH_TOKEN_PURPOSE_PASSWORD_RESET,
            expires_in=timedelta(hours=1),
        )

        background_tasks.add_task(
            email_service.send_password_reset_email,
            to=user.email,
            name=user.name,
            token=reset_token,
        )

    return {"status": "password_reset_email_sent_if_account_exists"}


@router.post("/auth/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    auth_token = consume_auth_token(
        db=db,
        token=payload.token,
        purpose=AUTH_TOKEN_PURPOSE_PASSWORD_RESET,
    )

    if auth_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    user = db.get(models.User, auth_token.user_id)

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token",
        )

    now = datetime.now(timezone.utc)

    user.password_hash = hash_password(payload.password)
    user.updated_at = now

    db.execute(
        update(models.AuthSession)
        .where(
            models.AuthSession.user_id == user.id,
            models.AuthSession.revoked_at.is_(None),
        )
        .values(revoked_at=now)
    )

    db.commit()

    return {"status": "password_reset"}


@router.post("/auth/dev/test-email")
async def send_test_email(
    email: str,
):
    if settings.environment == "production":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not found",
        )

    try:
        await email_service.send_email(
            to=email,
            subject="VetReservation - test email",
            html="""
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>VetReservation</h2>
                <p>To jest testowy email z backendu FastAPI przez Resend.</p>
                <p>Jeśli widzisz tę wiadomość, konfiguracja działa poprawnie.</p>
            </div>
            """,
        )
    except EmailSendError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        )

    return {"status": "email_sent"}

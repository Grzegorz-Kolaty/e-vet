from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import models
from app.core.config import settings
from app.db import get_db
from app.schemas import UserCreate, UserLogin, UserRead
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
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
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

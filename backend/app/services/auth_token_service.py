from __future__ import annotations

import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models


AUTH_TOKEN_PURPOSE_EMAIL_VERIFICATION = "email_verification"
AUTH_TOKEN_PURPOSE_PASSWORD_RESET = "password_reset"


def create_raw_auth_token() -> str:
    return secrets.token_urlsafe(48)


def hash_auth_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_auth_token(
    *,
    db: Session,
    user_id: uuid.UUID,
    purpose: str,
    expires_in: timedelta,
) -> str:
    now = datetime.now(timezone.utc)

    previous_tokens = db.execute(
        select(models.AuthToken).where(
            models.AuthToken.user_id == user_id,
            models.AuthToken.purpose == purpose,
            models.AuthToken.used_at.is_(None),
            )
    ).scalars().all()

    for previous_token in previous_tokens:
        previous_token.used_at = now

    raw_token = create_raw_auth_token()

    auth_token = models.AuthToken(
        user_id=user_id,
        purpose=purpose,
        token_hash=hash_auth_token(raw_token),
        expires_at=now + expires_in,
    )

    db.add(auth_token)
    db.commit()

    return raw_token


def consume_auth_token(
    *,
    db: Session,
    token: str,
    purpose: str,
) -> models.AuthToken | None:
    now = datetime.now(timezone.utc)

    token_hash = hash_auth_token(token)

    auth_token = db.execute(
        select(models.AuthToken).where(
            models.AuthToken.token_hash == token_hash,
            models.AuthToken.purpose == purpose,
            models.AuthToken.used_at.is_(None),
            models.AuthToken.expires_at > now,
            )
    ).scalar_one_or_none()

    if auth_token is None:
        return None

    auth_token.used_at = now
    db.flush()

    return auth_token

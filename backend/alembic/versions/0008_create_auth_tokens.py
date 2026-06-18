"""create auth tokens

Revision ID: 0008_create_auth_tokens
Revises: 0007_create_appointments
Create Date: 2026-06-18
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0008_create_auth_tokens"
down_revision: Union[str, None] = "0007_create_appointments"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "auth_tokens",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "purpose",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "token_hash",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "used_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_auth_tokens_user_id",
        "auth_tokens",
        ["user_id"],
    )
    op.create_index(
        "ix_auth_tokens_purpose",
        "auth_tokens",
        ["purpose"],
    )
    op.create_index(
        "ix_auth_tokens_token_hash",
        "auth_tokens",
        ["token_hash"],
        unique=True,
    )
    op.create_index(
        "ix_auth_tokens_expires_at",
        "auth_tokens",
        ["expires_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_auth_tokens_expires_at", table_name="auth_tokens")
    op.drop_index("ix_auth_tokens_token_hash", table_name="auth_tokens")
    op.drop_index("ix_auth_tokens_purpose", table_name="auth_tokens")
    op.drop_index("ix_auth_tokens_user_id", table_name="auth_tokens")
    op.drop_table("auth_tokens")

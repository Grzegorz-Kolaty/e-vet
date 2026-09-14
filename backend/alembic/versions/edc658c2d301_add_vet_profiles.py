"""add vet profiles

Revision ID: edc658c2d301
Revises: d1be26675d31
Create Date: 2026-09-13 14:10:31.866378
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "edc658c2d301"
down_revision: Union[str, Sequence[str], None] = "d1be26675d31"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "vet_profiles",

        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),

        sa.Column(
            "pwz_number",
            sa.String(length=32),
            nullable=True,
        ),

        sa.Column(
            "verification_status",
            sa.String(length=30),
            nullable=False,
            server_default=sa.text("'not_provided'"),
        ),

        sa.Column(
            "rejection_reason",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "verified_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),

        sa.CheckConstraint(
            "verification_status IN "
            "('not_provided', 'pending', 'verified', 'rejected')",
            name="ck_vet_profiles_verification_status",
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),

        sa.PrimaryKeyConstraint(
            "user_id",
            name="pk_vet_profiles",
        ),
    )

    op.create_index(
        "ix_vet_profiles_pwz_number",
        "vet_profiles",
        ["pwz_number"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_vet_profiles_pwz_number",
        table_name="vet_profiles",
    )

    op.drop_table("vet_profiles")

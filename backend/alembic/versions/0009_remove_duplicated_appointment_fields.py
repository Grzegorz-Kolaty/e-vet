from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0009_remove_appt_dupes"
down_revision: Union[str, None] = "0008_create_auth_tokens"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE appointments DROP COLUMN IF EXISTS clinic_name")
    op.execute("ALTER TABLE appointments DROP COLUMN IF EXISTS vet_display_name")
    op.execute("ALTER TABLE appointments DROP COLUMN IF EXISTS city")
    op.execute("ALTER TABLE appointments DROP COLUMN IF EXISTS patient_name")
    op.execute("ALTER TABLE appointments DROP COLUMN IF EXISTS pet_name")


def downgrade() -> None:
    op.add_column(
        "appointments",
        sa.Column(
            "clinic_name",
            sa.String(length=255),
            nullable=False,
            server_default="",
        ),
    )

    op.add_column(
        "appointments",
        sa.Column(
            "vet_display_name",
            sa.String(length=255),
            nullable=False,
            server_default="",
        ),
    )

    op.add_column(
        "appointments",
        sa.Column(
            "city",
            sa.String(length=150),
            nullable=False,
            server_default="",
        ),
    )

    op.add_column(
        "appointments",
        sa.Column(
            "patient_name",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "appointments",
        sa.Column(
            "pet_name",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.create_index(
        "ix_appointments_city",
        "appointments",
        ["city"],
    )

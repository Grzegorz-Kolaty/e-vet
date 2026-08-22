from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0010_appt_snapshot"
down_revision: Union[str, None] = "0009_remove_appt_dupes"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "appointments",
        sa.Column(
            "vet_display_name",
            sa.String(length=150),
            nullable=True,
        ),
    )

    op.add_column(
        "appointments",
        sa.Column(
            "clinic_name",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.execute(
        "ALTER TABLE appointments "
        "DROP CONSTRAINT IF EXISTS appointments_patient_id_fkey"
    )

    op.execute(
        "DROP INDEX IF EXISTS ix_appointments_patient_id"
    )

    op.execute(
        "ALTER TABLE appointments "
        "DROP COLUMN IF EXISTS patient_id"
    )


def downgrade() -> None:
    op.add_column(
        "appointments",
        sa.Column(
            "patient_id",
            sa.UUID(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "appointments_patient_id_fkey",
        "appointments",
        "users",
        ["patient_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_index(
        "ix_appointments_patient_id",
        "appointments",
        ["patient_id"],
    )

    op.drop_column("appointments", "clinic_name")
    op.drop_column("appointments", "vet_display_name")

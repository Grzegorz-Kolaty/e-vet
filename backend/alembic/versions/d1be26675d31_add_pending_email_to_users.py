"""add pending email to users

Revision ID: d1be26675d31
Revises: 0010_appt_snapshot
Create Date: 2026-08-23 07:42:08.547009
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d1be26675d31"
down_revision: Union[str, Sequence[str], None] = "0010_appt_snapshot"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # W bazie mogą istnieć stare treatments wskazujące na appointment,
    # którego już nie ma. Ponieważ appointment_id jest nullable,
    # zachowujemy treatment i usuwamy tylko niepoprawne powiązanie.
    op.execute(
        """
        UPDATE treatments
        SET appointment_id = NULL
        WHERE appointment_id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM appointments
            WHERE appointments.id = treatments.appointment_id
        )
        """
    )

    op.create_foreign_key(
        "fk_treatments_appointment_id_appointments",
        "treatments",
        "appointments",
        ["appointment_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.add_column(
        "users",
        sa.Column(
            "pending_email",
            sa.String(length=300),
            nullable=True,
        ),
    )

    op.alter_column(
        "users",
        "email",
        existing_type=sa.VARCHAR(length=320),
        type_=sa.String(length=300),
        existing_nullable=False,
    )

    op.alter_column(
        "users",
        "photo_url",
        existing_type=sa.TEXT(),
        type_=sa.String(length=500),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "users",
        "photo_url",
        existing_type=sa.String(length=500),
        type_=sa.TEXT(),
        existing_nullable=True,
    )

    op.alter_column(
        "users",
        "email",
        existing_type=sa.String(length=300),
        type_=sa.VARCHAR(length=320),
        existing_nullable=False,
    )

    op.drop_column(
        "users",
        "pending_email",
    )

    op.drop_constraint(
        "fk_treatments_appointment_id_appointments",
        "treatments",
        type_="foreignkey",
    )

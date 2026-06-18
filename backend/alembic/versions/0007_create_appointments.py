from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0007_create_appointments"
down_revision: Union[str, Sequence[str], None] = "0006_create_treatments"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "appointments",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column(
            "vet_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "clinic_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("clinics.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("clinic_name", sa.String(length=255), nullable=False),
        sa.Column("vet_display_name", sa.String(length=255), nullable=False),
        sa.Column("reserved", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("realised", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("city", sa.String(length=150), nullable=False),
        sa.Column("date_time_from", sa.DateTime(timezone=True), nullable=False),
        sa.Column("date_time_to", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "patient_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("patient_name", sa.String(length=255), nullable=True),
        sa.Column(
            "pet_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("pets.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("pet_name", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )

    op.create_index("ix_appointments_vet_id", "appointments", ["vet_id"])
    op.create_index("ix_appointments_clinic_id", "appointments", ["clinic_id"])
    op.create_index("ix_appointments_city", "appointments", ["city"])
    op.create_index(
        "ix_appointments_date_time_from",
        "appointments",
        ["date_time_from"],
    )
    op.create_index("ix_appointments_patient_id", "appointments", ["patient_id"])
    op.create_index("ix_appointments_pet_id", "appointments", ["pet_id"])


def downgrade() -> None:
    op.drop_index("ix_appointments_pet_id", table_name="appointments")
    op.drop_index("ix_appointments_patient_id", table_name="appointments")
    op.drop_index("ix_appointments_date_time_from", table_name="appointments")
    op.drop_index("ix_appointments_city", table_name="appointments")
    op.drop_index("ix_appointments_clinic_id", table_name="appointments")
    op.drop_index("ix_appointments_vet_id", table_name="appointments")

    op.drop_table("appointments")

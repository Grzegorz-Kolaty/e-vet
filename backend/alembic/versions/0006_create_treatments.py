from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0006_create_treatments"
down_revision: Union[str, Sequence[str], None] = "0005_create_pets"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "treatments",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column(
            "pet_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("pets.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "appointment_id",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
        sa.Column(
            "clinic_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("clinics.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "vet_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "is_created_by_user",
            sa.Boolean(),
            server_default="true",
            nullable=False,
        ),
        sa.Column(
            "type",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "date",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "vet",
            sa.String(length=255),
            server_default="",
            nullable=False,
        ),
        sa.Column(
            "clinic",
            sa.String(length=255),
            server_default="",
            nullable=False,
        ),
        sa.Column(
            "diagnosis",
            sa.Text(),
            server_default="",
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.Text(),
            server_default="",
            nullable=False,
        ),
        sa.Column(
            "recommendation",
            sa.Text(),
            server_default="",
            nullable=False,
        ),
        sa.Column(
            "prescription",
            sa.Text(),
            server_default="",
            nullable=False,
        ),
        sa.Column(
            "attachments",
            postgresql.JSONB(),
            server_default=sa.text("'[]'::jsonb"),
            nullable=False,
        ),
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

    op.create_index(
        "ix_treatments_pet_id",
        "treatments",
        ["pet_id"],
    )

    op.create_index(
        "ix_treatments_appointment_id",
        "treatments",
        ["appointment_id"],
    )

    op.create_index(
        "ix_treatments_clinic_id",
        "treatments",
        ["clinic_id"],
    )

    op.create_index(
        "ix_treatments_vet_id",
        "treatments",
        ["vet_id"],
    )

    op.create_index(
        "ix_treatments_date",
        "treatments",
        ["date"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_treatments_date",
        table_name="treatments",
    )

    op.drop_index(
        "ix_treatments_vet_id",
        table_name="treatments",
    )

    op.drop_index(
        "ix_treatments_clinic_id",
        table_name="treatments",
    )

    op.drop_index(
        "ix_treatments_appointment_id",
        table_name="treatments",
    )

    op.drop_index(
        "ix_treatments_pet_id",
        table_name="treatments",
    )

    op.drop_table("treatments")

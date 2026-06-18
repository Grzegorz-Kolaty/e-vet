from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003_create_clinics"
down_revision: Union[str, Sequence[str], None] = "0002_create_sessions"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "clinics",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column(
            "clinic_name",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "owner_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "vet_ids",
            postgresql.JSONB(),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column(
            "phone_number",
            sa.String(length=50),
            nullable=True,
        ),
        sa.Column(
            "address",
            postgresql.JSONB(),
            nullable=False,
        ),
        sa.Column(
            "search_city",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "time_open",
            sa.String(length=20),
            nullable=True,
        ),
        sa.Column(
            "time_close",
            sa.String(length=20),
            nullable=True,
        ),
        sa.Column(
            "cover_image",
            postgresql.JSONB(),
            nullable=True,
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
        "ix_clinics_owner_id",
        "clinics",
        ["owner_id"],
    )

    op.create_index(
        "ix_clinics_search_city",
        "clinics",
        ["search_city"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_clinics_search_city",
        table_name="clinics",
    )

    op.drop_index(
        "ix_clinics_owner_id",
        table_name="clinics",
    )

    op.drop_table("clinics")

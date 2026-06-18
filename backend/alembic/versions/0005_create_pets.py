from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0005_create_pets"
down_revision: Union[str, Sequence[str], None] = "0004_update_users_profile_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pets",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column(
            "owner_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "species",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "breed",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "sex",
            sa.String(length=30),
            nullable=False,
        ),
        sa.Column(
            "birth_date",
            sa.String(length=30),
            nullable=True,
        ),
        sa.Column(
            "weight",
            sa.Float(),
            nullable=True,
        ),
        sa.Column(
            "photo_url",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "last_visit",
            sa.String(length=30),
            nullable=True,
        ),
        sa.Column(
            "clinic",
            sa.String(length=255),
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
        "ix_pets_owner_id",
        "pets",
        ["owner_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_pets_owner_id",
        table_name="pets",
    )

    op.drop_table("pets")

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from typing import Sequence, Union

from alembic import op

revision: str = "0004_update_users_profile_fields"
down_revision: Union[str, Sequence[str], None] = "0003_create_clinics"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("name", sa.String(length=150), nullable=True),
    )

    op.execute("""
        UPDATE users
        SET name = split_part(email, '@', 1)
        WHERE name IS NULL
        """)

    op.alter_column(
        "users",
        "name",
        nullable=False,
    )

    op.add_column(
        "users",
        sa.Column(
            "clinic_id",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
    )

    op.add_column(
        "users",
        sa.Column("photo_url", sa.Text(), nullable=True),
    )

    op.create_index(
        "ix_users_clinic_id",
        "users",
        ["clinic_id"],
    )

    op.create_foreign_key(
        "fk_users_clinic_id_clinics",
        "users",
        "clinics",
        ["clinic_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_users_clinic_id_clinics",
        "users",
        type_="foreignkey",
    )

    op.drop_index(
        "ix_users_clinic_id",
        table_name="users",
    )

    op.drop_column("users", "photo_url")
    op.drop_column("users", "clinic_id")
    op.drop_column("users", "name")

"""store image paths

Revision ID: 9f1257c299c3
Revises: edc658c2d301
Create Date: 2026-09-13
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "9f1257c299c3"
down_revision = "edc658c2d301"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Clinics
    op.add_column(
        "clinics",
        sa.Column(
            "cover_path",
            sa.String(length=500),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE clinics
        SET cover_path =
                CASE
                    WHEN COALESCE(
                        cover_image ->> 'path',
                    cover_image ->> 'url'
                ) ~ '^https?://[^/]+/uploads/'
                THEN regexp_replace(
                        COALESCE(
                            cover_image ->> 'path',
                        cover_image ->> 'url'
                    ),
                        '^https?://[^/]+/uploads/',
                        ''
                     )

                    WHEN COALESCE(
                        cover_image ->> 'path',
                    cover_image ->> 'url'
                ) ~ '^/?uploads/'
                THEN regexp_replace(
                        COALESCE(
                            cover_image ->> 'path',
                        cover_image ->> 'url'
                    ),
                        '^/?uploads/',
                        ''
                     )

                    ELSE COALESCE(
                        cover_image ->> 'path',
                    cover_image ->> 'url'
                )
                    END
        WHERE cover_image IS NOT NULL
        """
    )

    op.drop_column(
        "clinics",
        "cover_image",
    )

    # Pets
    op.add_column(
        "pets",
        sa.Column(
            "photo_path",
            sa.String(length=500),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE pets
        SET photo_path =
                CASE
                    WHEN photo_url ~ '^https?://[^/]+/uploads/'
                THEN regexp_replace(
                        photo_url,
                        '^https?://[^/]+/uploads/',
                        ''
                     )

                    WHEN photo_url ~ '^/?uploads/'
                THEN regexp_replace(
                        photo_url,
                        '^/?uploads/',
                        ''
                     )

                    ELSE photo_url
                    END
        WHERE photo_url IS NOT NULL
        """
    )

    op.drop_column(
        "pets",
        "photo_url",
    )

    # Users
    op.add_column(
        "users",
        sa.Column(
            "photo_path",
            sa.String(length=500),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE users
        SET photo_path =
                CASE
                    WHEN photo_url ~ '^https?://[^/]+/uploads/'
                THEN regexp_replace(
                        photo_url,
                        '^https?://[^/]+/uploads/',
                        ''
                     )

                    WHEN photo_url ~ '^/?uploads/'
                THEN regexp_replace(
                        photo_url,
                        '^/?uploads/',
                        ''
                     )

                    ELSE photo_url
                    END
        WHERE photo_url IS NOT NULL
        """
    )

    op.drop_column(
        "users",
        "photo_url",
    )


def downgrade() -> None:
    # Users
    op.add_column(
        "users",
        sa.Column(
            "photo_url",
            sa.String(length=500),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE users
        SET photo_url =
                CASE
                    WHEN photo_path ~ '^https?://'
                THEN photo_path

                    ELSE '/uploads/' || photo_path
                    END
        WHERE photo_path IS NOT NULL
        """
    )

    op.drop_column(
        "users",
        "photo_path",
    )

    # Pets
    op.add_column(
        "pets",
        sa.Column(
            "photo_url",
            sa.Text(),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE pets
        SET photo_url =
                CASE
                    WHEN photo_path ~ '^https?://'
                THEN photo_path

                    ELSE '/uploads/' || photo_path
                    END
        WHERE photo_path IS NOT NULL
        """
    )

    op.drop_column(
        "pets",
        "photo_path",
    )

    # Clinics
    op.add_column(
        "clinics",
        sa.Column(
            "cover_image",
            postgresql.JSONB(),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE clinics
        SET cover_image =
                jsonb_build_object(
                    'url',
                    CASE
                        WHEN cover_path ~ '^https?://'
                    THEN cover_path

                        ELSE '/uploads/' || cover_path
                        END
                )
        WHERE cover_path IS NOT NULL
        """
    )

    op.drop_column(
        "clinics",
        "cover_path",
    )

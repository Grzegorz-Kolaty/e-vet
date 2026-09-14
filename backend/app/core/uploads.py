from pathlib import Path

from fastapi import HTTPException, Request, UploadFile, status


BACKEND_DIR = Path(__file__).resolve().parents[2]
UPLOADS_DIR = BACKEND_DIR / "uploads"

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB

IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


def build_upload_url(
    request: Request,
    path: str,
) -> str:
    return str(
        request.url_for(
            "uploads",
            path=path.lstrip("/"),
        )
    )


def build_image(
    request: Request,
    path: str | None,
) -> dict[str, str] | None:
    if not path:
        return None

    return {
        "url": build_upload_url(
            request=request,
            path=path,
        )
    }


async def save_image(
    file: UploadFile,
    directory: str,
    filename: str,
) -> str:
    extension = IMAGE_TYPES.get(file.content_type or "")

    if extension is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Supported image types: JPEG, PNG and WebP",
        )

    relative_directory = Path(directory)

    if relative_directory.is_absolute() or ".." in relative_directory.parts:
        raise ValueError("Invalid upload directory")

    upload_directory = UPLOADS_DIR / relative_directory

    upload_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    destination = upload_directory / f"{filename}{extension}"
    temporary = upload_directory / f".{filename}.tmp"

    size = 0

    try:
        with temporary.open("wb") as output:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)

                if size > MAX_IMAGE_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Image is too large. Maximum size is 10 MB",
                    )

                output.write(chunk)

        # Usuń poprzednią wersję cover.jpg / cover.png / cover.webp.
        for old_extension in IMAGE_TYPES.values():
            old_file = upload_directory / f"{filename}{old_extension}"

            if old_file != destination:
                old_file.unlink(missing_ok=True)

        temporary.replace(destination)

    finally:
        temporary.unlink(missing_ok=True)

    return (
        relative_directory / destination.name
    ).as_posix()


def delete_image(path: str | None) -> None:
    if not path:
        return

    relative_path = Path(path)

    if relative_path.is_absolute() or ".." in relative_path.parts:
        raise ValueError("Invalid upload path")

    file_path = UPLOADS_DIR / relative_path
    file_path.unlink(missing_ok=True)

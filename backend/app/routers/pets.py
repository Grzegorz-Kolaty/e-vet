import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.core.uploads import UPLOADS_DIR, build_upload_url, save_image
from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas import PetCreate, PetRead

router = APIRouter(tags=["pets"])


def pet_to_read(
    pet: models.Pet,
    request: Request | None = None,
) -> PetRead:
    photo_url = None
    if pet.photo_path:
        if request:
            photo_url = build_upload_url(request, pet.photo_path)
        else:
            photo_url = f"/uploads/{pet.photo_path.lstrip('/')}"

    return PetRead(
        id=pet.id,
        ownerId=pet.owner_id,
        name=pet.name,
        species=pet.species,
        breed=pet.breed,
        sex=pet.sex,
        birthDate=pet.birth_date,
        weight=pet.weight,
        photoUrl=photo_url,
        lastVisit=pet.last_visit,
        clinic=pet.clinic,
    )


@router.get("/pets", response_model=list[PetRead])
def get_pets(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pets = (
        db.execute(
            select(models.Pet)
            .where(models.Pet.owner_id == current_user.id)
            .order_by(models.Pet.created_at.desc())
        )
        .scalars()
        .all()
    )

    return [pet_to_read(pet, request) for pet in pets]


@router.post("/pets", response_model=PetRead, status_code=status.HTTP_201_CREATED)
def create_pet(
    payload: PetCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pet = models.Pet(
        owner_id=current_user.id,
        name=payload.name,
        species=payload.species,
        breed=payload.breed,
        sex=payload.sex,
        birth_date=payload.birthDate,
        weight=payload.weight,
        photo_path=None,
        last_visit=payload.lastVisit,
        clinic=payload.clinic,
    )

    db.add(pet)
    db.commit()
    db.refresh(pet)

    return pet_to_read(pet, request)


@router.put("/pets/{pet_id}", response_model=PetRead)
def update_pet(
    pet_id: uuid.UUID,
    payload: PetCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pet = db.get(models.Pet, pet_id)

    if pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pet not found",
        )

    if pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can update only your own pets",
        )

    pet.name = payload.name
    pet.species = payload.species
    pet.breed = payload.breed
    pet.sex = payload.sex
    pet.birth_date = payload.birthDate
    pet.weight = payload.weight
    pet.last_visit = payload.lastVisit
    pet.clinic = payload.clinic

    db.commit()
    db.refresh(pet)

    return pet_to_read(pet, request)


@router.post("/pets/{pet_id}/photo", response_model=PetRead)
async def upload_pet_photo(
    pet_id: uuid.UUID,
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pet = db.get(models.Pet, pet_id)

    if pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pet not found",
        )

    if pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can upload files only for your own pets",
        )

    pet.photo_path = await save_image(
        file=file,
        directory=f"pets/{pet.id}",
        filename="photo",
    )

    db.commit()
    db.refresh(pet)

    return pet_to_read(pet, request)


@router.post("/pets/{pet_id}/attachments")
async def upload_pet_attachment(
    pet_id: uuid.UUID,
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pet = db.get(models.Pet, pet_id)

    if pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pet not found",
        )

    if pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can upload files only for your own pets",
        )

    upload_dir = UPLOADS_DIR / "pets" / str(pet.id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"

    content = await file.read()
    file_path.write_bytes(content)

    return {
        "name": file.filename,
        "url": build_upload_url(request, f"pets/{pet.id}/{file_path.name}"),
    }

import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas import PetCreate, PetRead

router = APIRouter(tags=["pets"])


def pet_to_read(pet: models.Pet) -> PetRead:
    return PetRead(
        id=pet.id,
        ownerId=pet.owner_id,
        name=pet.name,
        species=pet.species,
        breed=pet.breed,
        sex=pet.sex,
        birthDate=pet.birth_date,
        weight=pet.weight,
        photoUrl=pet.photo_url,
        lastVisit=pet.last_visit,
        clinic=pet.clinic,
    )


@router.get("/pets", response_model=list[PetRead])
def get_pets(
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

    return [pet_to_read(pet) for pet in pets]


@router.post("/pets", response_model=PetRead, status_code=status.HTTP_201_CREATED)
def create_pet(
    payload: PetCreate,
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
        photo_url=payload.photoUrl,
        last_visit=payload.lastVisit,
        clinic=payload.clinic,
    )

    db.add(pet)
    db.commit()
    db.refresh(pet)

    return pet_to_read(pet)


@router.put("/pets/{pet_id}", response_model=PetRead)
def update_pet(
    pet_id: uuid.UUID,
    payload: PetCreate,
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
    pet.photo_url = payload.photoUrl
    pet.last_visit = payload.lastVisit
    pet.clinic = payload.clinic

    db.commit()
    db.refresh(pet)

    return pet_to_read(pet)


@router.post("/pets/{pet_id}/attachments")
async def upload_pet_attachment(
    pet_id: uuid.UUID,
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

    upload_dir = Path("uploads") / "pets" / str(pet.id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"

    content = await file.read()
    file_path.write_bytes(content)

    return {
        "name": file.filename,
        "url": f"/uploads/pets/{pet.id}/{file_path.name}",
    }

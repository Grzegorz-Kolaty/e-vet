import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas import ClinicCreate, ClinicRead, UserRead

router = APIRouter(prefix="/clinics", tags=["clinics"])


def get_city_from_address(address: dict) -> str | None:
    city = (
        address.get("city")
        or address.get("town")
        or address.get("village")
        or address.get("municipality")
    )

    if not city:
        return None

    return str(city).strip()


def clinic_to_read(clinic: models.Clinic) -> ClinicRead:
    return ClinicRead(
        id=clinic.id,
        clinicName=clinic.clinic_name,
        ownerId=clinic.owner_id,
        vetIds=clinic.vet_ids or [],
        phoneNumber=clinic.phone_number,
        address=clinic.address,
        timeOpen=clinic.time_open,
        timeClose=clinic.time_close,
        coverImage=clinic.cover_image,
        createdAt=clinic.created_at,
    )


@router.get("/my", response_model=ClinicRead | None)
def get_my_clinic(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    current_user_id = str(current_user.id)

    clinics = db.execute(select(models.Clinic)).scalars().all()

    for clinic in clinics:
        if clinic.owner_id == current_user.id:
            return clinic_to_read(clinic)

        if current_user_id in (clinic.vet_ids or []):
            return clinic_to_read(clinic)

    return None


@router.post("", response_model=ClinicRead, status_code=status.HTTP_201_CREATED)
def create_clinic(
    payload: ClinicCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    search_city = get_city_from_address(payload.address)

    address = dict(payload.address)

    if search_city:
        address["searchCity"] = search_city

    current_user_id = str(current_user.id)

    vet_ids = [
        vet_id for vet_id in (payload.vetIds or []) if vet_id and vet_id != "string"
    ]

    if current_user_id not in vet_ids:
        vet_ids.append(current_user_id)

    clinic = models.Clinic(
        clinic_name=payload.clinicName,
        owner_id=current_user.id,
        vet_ids=vet_ids,
        phone_number=payload.phoneNumber,
        address=address,
        search_city=search_city,
        time_open=payload.timeOpen,
        time_close=payload.timeClose,
        cover_image=payload.coverImage,
    )

    db.add(clinic)
    db.commit()
    db.refresh(clinic)

    return clinic_to_read(clinic)


@router.get("", response_model=list[ClinicRead])
def get_clinics(
    city: str | None = None,
    db: Session = Depends(get_db),
):
    statement = select(models.Clinic)

    if city:
        statement = statement.where(models.Clinic.search_city == city.strip())

    clinics = db.execute(statement).scalars().all()

    return [clinic_to_read(clinic) for clinic in clinics]


@router.get("/cities", response_model=list[str])
def get_available_cities(db: Session = Depends(get_db)):
    cities = (
        db.execute(
            select(models.Clinic.search_city)
            .where(models.Clinic.search_city.is_not(None))
            .distinct()
            .order_by(models.Clinic.search_city)
        )
        .scalars()
        .all()
    )

    return [city for city in cities if city]


@router.get("/by-vet/{vet_id}", response_model=ClinicRead | None)
def get_clinic_by_vet_id(
    vet_id: str,
    db: Session = Depends(get_db),
):
    clinics = db.execute(select(models.Clinic)).scalars().all()

    for clinic in clinics:
        if vet_id in (clinic.vet_ids or []):
            return clinic_to_read(clinic)

    return None


@router.get("/{clinic_id}", response_model=ClinicRead)
def get_clinic_by_id(
    clinic_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    clinic = db.get(models.Clinic, clinic_id)

    if clinic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )

    return clinic_to_read(clinic)


@router.get("/{clinic_id}/vets", response_model=list[UserRead])
def get_veterinaries_assigned_to_clinic(
    clinic_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    clinic = db.get(models.Clinic, clinic_id)

    if clinic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )

    vet_ids = clinic.vet_ids or []

    if not vet_ids:
        return []

    user_ids = [
        uuid.UUID(vet_id) for vet_id in vet_ids if vet_id and vet_id != "string"
    ]

    if not user_ids:
        return []

    users = (
        db.execute(select(models.User).where(models.User.id.in_(user_ids)))
        .scalars()
        .all()
    )

    return users


@router.post("/{clinic_id}/cover", response_model=ClinicRead)
async def update_cover(
    clinic_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    clinic = db.get(models.Clinic, clinic_id)

    if clinic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )

    if clinic.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only clinic owner can update cover",
        )

    upload_dir = Path("uploads") / "clinics" / str(clinic.id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    extension = Path(file.filename or "").suffix or ".jpg"
    file_path = upload_dir / f"cover{extension}"

    content = await file.read()
    file_path.write_bytes(content)

    image_url = f"/uploads/clinics/{clinic.id}/{file_path.name}"

    clinic.cover_image = {
        "url": image_url,
    }

    db.commit()
    db.refresh(clinic)

    return clinic_to_read(clinic)

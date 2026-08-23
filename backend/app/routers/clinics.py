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


def get_clinic_for_current_user(
    db: Session,
    current_user: models.User,
) -> models.Clinic | None:
    if current_user.clinic_id is not None:
        clinic = db.get(models.Clinic, current_user.clinic_id)

        if clinic is not None:
            return clinic

    clinic = (
        db.execute(
            select(models.Clinic).where(models.Clinic.owner_id == current_user.id)
        )
        .scalars()
        .first()
    )

    if clinic is not None:
        return clinic

    # Fallback pod stare dane, jeśli wcześniej klinika miała vet_ids,
    # ale user nie miał jeszcze ustawionego clinic_id.
    current_user_id = str(current_user.id)
    clinics = db.execute(select(models.Clinic)).scalars().all()

    for clinic in clinics:
        if current_user_id in (clinic.vet_ids or []):
            current_user.clinic_id = clinic.id
            db.commit()
            db.refresh(current_user)
            return clinic

    return None


@router.get("/my", response_model=ClinicRead | None)
def get_my_clinic(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    clinic = get_clinic_for_current_user(
        db=db,
        current_user=current_user,
    )

    if clinic is None:
        return None

    return clinic_to_read(clinic)


@router.post("", response_model=ClinicRead, status_code=status.HTTP_201_CREATED)
def create_clinic(
    payload: ClinicCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "vet":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only vet can create clinic",
        )

    existing_clinic = get_clinic_for_current_user(
        db=db,
        current_user=current_user,
    )

    if existing_clinic is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="UsersService is already assigned to a clinic",
        )

    search_city = get_city_from_address(payload.address)

    address = dict(payload.address)

    if search_city:
        address["searchCity"] = search_city

    clinic = models.Clinic(
        clinic_name=payload.clinicName,
        owner_id=current_user.id,
        vet_ids=[str(current_user.id)],
        phone_number=payload.phoneNumber,
        address=address,
        search_city=search_city,
        time_open=payload.timeOpen,
        time_close=payload.timeClose,
        cover_image=payload.coverImage,
    )

    db.add(clinic)
    db.flush()

    current_user.clinic_id = clinic.id

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
def get_available_cities(
    db: Session = Depends(get_db),
):
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

    users = (
        db.execute(
            select(models.User)
            .where(models.User.clinic_id == clinic.id)
            .where(models.User.role == "vet")
        )
        .scalars()
        .all()
    )

    if users:
        return users

    # Fallback pod stare dane, jeśli vet_ids istnieje,
    # ale users.clinic_id nie zostało jeszcze uzupełnione.
    vet_ids = [
        uuid.UUID(vet_id)
        for vet_id in (clinic.vet_ids or [])
        if vet_id and vet_id != "string"
    ]

    if not vet_ids:
        return []

    users = (
        db.execute(
            select(models.User)
            .where(models.User.id.in_(vet_ids))
            .where(models.User.role == "vet")
        )
        .scalars()
        .all()
    )

    return users


@router.post("/my/cover", response_model=ClinicRead)
async def update_my_clinic_cover(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    clinic = get_clinic_for_current_user(
        db=db,
        current_user=current_user,
    )

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

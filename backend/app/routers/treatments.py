import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Body, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.db import get_db
from app.routers.auth import get_current_user
from app.schemas import AttachmentRead, TreatmentCreate, TreatmentRead

router = APIRouter(tags=["treatments"])


def treatment_to_read(treatment: models.Treatment) -> TreatmentRead:
    return TreatmentRead(
        id=treatment.id,
        petId=treatment.pet_id,
        appointmentId=treatment.appointment_id,
        clinicId=treatment.clinic_id,
        vetId=treatment.vet_id,
        isCreatedByUser=treatment.is_created_by_user,
        type=treatment.type,
        date=treatment.date,
        vet=treatment.vet,
        clinic=treatment.clinic,
        diagnosis=treatment.diagnosis,
        description=treatment.description,
        recommendation=treatment.recommendation,
        prescription=treatment.prescription,
        attachments=treatment.attachments or [],
    )


def ensure_pet_owner(
    pet_id: uuid.UUID,
    db: Session,
    current_user: models.User,
) -> models.Pet:
    pet = db.get(models.Pet, pet_id)

    if pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pet not found",
        )

    if pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can access only your own pets",
        )

    return pet


def validate_optional_relations(
    payload: TreatmentCreate,
    db: Session,
) -> None:
    if payload.clinicId is not None:
        clinic = db.get(models.Clinic, payload.clinicId)

        if clinic is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Clinic not found",
            )

    if payload.vetId is not None:
        vet = db.get(models.User, payload.vetId)

        if vet is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vet not found",
            )


@router.get("/pets/{pet_id}/treatments", response_model=list[TreatmentRead])
def get_pet_treatments(
    pet_id: uuid.UUID,
    start: datetime | None = None,
    end: datetime | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ensure_pet_owner(
        pet_id=pet_id,
        db=db,
        current_user=current_user,
    )

    statement = select(models.Treatment).where(models.Treatment.pet_id == pet_id)

    if start:
        statement = statement.where(models.Treatment.date >= start)

    if end:
        statement = statement.where(models.Treatment.date <= end)

    treatments = (
        db.execute(statement.order_by(models.Treatment.date.desc())).scalars().all()
    )

    return [treatment_to_read(treatment) for treatment in treatments]


@router.post(
    "/treatments",
    response_model=TreatmentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_treatment(
    payload: TreatmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ensure_pet_owner(
        pet_id=payload.petId,
        db=db,
        current_user=current_user,
    )

    validate_optional_relations(
        payload=payload,
        db=db,
    )

    treatment = models.Treatment(
        pet_id=payload.petId,
        appointment_id=payload.appointmentId,
        clinic_id=payload.clinicId,
        vet_id=payload.vetId,
        is_created_by_user=payload.isCreatedByUser,
        type=payload.type,
        date=payload.date,
        vet=payload.vet,
        clinic=payload.clinic,
        diagnosis=payload.diagnosis,
        description=payload.description,
        recommendation=payload.recommendation,
        prescription=payload.prescription,
        attachments=[attachment.model_dump() for attachment in payload.attachments],
    )

    db.add(treatment)
    db.commit()
    db.refresh(treatment)

    return treatment_to_read(treatment)


@router.put("/treatments/{treatment_id}", response_model=TreatmentRead)
def update_treatment(
    treatment_id: uuid.UUID,
    payload: TreatmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    treatment = db.get(models.Treatment, treatment_id)

    if treatment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treatment not found",
        )

    ensure_pet_owner(
        pet_id=treatment.pet_id,
        db=db,
        current_user=current_user,
    )

    ensure_pet_owner(
        pet_id=payload.petId,
        db=db,
        current_user=current_user,
    )

    validate_optional_relations(
        payload=payload,
        db=db,
    )

    treatment.pet_id = payload.petId
    treatment.appointment_id = payload.appointmentId
    treatment.clinic_id = payload.clinicId
    treatment.vet_id = payload.vetId
    treatment.is_created_by_user = payload.isCreatedByUser
    treatment.type = payload.type
    treatment.date = payload.date
    treatment.vet = payload.vet
    treatment.clinic = payload.clinic
    treatment.diagnosis = payload.diagnosis
    treatment.description = payload.description
    treatment.recommendation = payload.recommendation
    treatment.prescription = payload.prescription
    treatment.attachments = [
        attachment.model_dump() for attachment in payload.attachments
    ]

    db.commit()
    db.refresh(treatment)

    return treatment_to_read(treatment)


@router.post(
    "/treatments/{treatment_id}/attachments",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def add_treatment_attachment(
    treatment_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    treatment = db.get(models.Treatment, treatment_id)

    if treatment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treatment not found",
        )

    pet = ensure_pet_owner(
        pet_id=treatment.pet_id,
        db=db,
        current_user=current_user,
    )

    upload_dir = Path("uploads") / "pets" / str(pet.id) / "treatments"
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"

    content = await file.read()
    file_path.write_bytes(content)

    attachment = {
        "name": file.filename,
        "url": f"/uploads/pets/{pet.id}/treatments/{file_path.name}",
    }

    treatment.attachments = [
        *(treatment.attachments or []),
        attachment,
    ]

    db.commit()

    return None


@router.delete(
    "/treatments/{treatment_id}/attachments",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_treatment_attachment(
    treatment_id: uuid.UUID,
    attachment: AttachmentRead = Body(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    treatment = db.get(models.Treatment, treatment_id)

    if treatment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treatment not found",
        )

    ensure_pet_owner(
        pet_id=treatment.pet_id,
        db=db,
        current_user=current_user,
    )

    treatment.attachments = [
        item
        for item in (treatment.attachments or [])
        if item.get("url") != attachment.url
    ]

    db.commit()

    return None

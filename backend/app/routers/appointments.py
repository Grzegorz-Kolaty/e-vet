import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.db import get_db
from app.routers.auth import get_current_user
from app.routers.treatments import treatment_to_read
from app.schemas import (
    AppointmentBook,
    AppointmentCreate,
    AppointmentRead,
    TreatmentCreate,
    TreatmentRead,
)

router = APIRouter(tags=["appointments"])


def appointment_to_read(appointment: models.Appointment) -> AppointmentRead:
    return AppointmentRead(
        id=appointment.id,
        vetId=appointment.vet_id,
        clinicId=appointment.clinic_id,
        clinicName=appointment.clinic_name,
        vetDisplayName=appointment.vet_display_name,
        reserved=appointment.reserved,
        realised=appointment.realised,
        city=appointment.city,
        dateTimeFrom=appointment.date_time_from,
        dateTimeTo=appointment.date_time_to,
        patientId=appointment.patient_id,
        patientName=appointment.patient_name,
        petId=appointment.pet_id,
        petName=appointment.pet_name,
    )


def ensure_appointment_access(
    appointment: models.Appointment,
    current_user: models.User,
) -> None:
    if appointment.vet_id == current_user.id:
        return

    if appointment.patient_id == current_user.id:
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You cannot access this appointment",
    )


@router.post(
    "/appointments",
    response_model=AppointmentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    clinic = db.get(models.Clinic, payload.clinicId)

    if clinic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )

    vet = db.get(models.User, payload.vetId)

    if vet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vet not found",
        )

    if payload.vetId != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can create appointments only for yourself",
        )

    appointment = models.Appointment(
        vet_id=payload.vetId,
        clinic_id=payload.clinicId,
        clinic_name=payload.clinicName,
        vet_display_name=payload.vetDisplayName,
        reserved=False,
        realised=False,
        city=payload.city,
        date_time_from=payload.dateTimeFrom,
        date_time_to=payload.dateTimeTo,
        patient_id=None,
        patient_name=None,
        pet_id=None,
        pet_name=None,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment_to_read(appointment)


@router.get("/appointments/vet", response_model=list[AppointmentRead])
def get_appointments_for_current_vet(
    start: datetime,
    end: datetime,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appointments = (
        db.execute(
            select(models.Appointment)
            .where(models.Appointment.vet_id == current_user.id)
            .where(models.Appointment.date_time_from >= start)
            .where(models.Appointment.date_time_from <= end)
            .order_by(models.Appointment.date_time_from)
        )
        .scalars()
        .all()
    )

    return [appointment_to_read(appointment) for appointment in appointments]


@router.get("/appointments/available", response_model=list[AppointmentRead])
def get_available_appointments(
    vetId: uuid.UUID,
    clinicId: uuid.UUID,
    db: Session = Depends(get_db),
):
    start_of_day = datetime.now(timezone.utc).replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    appointments = (
        db.execute(
            select(models.Appointment)
            .where(models.Appointment.vet_id == vetId)
            .where(models.Appointment.clinic_id == clinicId)
            .where(models.Appointment.date_time_from >= start_of_day)
            .where(models.Appointment.reserved.is_(False))
            .order_by(models.Appointment.date_time_from.asc())
        )
        .scalars()
        .all()
    )

    return [appointment_to_read(appointment) for appointment in appointments]


@router.put("/appointments/{appointment_id}/book", response_model=AppointmentRead)
def book_appointment(
    appointment_id: uuid.UUID,
    payload: AppointmentBook,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appointment = db.get(models.Appointment, appointment_id)

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    if appointment.reserved:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Appointment is already reserved",
        )

    pet = db.get(models.Pet, payload.petId)

    if pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pet not found",
        )

    if pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can book appointments only for your own pets",
        )

    appointment.patient_id = current_user.id
    appointment.patient_name = payload.patientName
    appointment.pet_id = payload.petId
    appointment.pet_name = payload.petName
    appointment.reserved = True

    db.commit()
    db.refresh(appointment)

    return appointment_to_read(appointment)


@router.get("/appointments", response_model=list[AppointmentRead])
def get_appointments_by_current_user_or_vet(
    role: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if role == "vet":
        statement = select(models.Appointment).where(
            models.Appointment.vet_id == current_user.id
        )
    else:
        statement = select(models.Appointment).where(
            models.Appointment.patient_id == current_user.id
        )

    appointments = (
        db.execute(statement.order_by(models.Appointment.date_time_from.desc()))
        .scalars()
        .all()
    )

    return [appointment_to_read(appointment) for appointment in appointments]


@router.get("/appointments/{appointment_id}", response_model=AppointmentRead)
def get_appointment_by_id(
    appointment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appointment = db.get(models.Appointment, appointment_id)

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    ensure_appointment_access(
        appointment=appointment,
        current_user=current_user,
    )

    return appointment_to_read(appointment)


@router.patch(
    "/appointments/{appointment_id}/realise", status_code=status.HTTP_204_NO_CONTENT
)
def mark_as_realised(
    appointment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appointment = db.get(models.Appointment, appointment_id)

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    if appointment.vet_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only assigned vet can realise appointment",
        )

    appointment.realised = True

    db.commit()

    return None


@router.post(
    "/appointments/{appointment_id}/complete",
    response_model=TreatmentRead,
)
def complete_appointment_and_add_treatment(
    appointment_id: uuid.UUID,
    payload: TreatmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appointment = db.get(models.Appointment, appointment_id)

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    if appointment.vet_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only assigned vet can complete appointment",
        )

    pet = db.get(models.Pet, payload.petId)

    if pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pet not found",
        )

    appointment.realised = True

    treatment = models.Treatment(
        pet_id=payload.petId,
        appointment_id=appointment.id,
        clinic_id=payload.clinicId,
        vet_id=current_user.id,
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


@router.get(
    "/pets/{pet_id}/appointments/upcoming", response_model=list[AppointmentRead]
)
def get_pet_upcoming_appointments(
    pet_id: uuid.UUID,
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
            detail="You can read only your own pets",
        )

    now = datetime.now(timezone.utc)

    appointments = (
        db.execute(
            select(models.Appointment)
            .where(models.Appointment.pet_id == pet_id)
            .where(models.Appointment.realised.is_(False))
            .where(models.Appointment.date_time_from >= now)
            .order_by(models.Appointment.date_time_from.asc())
        )
        .scalars()
        .all()
    )

    return [appointment_to_read(appointment) for appointment in appointments]

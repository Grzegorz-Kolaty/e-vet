import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
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
    AppointmentTreatmentCreate,
    TreatmentRead,
)

router = APIRouter(tags=["appointments"])


def appointment_to_read(appointment: models.Appointment) -> AppointmentRead:
    return AppointmentRead(
        id=appointment.id,
        vetId=appointment.vet_id,
        clinicId=appointment.clinic_id,
        reserved=appointment.reserved,
        realised=appointment.realised,
        dateTimeFrom=appointment.date_time_from,
        dateTimeTo=appointment.date_time_to,
        petId=appointment.pet_id,
        vetDisplayName=appointment.vet_display_name,
        clinicName=appointment.clinic_name,
    )


def ensure_appointment_access(
    appointment: models.Appointment,
    current_user: models.User,
    db: Session,
) -> None:
    if appointment.vet_id == current_user.id:
        return

    if appointment.pet_id is not None:
        pet = db.get(models.Pet, appointment.pet_id)

        if pet is not None and pet.owner_id == current_user.id:
            return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You cannot access this appointment",
    )


def get_clinic_for_current_vet(
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
        current_user.clinic_id = clinic.id

        current_user_id = str(current_user.id)
        vet_ids = clinic.vet_ids or []

        if current_user_id not in vet_ids:
            clinic.vet_ids = [*vet_ids, current_user_id]

        db.commit()
        db.refresh(current_user)
        db.refresh(clinic)

        return clinic

    current_user_id = str(current_user.id)
    clinics = db.execute(select(models.Clinic)).scalars().all()

    for clinic in clinics:
        if current_user_id in (clinic.vet_ids or []):
            current_user.clinic_id = clinic.id

            db.commit()
            db.refresh(current_user)
            db.refresh(clinic)

            return clinic

    return None


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
    if current_user.role != "vet":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only vet can create appointments",
        )

    if payload.dateTimeFrom >= payload.dateTimeTo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment start must be before appointment end",
        )

    clinic = get_clinic_for_current_vet(
        db=db,
        current_user=current_user,
    )

    if clinic is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Vet is not assigned to any clinic",
        )

    appointment = models.Appointment(
        vet_id=current_user.id,
        clinic_id=clinic.id,
        reserved=False,
        realised=False,
        date_time_from=payload.dateTimeFrom,
        date_time_to=payload.dateTimeTo,
        pet_id=None,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment_to_read(appointment)


@router.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
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

    if current_user.role != "vet":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only vet can delete appointment",
        )

    if appointment.vet_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can delete only your own appointments",
        )

    if appointment.reserved or appointment.pet_id is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booked appointment cannot be deleted",
        )

    db.delete(appointment)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/appointments/vet", response_model=list[AppointmentRead])
def get_appointments_for_current_vet(
    start: datetime,
    end: datetime,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "vet":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only vet can read vet appointments",
        )

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

    if appointment.realised:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Appointment is already realised",
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

    vet = db.get(models.User, appointment.vet_id)

    if vet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vet not found",
        )

    clinic = db.get(models.Clinic, appointment.clinic_id)

    if clinic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )

    appointment.pet_id = pet.id
    appointment.reserved = True

    appointment.vet_display_name = vet.name
    appointment.clinic_name = clinic.clinic_name

    db.commit()
    db.refresh(appointment)

    return appointment_to_read(appointment)


@router.get("/appointments", response_model=list[AppointmentRead])
def get_appointments_by_current_user_or_vet(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role == "vet":
        statement = select(models.Appointment).where(
            models.Appointment.vet_id == current_user.id
        )
    else:
        statement = (
            select(models.Appointment)
            .join(models.Pet, models.Appointment.pet_id == models.Pet.id)
            .where(models.Pet.owner_id == current_user.id)
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
        db=db,
    )

    return appointment_to_read(appointment)


@router.patch(
    "/appointments/{appointment_id}/realise",
    status_code=status.HTTP_204_NO_CONTENT,
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

    if appointment.pet_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No pet_id assigned to this appointment",
        )

    appointment.realised = True

    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/appointments/{appointment_id}/complete",
    response_model=TreatmentRead,
)
def complete_appointment_and_add_treatment(
    appointment_id: uuid.UUID,
    payload: AppointmentTreatmentCreate,
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

    if appointment.pet_id is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot complete appointment without assigned pet",
        )

    pet = db.get(models.Pet, appointment.pet_id)

    if pet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pet not found",
        )

    clinic = db.get(models.Clinic, appointment.clinic_id)

    if clinic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )

    appointment.realised = True

    treatment = models.Treatment(
        pet_id=appointment.pet_id,
        appointment_id=appointment.id,
        clinic_id=appointment.clinic_id,
        vet_id=current_user.id,
        is_created_by_user=False,
        type=payload.type,
        date=payload.date,
        vet=current_user.name,
        clinic=clinic.clinic_name,
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
    "/pets/{pet_id}/appointments/upcoming",
    response_model=list[AppointmentRead],
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

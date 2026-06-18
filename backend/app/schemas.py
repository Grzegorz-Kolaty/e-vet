import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=150)
    role: str = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    id: uuid.UUID
    email: EmailStr
    name: str
    role: str
    is_active: bool
    is_email_verified: bool
    clinic_id: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime
    photo_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ClinicCreate(BaseModel):
    clinicName: str
    phoneNumber: str | None = None
    address: dict[str, Any]
    vetIds: list[str] = []
    timeOpen: str | None = None
    timeClose: str | None = None
    coverImage: dict[str, Any] | None = None


class ClinicRead(BaseModel):
    id: uuid.UUID
    clinicName: str
    ownerId: uuid.UUID
    vetIds: list[str]
    phoneNumber: str | None = None
    address: dict[str, Any]
    timeOpen: str | None = None
    timeClose: str | None = None
    coverImage: dict[str, Any] | None = None
    createdAt: datetime


class AttachmentRead(BaseModel):
    name: str
    url: str


class PetCreate(BaseModel):
    name: str
    species: str
    breed: str
    sex: str
    birthDate: str | None = None
    weight: float | None = None
    photoUrl: str | None = None
    lastVisit: str | None = None
    clinic: str | None = None


class PetRead(BaseModel):
    id: uuid.UUID
    ownerId: uuid.UUID
    name: str
    species: str
    breed: str
    sex: str
    birthDate: str | None = None
    weight: float | None = None
    photoUrl: str | None = None
    lastVisit: str | None = None
    clinic: str | None = None


class TreatmentCreate(BaseModel):
    petId: uuid.UUID
    appointmentId: uuid.UUID | None = None
    clinicId: uuid.UUID | None = None
    vetId: uuid.UUID | None = None
    isCreatedByUser: bool = True
    type: str
    date: datetime | None = None
    vet: str = ""
    clinic: str = ""
    diagnosis: str = ""
    description: str = ""
    recommendation: str = ""
    prescription: str = ""
    attachments: list[AttachmentRead] = Field(default_factory=list)


class TreatmentRead(BaseModel):
    id: uuid.UUID
    petId: uuid.UUID
    appointmentId: uuid.UUID | None = None
    clinicId: uuid.UUID | None = None
    vetId: uuid.UUID | None = None
    isCreatedByUser: bool
    type: str
    date: datetime | None = None
    vet: str
    clinic: str
    diagnosis: str
    description: str
    recommendation: str
    prescription: str
    attachments: list[AttachmentRead] = Field(default_factory=list)


class AppointmentCreate(BaseModel):
    vetId: uuid.UUID
    clinicId: uuid.UUID
    clinicName: str
    vetDisplayName: str
    city: str
    dateTimeFrom: datetime
    dateTimeTo: datetime


class AppointmentBook(BaseModel):
    patientName: str
    petId: uuid.UUID
    petName: str


class AppointmentRead(BaseModel):
    id: uuid.UUID
    vetId: uuid.UUID
    clinicId: uuid.UUID
    clinicName: str
    vetDisplayName: str
    reserved: bool
    realised: bool
    city: str
    dateTimeFrom: datetime
    dateTimeTo: datetime
    patientId: uuid.UUID | None = None
    patientName: str | None = None
    petId: uuid.UUID | None = None
    petName: str | None = None

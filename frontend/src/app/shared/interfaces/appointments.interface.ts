export interface Appointment {
  id: string;

  vetId: string;
  clinicId: string;

  reserved: boolean;
  realised: boolean;

  dateTimeFrom: Date;
  dateTimeTo: Date;

  petId: string | null;
}

export interface PetUpcomingAppointment extends Appointment {
  vetDisplayName: string | null;
  clinicName: string | null;
}

export interface BookAppointmentPayload {
  petId: string;
}

export interface AppointmentDraft {
  dateTimeFrom: Date;
  dateTimeTo: Date;
}

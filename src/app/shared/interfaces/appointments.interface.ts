export interface Appointment {
  id?: string;
  vetId: string;
  clinicId: string;
  clinicName: string;
  vetDisplayName: string;
  reserved: boolean;
  realised: boolean;
  city: string;
  dateTimeFrom: Date;
  dateTimeTo: Date;
  patientId?: string;
  patientName?: string;
  petId?: string;
  petName?: string;
}

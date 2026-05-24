import {Timestamp} from "firebase/firestore";

export interface Appointment {
  id?: string;

  vetId: string;
  clinicId: string;

  vetDisplayName: string;

  reserved: boolean;
  realised: boolean;

  dateTimeFrom: Timestamp;
  dateTimeTo: Timestamp;

  city: string;

  patientId?: string;
  patientName?: string;
}

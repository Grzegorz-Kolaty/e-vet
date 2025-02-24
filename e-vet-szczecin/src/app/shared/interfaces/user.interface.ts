export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export enum Role {
  User = 'user',
  Vet = 'vet',
}

export interface Profile {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
  address?: Address;
  photoUrl?: string;
}

export interface Address {
  city: string;
  street: string;
  flatNumber: string;
  floor?: string;
  zip_code: string;
}

export interface Appointment {
  id?: string;
  vetId?: string;
  vetDisplayName: string;
  reserved: boolean;
  realised: boolean;
  dateTimeFrom: string;
  city: string;
  date: string;
  time: string;
  dateTimeTo: string;
  patientId?: string;
  patientName?: string;
}

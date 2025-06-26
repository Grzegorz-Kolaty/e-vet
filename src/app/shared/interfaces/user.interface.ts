export interface UserInterface {
  uid: string;
  email: string;
  name: string;
  role: Role;
  clinicId?: string
  picture?: string;
  email_verified: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
  role: Role
}

/**
 * @param email - Hello brother, it is login form credential
 * @param password - Hello brother, it is login form credential
 *
 */
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

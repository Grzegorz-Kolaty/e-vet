import {GeoPoint} from "firebase/firestore";

export interface Address {
  city: string;
  street: string;
  houseNumber: string;
  zipCode: string;
}

export interface Clinic {
  name: string;
  address: Address;
  id?: string;
  description: string;
  geo: GeoPoint;
}

export interface ClinicMember {
  vetId: string;
  name: string;
  email: string;
}

export interface CreateClinic extends Clinic {
  member: ClinicMember;
}

import {Role, UserInterface} from "./user.interface";
import {LocationResult, Voivodeship} from "../data-access/geo.service";

export interface Clinic {
  clinicName: string;
  phoneNumber: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postcode: string;
  city: string;
  voivodenship: Voivodeship | null;
  rawGeoData: LocationResult;
  latitude: number;
  longitude: number;
  geojson: any;
  clinicCreator: {
    uid: string,
    name: string,
    email: string,
    email_verified: boolean,
    pic?: string,
    role: Role,
    clinicId?: string,
  }
}

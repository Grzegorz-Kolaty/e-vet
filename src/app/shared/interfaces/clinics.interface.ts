import {Voivodeship} from "../data-access/geo.service";
import {GeoJsonObject} from "geojson";

export interface Clinic {
  clinicName: string;
  id: string;
  ownerId: string;
  phoneNumber: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postcode: string;
  city: string;
  voivodeship: Voivodeship | null;
  latitude: number;
  longitude: number;
  timeOpen: string;
  timeClose: string;
  geojson: GeoJsonObject;
  coverImage: {
    url: string;
  },
}

export interface ClinicLocation {
  latitude: number;
  longitude: number;
  geojson: GeoJsonObject;
  city: string;
  street: string;
  houseNumber: string;
  postcode: string;
}

// export interface ClinicCreateDto extends ClinicLocation {
//   clinicName: string;
//   phoneNumber: string;
//   voivodeship: Voivodeship | null;
//
//   clinicCreator: {
//     uid: string;
//     name: string;
//     email: string;
//     email_verified: boolean;
//     pic?: string;
//     role: Role;
//     clinicId?: string;
//   };
//
//   apartmentNumber?: string;
// }

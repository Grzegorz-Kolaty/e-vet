import {GeoJsonObject} from "geojson";
import {Voivodeship} from "../data-access/geo.service";

export interface Clinic {
  clinicName: string;
  id: string;
  ownerId?: string;
  phoneNumber: string;
  vetIds: string[];

  address: ClinicLocation;

  timeOpen: string;
  timeClose: string;

  coverImage: {
    url: string;
  };
}

export interface ClinicLocation {
  city: string;
  town: string;
  village: string;
  municipality: string;
  searchCity: string;

  street: string;
  house_number: string;
  postal_code: string;
  apartment_number: string
  voivodeship: Voivodeship

  latitude: number;
  longitude: number;
  geojson: GeoJsonObject | null;
}

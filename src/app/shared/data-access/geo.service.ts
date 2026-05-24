// import {Injectable} from '@angular/core';
// import {HttpClient} from "@angular/common/http";
// import {GeoJsonObject} from "geojson";
//
// export interface LocationResult {
//   display_name: string;
//   place_id: string;
//   lat: number;
//   lon: number;
//   geojson: GeoJsonObject;
//   boundingbox?: [string, string, string, string];
//   name: string;
//   address: {
//     state: string;
//     postcode: string;
//     road?: string;
//     city?: string;
//     town?: string;
//     village?: string;
//     house_number?: string;
//     hamlet?: string;
//     municipality?: string;
//     county?: string;
//     suburb?: string;
//   };
//   place_rank: number;
//   addresstype?: string;
//   category?: string;
// }
//
// export enum Voivodeship {
//   Dolnoslaskie = 'dolnośląskie',
//   KujawskoPomorskie = 'kujawsko-pomorskie',
//   Lubelskie = 'lubelskie',
//   Lubuskie = 'lubuskie',
//   Lodzkie = 'łódzkie',
//   Malopolskie = 'małopolskie',
//   Mazowieckie = 'mazowieckie',
//   Opolskie = 'opolskie',
//   Podkarpackie = 'podkarpackie',
//   Podlaskie = 'podlaskie',
//   Pomorskie = 'pomorskie',
//   Slaskie = 'śląskie',
//   Swietokrzyskie = 'świętokrzyskie',
//   WarminskoMazurskie = 'warmińsko-mazurskie',
//   Wielkopolskie = 'wielkopolskie',
//   Zachodniopomorskie = 'zachodniopomorskie',
// }
//
// export const VOIVODESHIPS = Object.values(Voivodeship);
//
// @Injectable({
//   providedIn: 'root',
// })
// export class GeoService {
//   constructor(private http: HttpClient) {
//   }
//
//   loadVoivodeshipGeo(v: Voivodeship | null) {
//     console.log(`returning of ${v} from service`)
//     return this.http.get<LocationResult>(`assets/geo/voivodeships/${v}.json`)
//   }
// }

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {GeoJsonObject} from "geojson";

export interface LocationResult {
  display_name: string;
  place_id: string;
  lat: number;
  lon: number;
  geojson: GeoJsonObject;
  boundingbox?: [string, string, string, string];
  name: string;
  address: {
    state: string;
    postcode: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    house_number?: string;
    hamlet?: string;
    municipality?: string;
    county?: string;
    suburb?: string;
  };
  place_rank: number;
  addresstype?: string;
  category?: string;
}

export enum Voivodeship {
  Dolnoslaskie = 'dolnośląskie',
  KujawskoPomorskie = 'kujawsko-pomorskie',
  Lubelskie = 'lubelskie',
  Lubuskie = 'lubuskie',
  Lodzkie = 'łódzkie',
  Malopolskie = 'małopolskie',
  Mazowieckie = 'mazowieckie',
  Opolskie = 'opolskie',
  Podkarpackie = 'podkarpackie',
  Podlaskie = 'podlaskie',
  Pomorskie = 'pomorskie',
  Slaskie = 'śląskie',
  Swietokrzyskie = 'świętokrzyskie',
  WarminskoMazurskie = 'warmińsko-mazurskie',
  Wielkopolskie = 'wielkopolskie',
  Zachodniopomorskie = 'zachodniopomorskie',
}

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  constructor(private http: HttpClient) {}

  async loadVoivodeshipGeo(v: Voivodeship): Promise<LocationResult> {
    return await firstValueFrom(
      this.http.get<LocationResult>(
        `assets/geo/voivodeships/${v}.json`
      )
    );
  }
}

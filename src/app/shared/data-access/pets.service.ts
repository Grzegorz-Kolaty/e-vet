import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AnimalTaxonometry} from "../interfaces/animals.interface";

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private iNaturalistAPI = 'https://api.inaturalist.org/v1/taxa';
  private http = inject(HttpClient)

  constructor() { }

  searchAnimalsTaxonomy(term: string, iconicTaxa: AnimalTaxonometry) {
    return this.http.get<any>(this.iNaturalistAPI, {
      params: {
        q: term,
        locale: 'pl',
        iconic_taxa: iconicTaxa,
        rank: 'species',
        photos: 'true',
        order_by: 'observations_count',
        quality_grade: 'research',
        per_page: '15'
      }
    })
  }

}

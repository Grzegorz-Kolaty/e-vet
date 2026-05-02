import {inject, Injectable} from '@angular/core';
import {httpsCallable} from 'firebase/functions';
import {FUNCTIONS} from "../../firebase.providers";
import {ClinicForm, CreateClinicDTO} from "../interfaces/clinics.interface";

@Injectable({ providedIn: 'root' })
export class FunctionsService {
  private functions = inject(FUNCTIONS);

  private createNewClinicFn = httpsCallable<CreateClinicDTO, { clinicId: string }>(
    this.functions,
    'createNewClinic'
  );

  createNewClinic(dto: CreateClinicDTO) {
    return this.createNewClinicFn(dto);
  }
}

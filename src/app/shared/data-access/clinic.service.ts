import {inject, Injectable} from "@angular/core";
import {FUNCTIONS} from "../../firebase.providers";
import {httpsCallable} from "firebase/functions";
import {Clinic} from "../interfaces/clinics.interface";

@Injectable({providedIn: 'root'})
export default class ClinicService {
  private functions = inject(FUNCTIONS);

  createClinic(dto: Clinic) {
    const callable = httpsCallable<Clinic, { clinicId: string }>(
      this.functions,
      'createNewClinic'
    );
    return callable(dto);
  }
}

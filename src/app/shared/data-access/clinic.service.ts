import {inject, Injectable} from "@angular/core";
import {FUNCTIONS, STORAGE} from "../../firebase.providers";
import {httpsCallable} from "firebase/functions";
import {Clinic} from "../interfaces/clinics.interface";
import {StorageService} from "./storage.service";
import {switchMap} from "rxjs";
import {FirestoreService} from "./firestore.service";

@Injectable({providedIn: 'root'})
export default class ClinicService {
  private functions = inject(FUNCTIONS);
  private storageService = inject(StorageService);
  private firestoreService = inject(FirestoreService);

  createClinic(dto: Clinic) {
    const callable = httpsCallable<Clinic, { clinicId: string }>(
      this.functions,
      'createNewClinic'
    );
    return callable(dto);
  }

  updateCover(file: File, clinicId: string) {
    return this.storageService
      .uploadAndGetUrl(file, `clinics/${clinicId}/cover.jpg`)
      .pipe(
        switchMap(url =>
          this.firestoreService.updateClinic(clinicId, {
            coverImage: {url}
          })
        )
      );
  }
}

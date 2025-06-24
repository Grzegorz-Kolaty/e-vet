import {inject, Injectable} from '@angular/core';
import {httpsCallable} from 'firebase/functions';
import {FUNCTIONS} from "../../firebase.providers";
import {CreateClinic} from "../interfaces/clinics.interface";


@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  functions = inject(FUNCTIONS);

  // setCustomClaimsRole(role: Role) {
  //   const callable = httpsCallable(this.functions, 'setCustomClaimsRole');
  //   return callable(role);
  // }


  // async setCustomClaimsRole(role: Role): Promise<boolean> {
  //   const callable = httpsCallable<any, CustomClaimsResponse>(this.functions, 'setCustomClaimsRole');
  //
  //   try {
  //     const result = await callable(role); // teraz result.data ma typ CustomClaimsResponse
  //     console.log(result)
  //
  //     if (result.data.success) {
  //       return true;
  //     } else {
  //       throw new Error('Serwer zwrócił success: false');
  //     }
  //   } catch (error) {
  //     console.error('Błąd przy ustawianiu roli:', error);
  //     throw error;
  //   }
  // }


  // updateProfile(address: string) {
  //   const callable = httpsCallable(this.functions, 'updateProfile');
  //   return callable({address: address});
  // }

  createNewClinic(data: CreateClinic) {
    const callable = httpsCallable(this.functions, 'createNewClinic');
    return callable(data);
  }
}

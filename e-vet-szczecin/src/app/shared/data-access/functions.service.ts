import {inject, Injectable} from '@angular/core';
import {httpsCallable} from 'firebase/functions';
import {Role} from '../interfaces/user.interface';
import {FUNCTIONS} from "../../firebase.providers";


@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  functions = inject(FUNCTIONS);

  setCustomClaimsRole(role: Role) {
    const callable = httpsCallable(this.functions, 'setCustomClaimsRole');
    console.log(role)
    return callable(role);
  }

  updateProfile(address: string) {
    const callable = httpsCallable(this.functions, 'updateProfile');
    return callable({address: address});
  }

}

import {inject, Injectable} from '@angular/core';
import {getFunctions, httpsCallable, HttpsCallableResult} from 'firebase/functions';
import {FUNCTIONS} from '../../app.config';
import {RegisterCredentials, Role} from '../interfaces/user.interface';
import {from, map} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  functions = inject(FUNCTIONS);
  functionsRegion = this.functions

  setRoleClaims(role: Role) {
    const functionsWithRegion = getFunctions(this.functions.app);
    const callable = httpsCallable(functionsWithRegion, 'setCustomClaims');
    return from(callable({idToken: "this.authService.onGetToken.value()?.token", role: role}));
  }

  setCustomClaimsRole(data: { role: Role, uid: string }) {
    console.log(data)
    const callable = httpsCallable(this.functionsRegion, 'setCustomClaimsRole');
    return from(callable(data))
  }

}

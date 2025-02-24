import {inject, Injectable} from '@angular/core';
import {getFunctions, httpsCallable} from 'firebase/functions';
import {FUNCTIONS} from '../../app.config';
import {Role} from '../interfaces/user.interface';
import {from} from 'rxjs';
import {AuthService} from './auth.service';
import {onRoleSelect} from '../../../../functions/src';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  functions = inject(FUNCTIONS);
  authService = inject(AuthService);
  functionsRegion = this.functions


  setRoleClaims(role: Role) {
    const functionsWithRegion = getFunctions(this.functions.app);
    const callable = httpsCallable(functionsWithRegion, 'setCustomClaims');
    return from(callable({idToken: this.authService.onGetToken.value()?.token, role: role}));
  }

  onRoleSelect() {
    const callable = httpsCallable(this.functionsRegion, 'onRoleSelect');
    return from(callable({idToken: this.authService.onGetToken.value()?.token}));
  }

}

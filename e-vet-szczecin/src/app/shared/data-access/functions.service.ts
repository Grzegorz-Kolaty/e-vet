import {inject, Injectable} from '@angular/core';
import {getFunctions, httpsCallable, httpsCallableFromURL} from 'firebase/functions';
import {FUNCTIONS} from '../../app.config';
import {Role} from '../interfaces/user.interface';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  functions = inject(FUNCTIONS);

  setRoleClaims(token: string, role: Role) {
    const functionsWithRegion = getFunctions(this.functions.app);
    const callable = httpsCallable(functionsWithRegion, 'setCustomClaims');
    return from(callable({idToken: token, role: role}));
  }

  onRoleSelected() {
    const functionsWithRegion = getFunctions(this.functions.app);
    const callable = httpsCallable(functionsWithRegion, 'onRoleSelect');
    return from(callable());
  }
}

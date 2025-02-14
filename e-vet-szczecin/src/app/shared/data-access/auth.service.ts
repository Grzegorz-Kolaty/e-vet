import {
  effect,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import {from} from 'rxjs';
import {Credentials, Role} from '../interfaces/user.interface';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  applyActionCode,
  getIdTokenResult,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import {authState} from 'rxfire/auth';
import {AUTH} from '../../app.config';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(AUTH);
  router = inject(Router);

  user = toSignal(authState(this.auth), {initialValue: null});

  onGetToken = rxResource({
    request: this.user,
    loader: obj => from(getIdTokenResult(obj.request!)),
  });

  isEmailVerified = linkedSignal(() => {
    return !!this.user()?.emailVerified;
  });

  userToken = linkedSignal(() => {
    return this.onGetToken.value()?.token;
  });

  userDisplayName = linkedSignal(() => this.user()?.displayName);
  userPhoto = linkedSignal(() => this.user()?.photoURL);

  isProfileCompleted = linkedSignal(() => {
    return !!this.user() && this.isEmailVerified() && !!this.userRole();
  });

  userRole = signal<Role | null>(null);

  constructor() {
    effect(() => {
      const tokenResult = this.onGetToken.value();
      if (tokenResult) {
        console.log('Role from token:', tokenResult.claims['role']);
        this.userRole.set((tokenResult.claims['role'] as Role) ?? null);
        this.userToken.set(tokenResult.token);
      }
    });
  }

  register(credentials: Credentials) {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      ).then(() => {
      })
    );
  }

  login(credentials: Credentials) {
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      ).then(() => {
      })
    );
  }

  logout() {
    return signOut(this.auth).then(() =>
      this.router.navigate(['auth', 'login'])
    );
  }

  updateProfileData(
    profileData: { displayName?: string | null; photoURL?: string | null },
    user: User
  ) {
    return from(updateProfile(user, profileData));
  }

  initiateEmail(user: User) {
    return from(sendEmailVerification(user));
  }

  resetPassword(email: string) {
    const auth = this.auth
    // const newPassword = password;
    // const actions = {
    //     url: `https://www.example.com/?email=${email}?newPassword=${newPassword}`,
    //     iOS: {bundleId: 'com. example. ios'},
    //     android: {packageName: 'com. example. android', installApp: true, minimumVersion: '12'},
    //     handleCodeInApp: true
    //
    // }
    return from(sendPasswordResetEmail(auth, email))
  }

  // applyEmailVerificationCode = (code: string) =>
  //   applyActionCode(this.auth, code).then(() => window.location.reload());

  applyEmailVerificationCode(code: string) {
    const auth = this.auth;
    return from(applyActionCode(auth, code).then(() => {
    }));

    // applyEmailVerificationCode(code: string) {
    //   const auth = this.auth;
    //   return applyActionCode(auth, code).then(() => {
    //     if (auth.currentUser) {
    //       return auth.currentUser.reload();
    //     }
    //     return
    //   });
    // }
  }
}

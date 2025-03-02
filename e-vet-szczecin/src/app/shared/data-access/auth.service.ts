import {
  computed,
  effect,
  inject,
  Injectable, linkedSignal, signal,
} from '@angular/core';
import {forkJoin, from, map, switchMap, tap} from 'rxjs';
import {Credentials, RegisterCredentials, Role} from '../interfaces/user.interface';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  applyActionCode,
  User,
  sendPasswordResetEmail,
  confirmPasswordReset,
  getIdTokenResult,
  signInWithCustomToken,
} from 'firebase/auth';
import {authState} from 'rxfire/auth';
import {AUTH} from '../../app.config';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {FunctionsService} from './functions.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(AUTH);
  router = inject(Router);
  functionsService = inject(FunctionsService)

  user = toSignal(authState(this.auth), {initialValue: null});
  verifiedEmailedUser = linkedSignal(() => {
    return this.user()?.emailVerified ? this.user() : null
  })
  userRole = signal<Role | null>(null);

  onGetToken = rxResource({
    request: () => this.user(),
    loader: obj => from(getIdTokenResult(obj.request!, true)),
  });

  isLoadingToken = computed(() => this.onGetToken.isLoading());

  constructor() {
    effect(() => {
      const tokenResult = this.onGetToken.value();
      if (tokenResult) {
        // console.log('Role from token:', tokenResult.claims['role'], tokenResult);
        // console.log('emailVerified from token:', tokenResult.claims['email_verified'])
        this.verifiedEmailedUser.set((tokenResult.claims['email_verified'] ? this.user() : null))
        this.userRole.set((tokenResult.claims['role'] as Role) ?? null);
      }
    });
  }

  refreshToken() {
    this.onGetToken.reload()
  }

  register(credential: RegisterCredentials) {
    return from(createUserWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    )).pipe(
      switchMap(credentials =>
        forkJoin([
          this.updateProfileData({ displayName: credential.displayName }, credentials.user),
          this.initiateEmail(credentials.user),
          this.functionsService.setCustomClaimsRole({ role: Role.User, uid: credentials.user.uid })
        ])
      )
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

  login2(token: string) {
    return from(signInWithCustomToken(this.auth, token).then(() => {
      })
    );
  }


  logout() {
    return signOut(this.auth).then(() => this.router.navigate(['auth', 'login']));
  }

  updateProfileData(
    profileData: { displayName?: string | null; photoURL?: string | null },
    user: User
  ) {
    return from(updateProfile(user, profileData));
  }

  initiateEmail(user: User) {
    return from(sendEmailVerification(user));
    // return new Error();

  }

  resetPassword(email: string) {
    return from(sendPasswordResetEmail(this.auth, email))
  }

  confirmPasswordReset(oobCode: string, newPassword: string) {
    return from(confirmPasswordReset(this.auth, oobCode, newPassword))
  }

  verifyEmail(oobCode: string) {
    return from(applyActionCode(this.auth, oobCode));
  }

}

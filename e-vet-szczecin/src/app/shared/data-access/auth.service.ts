import {
  computed,
  effect,
  inject,
  Injectable, linkedSignal, signal,
} from '@angular/core';
import {from} from 'rxjs';
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
        console.log(tokenResult.claims['role'], tokenResult.claims['displayName'])
      }
    });
  }

  refreshToken() {
    this.onGetToken.reload()
  }

  async register(registerForm: RegisterCredentials) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, registerForm.email, registerForm.password);
      await updateProfile(credential.user, {displayName: registerForm.displayName});
      await this.functionsService.setCustomClaimsRole(registerForm.role);
      await sendEmailVerification(credential.user);
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      throw error;
    }
  }

  // register(credential: RegisterCredentials) {
  //   return from(createUserWithEmailAndPassword(
  //     this.auth,
  //     credential.email,
  //     credential.password
  //   )).pipe(
  //     switchMap(credentials =>
  //       this.updateProfileData({displayName: credential.displayName}, credentials.user).pipe(
  //         switchMap(() => this.initiateEmail(credentials.user)),
  //         switchMap(() => this.functionsService.setCustomClaimsRole(credential.role))
  //       )
  //     )
  //   );
  // }

  // register(credential: RegisterCredentials) {
  //   return from(createUserWithEmailAndPassword(
  //     this.auth,
  //     credential.email,
  //     credential.password
  //   )).pipe(forkJoin(credentials =>
  //      this.updateProfileData({displayName: credential.displayName}, credentials.user))
  //       this.initiateEmail(credentials.user));
  //       this.functionsService.setCustomClaimsRole(credential.role))
  //     )
  //   )
  // }


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
    return signOut(this.auth).then(() => this.router.navigate(['auth', 'login']));
  }

  updateProfileData(
    profileData: { displayName?: string | null; photoURL?: string | null },
    user: User
  ) {
    return from(updateProfile(user, profileData));
  }

  async updateProfiles(username: string) {
    const user = this.user();
    if (!user) {
      throw new Error('User not found');
    }
    await updateProfile(user, {displayName: username});
  }

  initiateEmail(user: User) {
    return from(sendEmailVerification(user));
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

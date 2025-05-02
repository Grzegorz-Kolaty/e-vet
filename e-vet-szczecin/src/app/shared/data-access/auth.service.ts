import {
  inject,
  Injectable,
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
  signInWithEmailLink
} from 'firebase/auth';
import {authState} from 'rxfire/auth';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {FunctionsService} from './functions.service';
import {AUTH} from "../../firebase.providers";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(AUTH);
  router = inject(Router);
  functionsService = inject(FunctionsService)

  user$ = authState(this.auth);
  user = toSignal(this.user$, {initialValue: null});
  // verifiedEmailedUser = linkedSignal(() => {
  //   return this.user()?.emailVerified ? this.user() : null
  // })
  // userRole = signal<Role | null>(null);

  // onGetToken = rxResource({
  //   request: () => this.user(),
  //   loader: obj => from(getIdTokenResult(obj.request!, true)),
  // });

  refreshToken() {
    console.log('refresh token auth service');
    // this.onGetToken.reload()
  }

  async register(registerForm: RegisterCredentials) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, registerForm.email, registerForm.password);
      await this.functionsService.setCustomClaimsRole(Role.User)
      return await sendEmailVerification(userCredential.user)
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      throw error;
    }
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


  async logout() {
    return await signOut(this.auth);
    // return await this.router.navigate(['auth', 'login']);
  }

  updateProfileData(
    profileData: { displayName?: string | null; photoURL?: string | null },
    user: User
  ) {
    return from(updateProfile(user, profileData));
  }

  async updateProfiles(username: string) {
    const user = this.user();
    // if (!user) {
    //   throw new Error('User not logged in');
    // }
    if (user) {
      await updateProfile(user, {displayName: username});
    }
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

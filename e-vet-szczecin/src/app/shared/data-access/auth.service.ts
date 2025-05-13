import {effect, inject, Injectable, signal} from '@angular/core';
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
  signInAnonymously,
  IdTokenResult
} from 'firebase/auth';
import {authState} from 'rxfire/auth';
import {toSignal} from '@angular/core/rxjs-interop';
import {FunctionsService} from './functions.service';
import {AUTH} from "../../firebase.providers";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(AUTH);
  private readonly functionsService = inject(FunctionsService);

  user = toSignal(authState(this.auth), {initialValue: null});
  role = signal<Role | undefined>(undefined);
  vetClinicId = signal<string | undefined>(undefined)

  constructor() {
    effect(async () => {
      const user = this.user()
      if (user) {
        // await this.refreshIdToken()
        await this.refreshIdToken()
      }
    })

  }

   setRoles(idTokenResult: IdTokenResult) {
        console.log(idTokenResult.claims)
        if (idTokenResult.claims['role'] === Role.Vet) {
          this.role.set(Role.Vet)
        }
        if (idTokenResult.claims['role'] === Role.User) {
          this.role.set(Role.User)
        }
        if (idTokenResult.claims['clinicId']) {
          const clinicId = idTokenResult.claims['clinicId'] as string
          this.vetClinicId.set(clinicId)
        }

  }

  async refreshIdToken() {
    const currentUser = this.auth.currentUser; // Pobierz aktualnego użytkownika z Firebase Authentication

    if (!currentUser) {
      throw new Error('Brak zalogowanego użytkownika');
    }

    const token = await currentUser.getIdTokenResult(true);
    // await currentUser.reload()
    this.setRoles(token)
  }

  async register(registerForm: RegisterCredentials) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, registerForm.email, registerForm.password);
      await sendEmailVerification(userCredential.user);

      await this.functionsService.setCustomClaimsRole(registerForm.role);
      // const success = await this.functionsService.setCustomClaimsRole(registerForm.role);
      // if (!success) {
      //   throw new Error('Nie udało się ustawić roli');
      // }

      // await new Promise(resolve => setTimeout(resolve, 3000));
      // await this.refreshIdToken();

    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      throw error;
    }
  }

  async login(credentials: Credentials) {
    await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    )
    await this.refreshIdToken()
    // await this.setRoles(userCredential.user, true)
  }

  // async signInAnonymously() {
  //   return await signInAnonymously(this.auth)
  // }

  async logout() {
    return await signOut(this.auth);
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

  async initiateEmail(user: User) {
    return await sendEmailVerification(user);
  }

  async resetPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email)
  }

  async confirmPasswordReset(oobCode: string, newPassword: string) {
    return await confirmPasswordReset(this.auth, oobCode, newPassword)
  }

  async verifyEmail(oobCode: string) {
    try {
      await applyActionCode(this.auth, oobCode);
      await this.refreshIdToken()
    } catch (err) {
      throw new Error('User email not verified')
    }

  }

}

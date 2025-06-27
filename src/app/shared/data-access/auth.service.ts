import {computed, inject, Injectable, signal} from '@angular/core';
import {Credentials, RegisterCredentials, UserInterface} from '../interfaces/user.interface';
import {
  applyActionCode,
  confirmPasswordReset,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import {httpsCallable} from "firebase/functions";
import {AUTH, FUNCTIONS} from "../../firebase.providers";
import {idToken, user} from "rxfire/auth";
import {jwtDecode} from "jwt-decode";
import {toSignal} from "@angular/core/rxjs-interop";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(AUTH);
  private readonly functions = inject(FUNCTIONS);

  user$ = user(this.auth)
  token = toSignal(idToken(this.auth))
  // selectors
  firebaseUser = signal<User | null>(null)

  user = computed(async () => {
    const userObj = this.firebaseUser()
    if (userObj) {
      console.log(this.token())
      const token = await userObj.getIdToken()
      console.log(token)
      await userObj.reload()
      const userInterface = this.deserializeUserToken(token)
      console.log(userInterface)
      return userInterface
    }
    return null
  })
  // user = signal<UserInterface | null>(null)

  public async reloadUser() {
    if (this.auth.currentUser) {
      try {
        await this.auth.currentUser.getIdToken(true);
        await this.auth.currentUser.reload();
      } catch (error) {
        console.error('verify email err', error);
      }
    }
  }

  public deserializeUserToken(token: string): UserInterface {
    return jwtDecode(token)
  }

  public async register(registerForm: RegisterCredentials) {
    return httpsCallable(this.functions, 'createUser')(registerForm)
  }

  public login(credentials: Credentials) {
    return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
  }

  public async logout() {
    await signOut(this.auth);
  }

  public async updateProfileData(profileData: { displayName?: string | null; photoURL?: string | null }, user: User) {
    return updateProfile(user, profileData);
  }

  public async updateProfiles(username: string) {
    const user = this.firebaseUser();
    if (user) {
      return updateProfile(user, {displayName: username});
    }
  }

  public async initiateEmail(user: User) {
    await sendEmailVerification(user)
  }

  public async resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email)
  }

  public async confirmPasswordReset(oobCode: string, newPassword: string) {
    return confirmPasswordReset(this.auth, oobCode, newPassword)
  }

  public async verifyEmail(oobCode: string) {
    await applyActionCode(this.auth, oobCode)
    await this.reloadUser()
  }
}

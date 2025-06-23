import {inject, Injectable, signal} from '@angular/core';
import {Credentials, RegisterCredentials, UserInterface} from '../interfaces/user.interface';
import {
  applyActionCode,
  confirmPasswordReset,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {httpsCallable} from "firebase/functions";
import {AUTH, FUNCTIONS} from "../../firebase.providers";
import {UserService} from "./user.service";
import {user} from "rxfire/auth";
import {tap} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly auth = inject(AUTH);
  private readonly functions = inject(FUNCTIONS);
  private readonly userService = inject(UserService)


  user$ = user(this.auth).pipe(
    tap(async (user) => {
      this.firebaseUser.set(user)
      const token = await user?.getIdToken()
      if (token) {
        this.user.set(this.userService.deserializeUserToken(token))
      } else {
        this.user.set(null)
        this.userService.clearLocalStorage()
      }
    }),
  )

  // selectors
  firebaseUser = signal<User | null>(null)
  user = signal<UserInterface | null>(null)

  public async register(registerForm: RegisterCredentials) {
    return httpsCallable(this.functions, 'createUser')(registerForm)
  }

  public login(credentials: Credentials) {
    return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
  }

  public async logout() {
    this.userService.clearLocalStorage()
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
    return sendEmailVerification(user);
  }

  public async resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email)
  }

  public async confirmPasswordReset(oobCode: string, newPassword: string) {
    return confirmPasswordReset(this.auth, oobCode, newPassword)
  }

  public async verifyEmail(oobCode: string) {
    await applyActionCode(this.auth, oobCode)
    if (this.auth.currentUser) {
      try {
        await this.auth.currentUser.getIdToken(true)
        await this.auth.currentUser.reload()
      } catch (error) {
        console.error('verify email err')
      }
    }
  }
}

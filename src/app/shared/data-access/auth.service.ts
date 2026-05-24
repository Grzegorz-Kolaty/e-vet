import {effect, inject, Injectable, signal} from '@angular/core';
import {Credentials, RegisterCredentials, Role, UserProfile} from '../interfaces/userProfile';
import {
  applyActionCode,
  confirmPasswordReset,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import {httpsCallable} from "firebase/functions";
import {AUTH, FUNCTIONS} from "../../firebase.providers";
import {UserService} from "./user.service";
import {jwtDecode} from "jwt-decode";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly auth = inject(AUTH);
  private readonly functions = inject(FUNCTIONS);
  private readonly userService = inject(UserService);

  firebaseUser = signal<User | null>(null);
  user = signal<UserProfile | null>(null);

  init(): Promise<void> {
    console.log('init proc')
    return new Promise((resolve) => {

      let resolved = false;

      const unsub = onAuthStateChanged(this.auth, async (user) => {
        this.firebaseUser.set(user);

        if (user) {
          const token = await user.getIdToken()
          const data = this.deserializeUserToken(token)
          const role = data.role;


          const profile = await this.userService.loadProfile(user.uid, role);
          this.user.set(profile ?? null);
        } else {
          this.user.set(null);
        }

        if (!resolved) {
          resolved = true;
          resolve();
        }
      });
    });
  }

  public deserializeUserToken(token: string): UserProfile {
    return jwtDecode(token)
  }

  public async logout() {
    await this.auth.signOut();
  }

  public async register(registerForm: RegisterCredentials) {
    await httpsCallable(this.functions, 'createUser')(registerForm)
  }

  public async login(credentials: Credentials) {
    await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
  }

  public async initiateEmail(user: User) {
    await sendEmailVerification(user)
  }

  public async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  public async confirmPasswordReset(oobCode: string, newPassword: string) {
    await confirmPasswordReset(this.auth, oobCode, newPassword)
  }

  public async verifyEmail(oobCode?: string) {
    if (!oobCode) {
      throw new Error('Brak kodu weryfikacji email');
    }
    await applyActionCode(this.auth, oobCode);
  }
}

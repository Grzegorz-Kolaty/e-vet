import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { defer, from } from "rxjs";
import { Credentials } from "../interfaces/user.interface";
import { SubscriptionsManager } from "../../shared/utils/subscriber-manager";
import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';
import { AUTH, FUNCTIONS } from "../../app.config";
import { authState } from "rxfire/auth";
import { httpsCallable } from "firebase/functions";

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  auth = inject(AUTH);
  functions = inject(FUNCTIONS)

  //sources
  subs = new SubscriptionsManager();
  private user$ = authState(this.auth);

  private state = signal<AuthState>({
    user: undefined,
  })

  //selectors
  user = computed(() => this.state().user)

  constructor() {
    this.subs.add = this.user$.pipe().subscribe(
      (user) => {
        this.state.update((state) => ({
          ...state,
          user,
        }))
      }
    );
  }

  getUserClaims() {
    return from(
      defer(() => getIdTokenResult(this.auth.currentUser!).then(
        (data) => data.claims
      ))
    );
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }


  logout() {
    signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password)
      )
    );
  }


  setCustomClaimsToTrue() {
    const uid = this.user()?.uid;
    const claims = { admin: true };

    const callable = httpsCallable(this.functions, 'setCustomClaims');

    return from(
      defer(() =>
        callable({ uid, claims }).then((result) => {
          console.log("Custom claims set successfully:", result.data);
          return result.data;
        }).catch((error) => {
          console.error("Error setting custom claims:", error);
          throw error;
        })
      )
    );
  }

  setCustomClaimsToFalse() {
    const uid = this.user()?.uid;
    const claims = { admin: false };

    const callable = httpsCallable(this.functions, 'setCustomClaims');

    return from(
      defer(() =>
        callable({ uid, claims }).then((result) => {
            console.log("Custom claims set successfully:", result.data);
            return result.data;
          }
        ).catch((error) => {
          console.error("Error setting custom claims:", error);
          throw error;
        })
      )
    );
  }

  createAccWithGoogle() {
    return from(
      defer(() => signInWithPopup(this.auth, new GoogleAuthProvider()).then(
          (auth) => console.log(auth)
        )
      )
    );
  }

  signInWithPhone() {
    const phone: string = '500200111';
    const recaptchaVerifier = new RecaptchaVerifier(this.auth, 'sign-in-button');
    return from(
      defer(() => signInWithPhoneNumber(this.auth, phone, recaptchaVerifier))
    )
  }

  ngOnDestroy(): void {
    this.subs.dispose()
  }
}

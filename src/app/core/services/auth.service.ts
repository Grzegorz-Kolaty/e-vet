import {computed, inject, Injectable, OnDestroy, signal} from '@angular/core';
import {defer, from} from "rxjs";
import {Credentials} from "../interfaces/user.interface";
import {SubscriptionsManager} from "../../shared/utils/subscriber-manager";
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  User
} from '@angular/fire/auth';
import {Firestore} from "@angular/fire/firestore";
import {connectFunctionsEmulator, getFunctions, httpsCallable} from "@angular/fire/functions";


export type AuthUser = User | null | undefined;


interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  authInstance = inject(Auth);
  firestore = inject(Firestore);

  //sources
  subs = new SubscriptionsManager()
  private user$ = authState(this.authInstance);

  private state = signal<AuthState>({
    user: undefined,
  })

  //selectors
  user = computed(() => this.state().user)

  constructor() {
    this.subs.add = this.user$.pipe().subscribe(
      (user: User) => {
        this.state.update((state) => ({
          ...state,
          user,
        }))
      })

  }

  getUserClaims() {
    return from(
      defer(() => getIdTokenResult(this.authInstance.currentUser!).then(
        (data) => data.claims
      ))
    )
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.authInstance,
          credentials.email,
          credentials.password
        )
      )
    )
  }


  logout() {
    signOut(this.authInstance);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.authInstance,
          credentials.email,
          credentials.password)
      )
    );
  }


  // setCustomClaims(userId: string, claims: any) {
  //   // const callable = httpsCallable(this.functions, 'setCustomUserClaims');
  //   // connectFunctionsEmulator(this.functions, "localhost", 5001);
  //   //
  //   // return from(
  //   //   defer(() =>
  //   //     callable({userId, claims}).then((result) => {
  //   //       console.log("Clinic profile updated successfully:", result.data);
  //   //       return result.data;
  //   //     }).catch((error) => {
  //   //       console.error("Error updating clinic profile:", error);
  //   //       throw error;
  //   //     })
  //   //   )
  //   // );
  // }

  getNumbersFunction() {
    const functions = getFunctions();
    // connectFunctionsEmulator(functions, 'localhost', 5001)
    const callable = httpsCallable(functions, 'getNumbers');
    const messageText = 'asd';
    callable({text: messageText})
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        // @ts-ignore
        const sanitizedMessage = data.text;
      })
      .catch((error) => {
        const code = error.code;
        const message = error.message;
        const details = error.details;
      });
  }

  setCustomClaims() {
    const functions = getFunctions();
    const uid = this.user()?.uid; // UID użytkownika
    const claims = { admin: true }; // Claims do ustawienia
    // Jeśli używasz emulatora lokalnie, podłącz go do odpowiedniego hosta i portu
    connectFunctionsEmulator(functions, 'localhost', 5001);

    // Pobierz funkcję callable
    const callable = httpsCallable(functions, 'setCustomClaims');

    // Zwróć wynik jako Observable
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

  createAccWithGoogle() {
    return from(
      defer(() => signInWithPopup(this.authInstance, new GoogleAuthProvider()).then(
          (auth) => console.log(auth)
        )
      )
    )
  }

  signInWithPhone() {
    const phone: string = '500200111'
    const recaptchaVerifier = new RecaptchaVerifier(this.authInstance, 'sign-in-button')
    return from(
      defer(() => signInWithPhoneNumber(this.authInstance, phone, recaptchaVerifier))
    )
  }

  ngOnDestroy(): void {
    this.subs.dispose()
  }
}

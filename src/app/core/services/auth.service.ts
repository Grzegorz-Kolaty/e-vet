import {computed, inject, Injectable, OnDestroy, signal} from '@angular/core';
import {defer, from, map, Observable} from "rxjs";
import {Credentials} from "../interfaces/user.interface";
import {SubscriptionsManager} from "../../shared/utils/subscriber-manager";
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';


export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private authInstance = inject(Auth);

  //sources
  subs = new SubscriptionsManager()
  private user$ = authState(this.authInstance);
  roles$: Observable<string> | undefined
  private state = signal<AuthState>({
    user: undefined,
    role: ""
  })

  //selectors
  user = computed(() => this.state().user)
  role = computed(() => this.state().role)

  constructor() {
    this.subs.add = this.user$.pipe().subscribe(
      (user: User) => {
        // const role = await user.getIdTokenResult().then(data => data.claims['role'] as string || null)
        this.state.update((state) => ({
          ...state,
          user,
        }))
        // if (this.state()) {
        //   this.setRole(user).subscribe((data) => console.log(data))
        // }
      //   this.roles$ = this.afAuth.idTokenResult.pipe(
      //     map(token => <any>token?.claims ?? {admin: false})
      //   )
      })

  }

  setRole(user: User) {
    const currentUser = this.authInstance.currentUser
    return from(
      defer(() =>
        getIdTokenResult(user)
      )
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

  ngOnDestroy(): void {
    this.subs.dispose()
  }


}

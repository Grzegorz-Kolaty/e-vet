import {Component, effect, inject} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {LoginFormComponent} from "./ui/login-form/login-form.component";
import {LoginService} from "./data-access/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  providers: [LoginService],
  template: `
    <div class="container">
      <app-login-form (login)="loginService.login$.next($event)"/>
    </div>`,
})
export default class LoginComponent {
  authService = inject(AuthService);
  loginService = inject(LoginService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['dashboard'])
        this.authService.roles$?.subscribe(roles => console.log(roles))
        // this.authService.user()?.getIdTokenResult().then(customClaims => {
        //   const role = customClaims.claims['role'];
        //   console.log('Role:', role);
        // });
      }
    })
  }
}
// const user = this.authService.user()

// if (user) {
//   // Pobierz custom claims użytkownika
//   user.getIdTokenResult().then(idTokenResult => {
//     const claims = idTokenResult.claims;
//     console.log({claims})
//     console.log(claims['role'])
//
//     // Sprawdź custom claims i przekieruj w zależności od roli
//     if (claims['role']) {
//       this.router.navigate(['dashboard', 'vet']);
//       console.log("vet")
//     } else {
//       this.router.navigate(['dashboard', 'user']);
//       console.log("user")
//
//     }
//   });
// }
//     });
//   }
// }


// console.log(this.authService.user()?.getIdTokenResult().then(value => console.log(value)));
// this.authService.user$.subscribe((data : any) => {
//   console.log(data)
// })

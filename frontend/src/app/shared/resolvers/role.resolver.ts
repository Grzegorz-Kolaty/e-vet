import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {UserInterface} from "../interfaces/user.interface";
import {AuthService} from "../data-access/auth.service";


export const userDataResolver: ResolveFn<UserInterface | null> = () => {
  const authService = inject(AuthService)
  console.log(authService.user())
  return authService.user()
};

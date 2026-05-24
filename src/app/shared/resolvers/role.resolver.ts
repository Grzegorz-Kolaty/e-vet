import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {UserProfile} from "../interfaces/userProfile";
import {AuthService} from "../data-access/auth.service";


export const userDataResolver: ResolveFn<UserProfile | null> = () => {
  const authService = inject(AuthService)
  console.log(authService.user())
  return authService.user()
};

import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {UserInterface} from "../interfaces/user.interface";
import {UserService} from "../data-access/user.service";


export const userDataResolver: ResolveFn<UserInterface | null> = () => {
  const userService = inject(UserService)
  return userService.getUserLoggedIn()
};

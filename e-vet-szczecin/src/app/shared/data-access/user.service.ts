import {Injectable} from "@angular/core";
import {UserInterface} from "../interfaces/user.interface";
import {jwtDecode} from "jwt-decode";


@Injectable({
  providedIn: 'root',
})
export class UserService {

  setUserLoggedIn(user: UserInterface) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  getUserLoggedIn(): UserInterface | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  deserializeUserToken(token: string): UserInterface {
    const decoded: any = jwtDecode(token);

    // this.setUserLoggedIn(user);
    return {
      uid: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      picture: decoded.picture,
      emailVerified: decoded.email_verified
    }
  }

  clearLocalStorage() {
    localStorage.clear()
  }

}

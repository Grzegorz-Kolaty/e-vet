import { Injectable } from '@angular/core';
import {Role} from "../interfaces/user.interface";
import {jwtDecode} from "jwt-decode";


interface DecodedToken {
  role?: Role;
  clinicId?: string;
  [key: string]: any;
}


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  deserializeToken(token: string) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded)
      // return decoded ?? null;
    } catch (error) {
      console.error('Token deserialization failed:', error);
      // return null;
    }
  }
}

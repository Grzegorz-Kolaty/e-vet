import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {UserInterface} from "../interfaces/user.interface";

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private readonly http = inject(HttpClient)

  updateName(name: string) {
    return firstValueFrom(
      this.http.patch<UserInterface>('/me', {name})
    )
  }

  uploadProfilePhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return firstValueFrom(
      this.http.put<UserInterface>('/me/photo', formData)
    )
  }

  requestEmailChange(email: string, password: string): Promise<{ status: string }> {
    return firstValueFrom(
      this.http.post<{ status: string }>('/me/email-change', {
        email,
        password,
      }),
    );
  }

  confirmEmailChange(token: string): Promise<{ status: string }> {
    return firstValueFrom(
      this.http.post<{ status: string }>('/me/email-change/confirm', {
        token,
      }),
    );
  }
}

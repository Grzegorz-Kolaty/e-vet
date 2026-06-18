import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

import {
  Credentials,
  RegisterCredentials,
  UserInterface,
} from '../interfaces/user.interface';

type UserResponse = Omit<UserInterface, 'created_at' | 'updated_at'> & {
  created_at: string;
  updated_at: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user = signal<UserInterface | null>(null);
  readonly initialized = signal(false);

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isLoadingAuth = computed(() => !this.initialized());

  private initPromise: Promise<UserInterface | null> | null = null;

  init(): Promise<UserInterface | null> {
    if (!this.initPromise) {
      this.initPromise = this.loadCurrentUser();
    }

    return this.initPromise;
  }

  async login(credentials: Credentials): Promise<UserInterface> {
    try {
      const response = await firstValueFrom(
        this.http.post<UserResponse>('/auth/login', credentials),
      );

      const user = this.mapUser(response);

      this.user.set(user);
      this.initialized.set(true);

      return user;
    } catch (error) {
      this.user.set(null);
      this.initialized.set(true);
      throw new Error(this.getErrorMessage(error));
    }
  }

  async register(registerForm: RegisterCredentials): Promise<UserInterface> {
    try {
      const response = await firstValueFrom(
        this.http.post<UserResponse>('/auth/register', {
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          role: registerForm.role,
        }),
      );

      return this.mapUser(response);
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async loadCurrentUser(): Promise<UserInterface | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<UserResponse>('/me'),
      );

      const user = this.mapUser(response);

      this.user.set(user);

      return user;
    } catch {
      this.user.set(null);
      return null;
    } finally {
      this.initialized.set(true);
    }
  }

  async logout() {
    try {
      await firstValueFrom(
        this.http.post<{ status: string }>('/auth/logout', {}),
      );
    } finally {
      this.user.set(null);
      this.initialized.set(true);
      this.initPromise = null;
    }
  }

  async verifyEmail(token: string) {
    return firstValueFrom(
      this.http.post<{ status: string }>('/auth/verify-email', {token})
    );
  }

  forgotPassword(email: string) {
    return firstValueFrom(
      this.http.post<{ status: string }>('/auth/forgot-password', { email })
    );
  }

  resetPassword(token: string, password: string) {
    return firstValueFrom(
      this.http.post<{ status: string }>('/auth/reset-password', {
        token,
        password,
      })
    );
  }


  private mapUser(user: UserResponse): UserInterface {
    return {
      ...user,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
    };
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) return 'Nieprawidłowy email lub hasło.';
      if (error.status === 403) return 'Konto jest nieaktywne.';
      if (error.status === 409) return 'Konto z tym adresem email już istnieje.';

      if (Array.isArray(error.error?.detail)) {
        return error.error.detail
          .map((item: { msg?: string }) => item.msg)
          .filter(Boolean)
          .join(', ');
      }

      if (error.error?.detail) {
        return String(error.error.detail);
      }
    }

    return 'Wystąpił błąd. Spróbuj ponownie.';
  }

  async initiateEmail(_user?: unknown): Promise<void> {
    throw new Error('Weryfikacja email nie jest jeszcze obsługiwana przez nowe API.');
  }

  async confirmPasswordReset(
    _oobCode: string,
    _newPassword: string,
  ): Promise<void> {
    throw new Error('Potwierdzenie resetu hasła nie jest jeszcze obsługiwane przez nowe API.');
  }
}

import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../../shared/data-access/users.service";
import {AuthService} from "../../shared/data-access/auth.service";

type ConfirmStatus = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-confirm-email-change',
  standalone: true,
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-5 text-center">

              @if (status() === 'loading') {
                <div class="spinner-border mb-3"></div>
                <h5>Potwierdzanie adresu email...</h5>
              }

              @if (status() === 'success') {
                <h5>Adres email został zmieniony</h5>

                <p class="text-muted mb-0">
                  Twój nowy adres email został potwierdzony.
                </p>
              }

              @if (status() === 'error') {
                <h5>Nie udało się zmienić adresu email</h5>

                <p class="text-muted mb-0">
                  Link jest nieprawidłowy albo wygasł.
                </p>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfirmEmailChangeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);

  protected readonly status = signal<ConfirmStatus>('loading');

  constructor() {
    void this.confirmEmailChange();
  }

  private async confirmEmailChange() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status.set('error');
      return;
    }

    try {
      await this.usersService.confirmEmailChange(token);
    } catch {
      this.status.set('error');
      return;
    }

    this.status.set('success');

    if (this.authService.isAuthenticated()) {
      try {
        await this.authService.refreshCurrentUser();
      } catch {
        // email został już zmieniony;
        // błąd odświeżenia profilu nie powinien zmieniać statusu potwierdzenia
      }
    }
  }
}

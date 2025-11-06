import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, resource, signal} from '@angular/core';
import {AuthService} from "../../../shared/data-access/auth.service";
import {User} from "firebase/auth";
import {LoaderComponent} from "../../../shared/ui/loader/loader.component";

@Component({
  selector: 'app-send-email-verification',
  imports: [
    LoaderComponent
  ],
  template: `
    @if (onSendVerificationEmail.isLoading()) {
      <app-loader/>
    }

    @if (onSendVerificationEmail.status() === 'resolved') {
      <div class="bg-success text-center rounded-4 p-3 mb-4">
        <span class="text-white">Email wysłano! Sprawdź skrzynkę</span>
      </div>
    }

    @if (onSendVerificationEmail.error()) {
      <div class="bg-danger text-center rounded-4 p-3 mb-4">
        <span class="text-white">Wystąpił błąd przy wysyłce maila, spróbuj ponownie za kilka minut</span>
      </div>
    }

    <div class="d-flex flex-column gap-2 align-items-center">
      <h4 class="text-shadow"><u>Twój adres email nie jest zweryfikowany</u></h4>
      <h5>Nie dotarł? Ponów maila weryfikacyjnego</h5>
      <button class="btn btn-lg btn-outline-info rounded-4"
              (click)="sendEmailSig.set(authService.firebaseUser()!)"
              [disabled]="onSendVerificationEmail.status() === 'resolved'"
              type="button">
        Wyślij ponownie&nbsp;📩
      </button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendVerificationEmailComponent {
  public authService = inject(AuthService);
  user = signal<User | null>(null);

  sendEmailSig = signal<User | undefined>(undefined);
  onSendVerificationEmail = resource({
    params: this.sendEmailSig,
    loader: async (user) => {
      await this.authService.initiateEmail(user.params)
    }
  });

  constructor() {
    effect(() => console.log(this.user()))
  }
}

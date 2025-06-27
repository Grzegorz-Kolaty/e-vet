import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {AuthService} from "../shared/data-access/auth.service";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {User} from "firebase/auth";
import {LoaderComponent} from "../shared/ui/loader/loader.component";


@Component({
  selector: 'app-dashboard',
  imports: [
    LoaderComponent
  ],
  template: `
    <div class="container justify-content-center">
      <div class="my-5 text-center">
        <div class="m-5">
          <h1 class="mb-3 fw-bolder"><b>Witaj w PetCare</b></h1>
          <h3>Twoja prosta platforma do zarządzania wizytami</h3>
        </div>


        @if (!authService.firebaseUser()?.emailVerified) {
          @if (onSendVerificationEmail.status() === 2) {
            <app-loader/>
          }

          @if (onSendVerificationEmail.status() === 4) {
            <div class="bg-success text-center rounded-4 p-3 mb-4">
              <span class="text-white">Email wysłano! Sprawdź skrzynkę</span>
            </div>
          }

          @if (onSendVerificationEmail.status() === 1) {
            <div class="bg-danger text-center rounded-4 p-3 mb-4">
              <span class="text-white">Wystąpił błąd przy wysyłce maila, spróbuj ponownie za kilka minut</span>
            </div>
          }

          <div class="d-flex flex-column gap-2 align-items-center">
            <h4 class="text-shadow"><u>Twój adres email nie jest zweryfikowany</u></h4>
            <h5>Nie dotarł? Ponów maila weryfikacyjnego</h5>
            <button class="btn btn-lg btn-outline-info rounded-4"
                    (click)="sendEmailSig.set(user()!)" type="button">
              Wyślij ponownie&nbsp;📩
            </button>
          </div>
        } @else {
          <button class="btn btn-lg btn-dark px-5 rounded-4 shadow-lg fw-semibold" type="button">
            Twoja klinika
          </button>

          <button class="btn btn-lg btn-outline-light px-4 rounded-4 shadow-lg fw-semibold" type="button">
            Nadchodzące wizyty
          </button>
        }


      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-4">
          <div class="p-4 bg-light-subtle rounded-4 shadow-lg h-100">
            <img class="img mb-3 shadow-lg"
                 alt="book_visits"
                 src="../../../assets/manage_appointments.png"
                 width="200"
                 height="150"/>
            <h4>Zarządzaj rezerwacjami</h4>
            <span>Prosto i szybko zarządzaj swoimi rezerwacjami</span>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="p-4 bg-light-subtle rounded-4 shadow-lg h-100">
            <img class="img mb-3 shadow-lg"
                 alt="book_visits"
                 src="../../../assets/browse_clinics.png"
                 width="200"
                 height="150"/>
            <h4>Przeglądaj kliniki</h4>
            <span>Znajdź klinikę spełniającą potrzeby Twojego zwierzaka</span>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="p-4 bg-light-subtle rounded-4 shadow-lg h-100">
            <img class="img mb-3 shadow-lg"
                 alt="book_visits"
                 src="../../../assets/book_visits.png"
                 width="200"
                 height="150"/>
            <h4>Rezerwuj wizyty</h4>
            <span>Szybko i sprawnie rezerwuj wizyty w klinikach</span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DashboardComponent {
  authService = inject(AuthService)
  router = inject(Router)

  user = this.authService.firebaseUser

  sendEmailSig = signal<User | undefined>(undefined);
  onSendVerificationEmail = resource({
    request: () => this.sendEmailSig(),
    loader: ({request}) => this.authService.initiateEmail(request!)
  });

  constructor() {
    effect(() => {
      if (!this.authService.firebaseUser()) {
        this.router.navigate(['auth'])
      }
    })

    effect(() => {
      console.log(this.authService.firebaseUser())
    });

    effect(() => {
      console.log(this.authService.user())
    });
  }



}

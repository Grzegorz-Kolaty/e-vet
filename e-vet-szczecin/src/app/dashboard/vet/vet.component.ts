import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {AuthService} from "../../shared/data-access/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-vet',
  imports: [],
  template: `
    <div class="container justify-content-center">
      <div class="text-center my-5">
        <div class="m-5">
          <h1 class="mb-3 fw-bolder"><b>Witaj w PetCare</b></h1>
          <h3>Twoja prosta platforma do zarządzania wizytami</h3>
        </div>

        <div class="d-inline-flex gap-5 mb-5">
          <button class="btn btn-lg btn-dark px-5 rounded-4 shadow-lg fw-semibold" type="button">
            Twoja klinika
          </button>

          <button class="btn btn-lg btn-outline-light px-4 rounded-4 shadow-lg fw-semibold" type="button">
            Nadchodzące wizyty
          </button>
        </div>
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
  styleUrl: './vet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class VetComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router)

  constructor() {
    effect(() => {
      if (!this.authService.firebaseUser()) {
        this.router.navigate(['auth'])
      }
    });
  }

}

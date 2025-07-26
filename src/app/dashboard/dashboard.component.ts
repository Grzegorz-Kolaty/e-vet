import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {AuthService} from "../shared/data-access/auth.service";
import {Router} from "@angular/router";
import {User} from "firebase/auth";
import {LoaderComponent} from "../shared/ui/loader/loader.component"


@Component({
  selector: 'app-dashboard',
  imports: [LoaderComponent],
  template: `
    <section class="container-fluid h-100 p-5">
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

        <div class="row row-cols-1 row-cols-lg-3 g-4 h-100">
          <div class="col">
            <div class="d-flex flex-column flex-nowrap p-4 bg-dark-subtle rounded-4 gap-4 h-100">
              <h3>Nachodzące wizyty</h3>

              <div class="card rounded-4">
                <div class="card-body">
                  <h5 class="card-title">Special title treatment</h5>
                  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
              </div>

              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Special title treatment</h5>
                  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
              </div>
            </div>
          </div>


          <div class="col">
            <div class="d-flex flex-column flex-nowrap p-4 bg-dark-subtle rounded-4 gap-4 h-100">
              <h3>Twoje zwierzaki</h3>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Special title treatment</h5>
                  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
              </div>
            </div>
          </div>


          <div class="col">
            <div class="d-flex flex-column flex-nowrap p-4 bg-dark-subtle rounded-4 gap-4 h-100">
              <h3>Wiadomości z klinik</h3>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Special title treatment</h5>
                  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
              </div>
            </div>
          </div>

        </div>

      }

    </section>
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
  }


}

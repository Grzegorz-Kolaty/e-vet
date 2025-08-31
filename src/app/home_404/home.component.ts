import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section class="d-flex flex-column flex-nowrap h-100">

      <div class="flex-fill d-flex flex-column flex-nowrap justify-content-center dog__background">

        <div class="d-inline-flex flex-nowrap justify-content-between glass text-black shadow-lg p-4">

          <div class="text-start">
            <h5>Dla właścicieli zwierząt</h5>
            <h6 class="fw-light">Śledź historię leczenia, zalecenia i wizyty swoich pupili</h6>
          </div>

          <div class="text-end">
            <h5>Dla weterynarzy</h5>
            <h6 class="fw-light">Udostępniaj sloty godzinowe swojej klinmiki</h6>
          </div>

        </div>


      </div>

      <!-- Footer -->
      <footer class="row row-cols-1 row-cols-md-3 align-items-start text-white bg-dark p-3 m-0">

        <div class="col">
          <h5>O nas</h5>
          <h6 class="fw-light">
            Nasza platforma łączy właścicieli zwierząt z profesjonalnymi klinikami weterynaryjnymi,
            ułatwiając rezerwację wizyt i zarządzanie dokumentacją medyczną.
          </h6>
        </div>

        <div class="col">
          <h5>Regulamin</h5>
          <h6 class="fw-light">
            Sprawdź regulamin oraz politykę prywatności, aby bezpiecznie korzystać z naszej
            platformy.
          </h6>
        </div>

        <div class="col">
          <h5>Kontakt i pomoc</h5>
          <h6 class="fw-light">
            Masz pytania? Skontaktuj się z nami lub odwiedź sekcję FAQ
          </h6>
        </div>
      </footer>

    </section>
  `,
  styles: `
    .dog__background {
      background-repeat: no-repeat;
      background-size: cover;
      background-position-y: 40%;
      background-image: url('/assets/doge.jpg');
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}

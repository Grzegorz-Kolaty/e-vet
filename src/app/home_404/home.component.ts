import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <!--above this is header-->
    <section class="d-flex flex-column h-100">

      <!-- Hero Section -->
      <div class="dog__background row justify-content-end flex-grow-1 p-0 m-0">
        <div class="col-12 col-lg-4 d-flex flex-column justify-content-around glass text-black shadow-lg p-5">
          <!-- Title -->
          <div class="text-center">
            <h3 class="fw-semibold">Wizyty weterynaryjne najbliżej Ciebie</h3>
            <p class="lead">Rezerwuj wizyty z łatwością i sprawdzaj wszystkie informacje w jednym miejscu</p>
          </div>

          <div class="mb-5">
            <!-- Offer for clients -->
            <div>
              <h4>Dla właścicieli zwierząt:</h4>
              <p class="lead">Śledź historię leczenia, zalecenia, wizyty i szczepienia swoich pupili</p>
            </div>

            <hr/>

            <!-- Offer for veterinarians -->
            <div>
              <h4>Dla weterynarzy:</h4>
              <p class="lead">Dodaj swoją klinikę i kontroluj dostępne sloty wizyt oraz wpisy do dokumentacji medycznej
                pacjentów
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <footer class="row row-cols-1 row-cols-md-3 text-white bg-dark p-4 m-0">
        <div class="col">
          <h5>O nas</h5>
          <p class="small mb-0">Nasza platforma łączy właścicieli zwierząt z profesjonalnymi klinikami weterynaryjnymi,
            ułatwiając rezerwację wizyt i zarządzanie dokumentacją medyczną.</p>
        </div>

        <div class="col">
          <h5>Regulamin</h5>
          <p class="small">Sprawdź regulamin oraz politykę prywatności, aby bezpiecznie korzystać z naszej
            platformy.</p>
        </div>

        <div class="col">
          <h4>Kontakt i pomoc</h4>
          <p class="fw-light"><small>Masz pytania? Skontaktuj się z nami lub odwiedź sekcję FAQ</small></p>
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

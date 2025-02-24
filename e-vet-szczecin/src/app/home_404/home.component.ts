import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section class="dog__background h-75">
      <div class="w-50 h-100 align-content-center glass p-5">
        <h2 class="fw-bold">Znajdź wizyty najbliżej Ciebie</h2>
        <h3>Rezerwuj z łatwością</h3>
        <button class="btn btn-dark px-4 my-2" type="button">Wyszukaj</button>
      </div>
    </section>`,
  styles: '',

})
export class HomeComponent {
}

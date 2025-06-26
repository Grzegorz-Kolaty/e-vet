import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <section class="container-fluid g-0 dog__background h-100">
      <div class="p-5 glass">
        <h2 class="fw-bold">Znajdź wizyty najbliżej Ciebie</h2>
        <h3>Rezerwuj z łatwością</h3>
        <button class="btn btn-dark px-4 my-2" type="button">Wyszukaj</button>
      </div>
    </section>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
}

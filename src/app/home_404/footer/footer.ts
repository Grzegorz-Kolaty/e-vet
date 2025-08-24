import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <section class="row row-cols-3 flex-wrap bg-dark text-white p-4">
      <div class="col">
        <h5>O nas</h5>
      </div>

      <div class="col">
        <h5>Regulamin</h5>
      </div>

      <div class="col">
        <h5>Informacje dodatkowe</h5>
      </div>
    </section>
  `,
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {

}

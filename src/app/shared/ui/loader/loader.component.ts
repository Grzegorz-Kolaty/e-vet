import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  template: `
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,

  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {

}

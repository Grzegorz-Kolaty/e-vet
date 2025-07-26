import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pets',
  imports: [],
  template: `
  <p>app-pets</p>`,
  styleUrl: './pets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PetsComponent {

  constructor() {
    console.log('pets proc')
  }

}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pet-details',
  imports: [],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PetDetailsComponent {

}

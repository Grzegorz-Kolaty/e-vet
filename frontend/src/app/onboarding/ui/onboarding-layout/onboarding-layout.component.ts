import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faCircleCheck, faPaw} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../../shared/data-access/auth.service';

@Component({
  selector: 'app-onboarding-layout',
  imports: [RouterLink, RouterOutlet, FontAwesomeModule],
  templateUrl: './onboarding-layout.html',
  styleUrl: './onboarding-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingLayout {
  protected readonly authService = inject(AuthService);

  protected readonly faPaw = faPaw;
  protected readonly faCircleCheck = faCircleCheck;
}

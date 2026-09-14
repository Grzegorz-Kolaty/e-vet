import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-onboarding-step-header',
  template: `
    <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
      <div>
        @if (eyebrow()) {
          <span class="badge rounded-pill bg-primary-subtle text-primary-emphasis mb-3">
            {{ eyebrow() }}
          </span>
        }

        <h1 class="display-6 fw-bold mb-2">{{ title() }}</h1>

        @if (description()) {
          <p class="lead text-body-secondary mb-0">
            {{ description() }}
          </p>
        }
      </div>

      @if (step() && steps()) {
        <div class="align-self-lg-start text-lg-end">
          <div class="small text-body-secondary mb-2">
            {{ processLabel() }} · krok {{ step() }} z {{ steps() }}
          </div>

          <div
            class="progress"
            style="width: 190px; height: 7px"
            role="progressbar"
            aria-label="Postęp onboardingu"
            [attr.aria-valuenow]="progress()"
            aria-valuemin="0"
            aria-valuemax="100">
            <div class="progress-bar" [style.width.%]="progress()"></div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingStepHeaderComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
  readonly processLabel = input('Miejsce pracy');
  readonly step = input<number | null>(null);
  readonly steps = input<number | null>(null);

  protected readonly progress = computed(() => {
    const step = this.step();
    const steps = this.steps();

    if (!step || !steps) return 0;
    return Math.min(100, Math.round((step / steps) * 100));
  });
}

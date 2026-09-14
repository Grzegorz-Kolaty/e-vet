import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {Router} from '@angular/router';

@Component({
  selector: 'app-verify-pwz',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="mx-auto" style="max-width: 720px">

      <div class="mb-4">
        <span
          class="badge rounded-pill
                 bg-primary-subtle
                 text-primary-emphasis
                 px-3 py-2 mb-3">

          Weryfikacja lekarza

        </span>

        <h1 class="fw-bold mb-2">
          Potwierdź swoje uprawnienia zawodowe
        </h1>

        <p class="text-body-secondary mb-0">
          Podaj numer prawa wykonywania zawodu lekarza
          weterynarii.
        </p>
      </div>

      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4 p-lg-5">

          <form
            [formGroup]="form"
            (ngSubmit)="submit()">

            <div class="mb-4">

              <label
                for="pwz"
                class="form-label fw-semibold">

                Numer PWZ

              </label>

              <input
                id="pwz"
                type="text"
                class="form-control form-control-lg"
                formControlName="pwz"
                placeholder="Wpisz numer PWZ"
                autocomplete="off">

              @if (
                form.controls.pwz.touched &&
                form.controls.pwz.invalid
              ) {
                <div class="text-danger small mt-2">
                  Podaj prawidłowy numer PWZ.
                </div>
              }

            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg w-100"
              [disabled]="form.invalid">

              Zweryfikuj numer PWZ

            </button>

          </form>

        </div>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyPwzComponent {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    pwz: [
      '',
      [
        Validators.required,
        Validators.minLength(4)
      ]
    ]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const pwz = this.form.controls.pwz.value;

    console.log('PWZ:', pwz);

    /*
     * TODO:
     * tutaj później wywołamy backend,
     * np.:
     *
     * await this.vetVerificationService.verifyPwz(pwz)
     */

    void this.router.navigate([
      '/onboarding/vet/workplace'
    ]);
  }
}

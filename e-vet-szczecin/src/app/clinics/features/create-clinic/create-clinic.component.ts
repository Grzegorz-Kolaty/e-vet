import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "../../../shared/data-access/auth.service";
import {NgxMaskDirective} from "ngx-mask";
import {NgClass} from "@angular/common";
import {GeoPoint} from "firebase/firestore";
import {LocationResult} from "../map/map.component";
import {ClinicService} from "../../../shared/data-access/clinic.service";
import {CreateClinic} from "../../../shared/interfaces/clinics.interface";


@Component({
  selector: 'app-create-clinic',
  imports: [ReactiveFormsModule, NgxMaskDirective, NgClass],
  template: `
    <div class="row">
      <form class="col-8 p-4" [formGroup]="clinicForm">

        <h5 class="mb-3">🏥 Twoja klinika</h5>

        <div class="mb-3">
          <label for="clinicNameInput"
                 class="form-label">
            Nazwa kliniki
          </label>
          <input class="form-control"
                 [ngClass]="{'is-valid': clinicForm.get('name')?.valid}"
                 formControlName="name"
                 placeholder="np. Nazwa firmy" type="text"
                 id="clinicNameInput" required/>
          <span class="invalid-feedback"
                [ngClass]="{
                'd-block': clinicForm.get('name')?.invalid
                && clinicForm.get('name')?.touched
                }">
          Nazwa kliniki musi mieć co najmniej 6 znaków.
        </span>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Opis kliniki</label>
          <textarea formControlName="description"
                    placeholder="Krótki opis kliniki. Warto tu wspomnieć o rodzaju zwierzątek i zakresie usług"
                    rows="2" type="text"
                    class="form-control"
                    id="description" required>
        </textarea>
          <div class="invalid-feedback"
               [ngClass]="{'d-block': clinicForm.get('description')?.invalid && clinicForm.get('description')?.touched}">
            Opis kliniki musi mieć co najmniej 6 znaków.
          </div>
        </div>


        <div class="row" formGroupName="address">
          <div class="col-lg-7 mb-3">
            <label for="street" class="form-label">Ulica</label>
            <input formControlName="street" type="text"
                   placeholder="np. Konstantego Maciejewicza"
                   class="form-control" id="street" required/>
            <div class="invalid-feedback"
                 [ngClass]="{'d-block': clinicForm.get('address.street')?.invalid && clinicForm.get('address.street')?.touched}">
              Ulica jest wymagana.
            </div>
          </div>

          <div class="col-lg-5 mb-3">
            <label for="city" class="form-label">Miasto</label>
            <input formControlName="city"
                   type="text"
                   class="form-control"
                   id="city" required/>
          </div>

          <div class="col-lg-7 mb-3">
            <label for="houseNumber"
                   class="form-label">
              Numer domu
            </label>
            <input formControlName="houseNumber" type="text"
                   placeholder="np. 23/1 lub 23/2 klatka 'B'"
                   class="form-control"
                   id="houseNumber" required/>
            <div class="invalid-feedback"
                 [ngClass]="{
                 'd-block': clinicForm.get('address.houseNumber')?.invalid
                 && clinicForm.get('address.houseNumber')?.touched}">
              Numer domu jest wymagany.
            </div>
          </div>

          <div class="col-lg-5 mb-3">
            <label for="zipCode"
                   class="form-label">
              Kod pocztowy
            </label>
            <input mask="00-000"
                   formControlName="zipCode"
                   type="text"
                   class="form-control"
                   placeholder="np. 71-757" id="zipCode" required/>
            <div class="invalid-feedback"
                 [ngClass]="{'d-block': clinicForm.get('address.zipCode')?.invalid && clinicForm.get('address.zipCode')?.touched}">
              Kod pocztowy jest wymagany.
            </div>
          </div>
        </div>

        @if (onCreateClinic.error()) {
          <span class="text-danger mt-3">
        {{ onCreateClinic.error() }}
      </span>
        }

        @if (onCreateClinic.status() === 4) {
          <span class="text-success mt-3">
            Klinika utworzona!
          </span>
        }

      </form>

      <!-- Podgląd użytkownika -->

      <form class="col bg-dark-subtle rounded-4 p-4"
            [formGroup]="clinicMemberForm">
        <h5 class="mb-3">👤 Profil weterynarza</h5>

        <div class="mb-3">
          <label for="vetName" class="form-label">
            Imię i nazwisko
          </label>
          <input formControlName="name"
                 type="text"
                 [value]="authService.firebaseUser()?.displayName"
                 class="form-control form-control"
                 id="vetName"
                 required/>
          <label class="form-label mt-2 ">Będziesz administratorem tej kliniki.</label>
        </div>

        <button type="button"
                class="btn btn-dark p-2 w-100 rounded-4 shadow-lg"
                (click)="onSubmit()"
                [disabled]="onCreateClinic.isLoading()">
          Zarejestruj klinikę
        </button>

      </form>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateClinicComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clinicService = inject(ClinicService);
  public readonly authService = inject(AuthService);
  private readonly _location = signal<LocationResult | null>(null);
  readonly location = this._location.asReadonly();

  public setLocation(loc: LocationResult): void {
    this._location.set(loc);
  }

  // location = this._location.asReadonly();
  createClinic = signal<CreateClinic | undefined>(undefined);
  // onSuccessfulCreateClinic = computed(() => this.onCreateClinic.status() === 4)
  // onSuccessfulCreateClinic = output()

  onCreateClinic = resource({
    request: () => this.createClinic(),
    loader: async ({request}) => {
      // await this.auth.refreshToken(); // aktualizuj custom claims
      // this.clinicCreated.emit(result.clinicId); // emit do rodzica
      await this.clinicService.createNewClinic(request!);
      await this.authService.reloadUser()
    }
  });

  clinicForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(6)]],

    address: this.fb.nonNullable.group({
      city: [{value: 'Szczecin', disabled: true}, Validators.required],
      street: ['', [Validators.required, Validators.minLength(4)]],
      houseNumber: ['', [Validators.required, Validators.minLength(1)]],
      zipCode: ['', Validators.required]
    })
  });

  clinicMemberForm = this.fb.nonNullable.group({
    vetId: [this.authService.firebaseUser()?.uid, Validators.required],
    name: ['', [Validators.required, Validators.minLength(6)]],
    email: [this.authService.firebaseUser()?.email, Validators.required]
  })

  // constructor() {
  //   effect(() => {
  //     // if (this.onCreateClinic.status() === 4) {
  //     console.log(this.onCreateClinic.status())
  //     // this.onSuccessfulCreateClinic.emit()
  //   })
  //
  //   // effect(() => {
  //   //   if (this.onCreateClinic.status() === 4) {
  //   //     console.log('onCreateClinic succed')
  //   //     this.onSuccessfulCreateClinic.emit()
  //   //   }
  //   // })
  // }

  onSubmit() {
    if (this.clinicForm.valid && this.clinicMemberForm.valid) {
      const user = this.authService.firebaseUser();
      if (!user?.uid || !user.email) {
        throw new Error('Brak danych użytkownika. Upewnij się, że jesteś zalogowany.');
      }

      const clinicData = this.clinicForm.getRawValue();
      const memberData = this.clinicMemberForm.getRawValue();

      const payload: CreateClinic = {
        ...clinicData,
        member: {
          vetId: user.uid,
          name: memberData.name,
          email: user.email
        },
        geo: {
          latitude: 53.4285,
          longitude: 14.5528 // np. dla Szczecina
        }
      }

        this.createClinic.set(payload);
      }
    }
  }

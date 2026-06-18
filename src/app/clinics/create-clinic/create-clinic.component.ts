import {ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal} from '@angular/core';
import {Router} from "@angular/router";
import {LocationResult, Voivodeship} from "../../shared/data-access/geo.service";
import {Clinic, ClinicLocation} from "../../shared/interfaces/clinics.interface";
import {MapComponent} from "../features/map/map.component";
import {SelectVoivodeship} from "../features/select-voivodenship/select-voivodeship.component";
import {SelectLocation} from "../features/select-location/select-location";
import {CreateClinicForm} from "../features/create-clinic-form/create-clinic-form";
import ClinicService from "../../shared/data-access/clinic.service";
import {AuthService} from "../../shared/data-access/auth.service";
import {LoaderComponent} from "../../shared/ui/loader/loader.component";


@Component({
  selector: 'app-create-clinic',
  imports: [
    MapComponent,
    SelectVoivodeship,
    SelectLocation,
    CreateClinicForm,
    LoaderComponent,
  ],
  template: `
    @let user = this.user();

    @if (!user) {
      <app-loader/>
    } @else {
      <section class="container-fluid g-0 h-100">
        <div class="row g-0 h-100">

          <div class="col-4 p-4 bg-light-subtle">
            <app-select-voivodeship
              (voivodeshipLocationChange)="setVoivodeship($event)"
              (voivodeship)="setVoivodeshipName($event)"
            />

            <app-select-location
              [voivodeshipLocation]="selection().voivodeshipLocation"
              [voivodeship]="selection().voivodeship"
              (clinicLocationSelection)="setClinicLocation($event)"/>

            <app-create-clinic-form
              [createClinicStatus]="onCreateClinicResource.status()"
              [vetId]="user.id"
              [clinicAddress]="selection().clinic"
              (createClinic)="onCreateClinicSubmit.set($event)"/>
          </div>

          <div class="col">
            <app-map
              [clinicLocation]="selection().clinic"
              [voivodeshipLocation]="selection().voivodeshipLocation"
            />
          </div>

        </div>
      </section>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CreateClinicComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly clinicService = inject(ClinicService);

  user = computed(() => this.authService.user());

  onCreateClinicSubmit = signal<Clinic | null>(null);

  selection = signal<{ voivodeshipLocation: LocationResult | null; voivodeship: Voivodeship | null; clinic: ClinicLocation | null; }>({
    voivodeshipLocation: null,
    voivodeship: null,
    clinic: null
  });

  constructor() {
    effect(() => {
      if (!this.authService.initialized()) {
        return;
      }

      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });

    effect(() => {
      if (!this.onCreateClinicSubmit()) return
      const clinicId = this.onCreateClinicResource.value();
      this.authService.init()
      if (clinicId) {
        this.router.navigate([
          'clinics',
          'vet-clinic',
          clinicId
        ]);
      }
    });
  }

  onCreateClinicResource = resource({
    params: this.onCreateClinicSubmit,
    loader: async ({params}) => {
      if (!params) {
        throw Error('no clinic creation submitted')
      }
      return this.clinicService.createClinic(params)
    }
  })

  setVoivodeship(v: LocationResult | null) {
    this.selection.update(state => ({
      ...state, // Dodajemy spread, aby nie zgubić voivodeship, jeśli już tam jest
      voivodeshipLocation: v,
      clinic: null
    }));
  }

  setVoivodeshipName(vName: Voivodeship | null) {
    this.selection.update(state => ({
      ...state,
      voivodeship: vName
    }));
  }
  setClinicLocation(loc: ClinicLocation | null) {
    this.selection.update(state => ({
      ...state,
      clinic: loc
    }));
  }
}

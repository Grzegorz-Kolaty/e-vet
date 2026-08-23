import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  ResourceStatus
} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserInterface} from '../../../shared/interfaces/user.interface';
import {NgClass} from "@angular/common";
import {UploadableImagesComponent} from "../../../shared/ui/uploadable-images/uploadable-images.component";
import {environment} from "../../../../environments/environment";


@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule, FormsModule, NgClass, UploadableImagesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row justify-content-center p-5">
      <!-- Main Content -->
      <div class="col-12">
        <div class="card border-0 rounded-3">
          <div class="card-body p-0">
            <div class="row g-0">
              <!-- Sidebar -->
              <div class="col-lg-3">
                <div class="p-5">
                  <div class="nav flex-column nav-pills">
                    <a class="nav-link active"><i class="fas fa-user me-2"></i>Twoje dane</a>
                    <a class="nav-link" disabled=""><i class="fas fa-lock me-2"></i>Zabezpieczenia</a>
                    <a class="nav-link" disabled><i class="fas fa-bell me-2"></i>Notyfikacje</a>
                    <a class="nav-link" disabled><i class="fas fa-credit-card me-2"></i>Billing</a>
                    <a class="nav-link" disabled><i class="fas fa-chart-line me-2"></i>Aktywność</a>
                  </div>
                </div>
              </div>
              <!-- Content Area -->
              <div class="col-lg-9 p-5">
                <!-- Personal Information -->
                <div class="row g-3">
                  <div class="col-6">

                    <h5>Twoje dane</h5>

                    <form class="col-12 py-3" #ngForm (ngSubmit)="onConfirmNewName()">
                      <label class="form-label">Nazwa użytkownika</label>
                      <div class="input-group">
                        <input
                          #nameInput="ngModel"
                          [(ngModel)]="displayName"
                          name="first"
                          class="form-control"
                          [ngClass]="{
                          'is-valid': ngForm['submitted'] && uploadNewProfileResource() === 'resolved',
                          'is-invalid': nameInput.dirty && uploadNewProfileResource() === 'error'
                          }"
                        />

                        <button type="submit" class="btn btn-outline-dark"
                                [disabled]="uploadNewProfileResource() === 'loading'">
                          @if (uploadNewProfileResource() === 'loading') {
                            <span class="spinner-border spinner-border-sm"></span>
                          } @else {
                            💾
                          }
                        </button>
                      </div>
                    </form>
                  </div>

                  <div class="col-6 text-center">
                    <label class="form-label">
                      Zdjęcie profilowe
                    </label>
                    <app-uploadable-images
                      [photoUrl]="photoUrl()"
                      (photoFile)="userPhotoFile.emit($event)"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Aktualny email</label>
                    <input
                      type="email"
                      class="form-control"
                      disabled
                      [value]="user()?.email"
                    >
                  </div>

                  <div class="col-12">
                    <form
                      class="py-3"
                      #emailForm="ngForm"
                      (ngSubmit)="onEmailChange()"
                    >
                      <h6>Zmień adres email</h6>

                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">
                            Nowy email
                          </label>

                          <input
                            type="email"
                            class="form-control"
                            name="newEmail"
                            [(ngModel)]="newEmail"
                            required
                            email
                          >
                        </div>

                        <div class="col-md-6">
                          <label class="form-label">
                            Obecne hasło
                          </label>

                          <input
                            type="password"
                            class="form-control"
                            name="currentPassword"
                            [(ngModel)]="currentPassword"
                            required
                          >
                        </div>

                        <div class="col-12">
                          <button
                            type="submit"
                            class="btn btn-outline-dark"
                            [disabled]="
            emailForm.invalid ||
            emailChangeStatus() === 'loading'
          "
                          >
                            @if (emailChangeStatus() === 'loading') {
                              <span class="spinner-border spinner-border-sm me-2"></span>
                              Wysyłanie...
                            } @else {
                              Zmień email
                            }
                          </button>
                        </div>

                        @if (emailChangeStatus() === 'resolved') {
                          <div class="col-12">
                            <div class="alert alert-success mb-0">
                              Wysłaliśmy wiadomość na nowy adres email.
                              Kliknij link w wiadomości, aby zatwierdzić zmianę.
                            </div>
                          </div>
                        }

                        @if (emailChangeStatus() === 'error') {
                          <div class="col-12">
                            <div class="alert alert-danger mb-0">
                              Nie udało się rozpocząć zmiany adresu email.
                            </div>
                          </div>
                        }
                      </div>
                    </form>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Telefon</label>
                    <input type="tel" class="form-control" value="+48 500 600 700" disabled>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Bio</label>
                    <textarea class="form-control" disabled rows="4">Jeszcze niedostępne</textarea>
                  </div>
                </div>

                <!-- Settings Cards -->
                <div class="row g-4 mb-4">
                  <div class="col-md-6">
                    <div class="settings-card card">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 class="mb-1">Two-Factor Authentication</h6>
                            <p class="text-muted mb-0 small">Add an extra layer of
                              security</p>
                          </div>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" checked>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="settings-card card">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 class="mb-1">Email Notifications</h6>
                            <p class="text-muted mb-0 small">Receive activity updates
                            </p>
                          </div>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" checked>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Recent Activity -->
                <div>
                  <h5 class="mb-4">Recent Activity</h5>
                  <div class="activity-item mb-3">
                    <h6 class="mb-1">Updated profile picture</h6>
                    <p class="text-muted small mb-0">2 hours ago</p>
                  </div>
                  <div class="activity-item mb-3">
                    <h6 class="mb-1">Changed password</h6>
                    <p class="text-muted small mb-0">Yesterday</p>
                  </div>
                  <div class="activity-item">
                    <h6 class="mb-1">Updated billing information</h6>
                    <p class="text-muted small mb-0">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export default class ProfileFormComponent {
  user = input<UserInterface | null>();

  uploadPhotoResourceStatus = input<ResourceStatus | undefined>();

  uploadNewProfileResource = input<ResourceStatus | undefined>();

  emailChangeStatus = input<ResourceStatus | undefined>();

  userEmailChange = output<{
    email: string;
    password: string;
  }>();

  newEmail = '';
  currentPassword = '';

  userPhotoFile = output<File>();
  userName = output<string>();
  displayName = '';

  protected readonly photoUrl = computed(() => {
    const photoUrl = this.user()?.photo_url;
    if (!photoUrl) {
      return '/assets/img/placeholder.svg';
    }

    return `${environment.apiUrl}${photoUrl}`;
  });

  constructor() {
    effect(() => {
      const user = this.user();

      if (user) {
        this.displayName = user.name;
      }
    });
  }

  onConfirmNewName() {
    const trimmed = this.displayName.trim();
    if (!trimmed) return;

    this.userName.emit(trimmed);
  }

  onEmailChange() {
    const email = this.newEmail.trim();
    const password = this.currentPassword;

    if (!email || !password) {
      return;
    }

    this.userEmailChange.emit({
      email,
      password,
    });
  }
}

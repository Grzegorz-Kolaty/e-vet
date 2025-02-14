import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

import {AuthService} from '../../shared/data-access/auth.service';
import {
  StorageService,
  UploadFile,
} from '../../shared/data-access/storage.service';
import {FunctionsService} from '../../shared/data-access/functions.service';
import {User} from 'firebase/auth';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faCameraRetro,
  faCheck,
  faEnvelope,
  faShieldCat,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {Role} from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FontAwesomeModule, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let firebaseUser = user();
    @let firebaseToken = userToken();
    @let step = currentStep();


    @if (step && firebaseUser && currentStep() !== 5) {
      <section class="container">

        <div class="grid-steps m-5 text-center">
          @for (stepNumber of [1, 2, 3, 4]; track stepNumber) {
            <div
              class="step-bar"
              [ngClass]="{
                finished: stepNumber < step,
                active: stepNumber === step,
              }">
              <fa-icon class="step-icon" [icon]="stepIcons[stepNumber - 1]"></fa-icon>
            </div>
          }

          <button
            type="button"
            class="btn btn-link p-0 text-decoration-none"
            (click)="currentStep.set(1)"
            disabled>
            Krok 1
          </button>
          <button
            type="button"
            class="btn btn-link p-0 text-decoration-none"
            (click)="currentStep.set(2)"
            disabled>
            Krok 2
          </button>
          <button
            type="button"
            class="btn btn-link p-0 text-decoration-none"
            (click)="currentStep.set(3)"
            disabled>
            Krok 3
          </button>
          <button
            type="button"
            class="btn btn-link p-0 text-decoration-none"
            (click)="currentStep.set(4)"
            disabled>
            Krok 4
          </button>

          <h6>Rejestracja konta</h6>
          <h6>Weryfikacja e-mail</h6>
          <h6>Rola</h6>
          <h6>Profil</h6>
        </div>

        <div class="bg-white shadow rounded-3 p-5 w-50 mx-auto">
          @if (currentStep() === 2) {
            <h4 class="mb-3">Wprowadź kod weryfikacyjny</h4>

            <h5 class="mb-4">Na adres mailowy {{ firebaseUser.email }} został wysłany mail z kodem
              autoryzującym.
            </h5>

            <input type="text" placeholder="Kod weryfikacyjny" #codeInput class="form-control mb-3"/>
            <button
              (click)="verifyEmailCode(codeInput.value)"
              [disabled]="userEmailVerified() || isLoading()"
              type="button"
              class="btn btn-primary w-100 mb-3">
              Zweryfikuj kod
            </button>

            <button
              (click)="sendEmailVerification(firebaseUser)"
              [disabled]="userEmailVerified() || isLoading()"
              type="button"
              class="text-primary bg-transparent border-0">
              Wyślij ponownie
            </button>
          }

          <!-- Stage #3: Role -->
          @if (currentStep() === 3 && firebaseToken) {
            <h4 class="text-center px-2">Wybierz rolę</h4>
            <button
              type="button"
              class="btn btn-outline-secondary"
              (click)="updateUserRole(Role.User, firebaseToken)"
              [disabled]="!!userRole() || isLoading()">
              Użytkownik
            </button>

            <button
              type="button"
              class="btn btn-outline-secondary"
              (click)="updateUserRole(Role.Vet, firebaseToken)"
              [disabled]="!!userRole() || isLoading()">
              Weterynarz
            </button>
          }


          @if (currentStep() === 4) {
            <div class="mb-3">
              <label for="userPhotoUrlInput" class="form-label">
                Nazwa użytkownika
              </label>
              <div class="input-group">
                <input
                  #userPhotoUrlInput
                  [value]="firebaseUser.displayName"
                  type="text"
                  class="form-control"
                  id="userPhotoUrlInput"
                  placeholder="name"
                  aria-label="username"
                  aria-describedby="userPhotoUrlInput"/>
                <button
                  (click)="
                  updateAuthDisplayName(userPhotoUrlInput.value, firebaseUser)
                "
                  [disabled]="firebaseUser.displayName || isLoading()"
                  class="btn btn-outline-secondary"
                  type="button"
                  id="userPhotoUrlInput">
                  {{ firebaseUser.displayName ? 'Confirmed' : 'Confirm' }}
                </button>
              </div>
            </div>

            <div class="mb-3">
              <label for="emailInput" class="form-label">Email</label>
              <input
                [value]="firebaseUser.email"
                type="email"
                class="form-control"
                id="emailInput"
                placeholder="email"
                disabled/>
            </div>
          }

        </div>
      </section>


    } @else {



      @if (firebaseUser) {
        <input
          hidden
          #inputField
          type="file"
          id="file"
          accept="image/png, image/jpeg"
          (change)="handleFileSelection($event, firebaseUser)"/>


        <div class="p-5 profile-sidebar position-relative mb-5">
          <div class="position-absolute top-100 start-50 translate-middle">
            <img class="border border-5 border-white rounded-circle img-fluid position-relative" width="126"
                 [src]="firebaseUser.photoURL || 'assets/placeholder.svg'" alt="profile"/>
            <button type="button" (click)="inputField.click()"
                    class="btn btn-sm btn-outline-secondary border-0  position-absolute bottom-0 end-0">
              <fa-icon [icon]="['fas', 'user']"></fa-icon>
            </button>

            <!--          <div class="mb-3 text-center">-->

            <!--            <button-->
            <!--              type="button"-->
            <!--              class="btn p-0 m-0 rounded-3"-->
            <!--              (click)="inputField.click()">-->
            <!--              <img-->
            <!--                height="126"-->
            <!--                width="126"-->
            <!--                class="img-fluid rounded-3 shadow"-->
            <!--                #profilePic-->
            <!--                [src]="userPhoto()"-->
            <!--                (error)="profilePic.src = 'assets/placeholder.svg'"-->
            <!--                alt="profilePic"/>-->
            <!--            </button>-->
            <!--          </div>-->
          </div>
        </div>

        <!--        <div class="mt-5 p-3 text-center">-->
          <!--          <h3>{{ firebaseUser.displayName }}</h3>-->
          <!--          <h5>{{ userRole() }}</h5>-->
          <!--          <div class="d-inline-flex">-->
          <!--            <button class="btn btn-lg btn-outline-primary mx-3" type="submit">Kliniki</button>-->
          <!--            <button class="btn btn-lg btn-primary mx-2" type="submit">Pacjenci</button>-->
          <!--          </div>-->
          <!--        </div>-->

          <!--        <div class="row justify-content-center my-5">-->
          <!--          <div class="col-10">-->
          <!--            &lt;!&ndash; Main Content &ndash;&gt;-->
          <!--            <div class="col-12">-->
          <!--              <div class="card border-0 rounded-3 shadow">-->
          <!--                <div class="card-body p-0">-->
          <!--                  <div class="row g-0">-->
          <!--                    &lt;!&ndash; Sidebar &ndash;&gt;-->
          <!--                    <div class="col-lg-3 border-end">-->
          <!--                      <div class="p-4">-->
          <!--                        <div class="nav flex-column nav-pills">-->
          <!--                          <a class="nav-link active" href="#"><i class="fas fa-user me-2"></i>Personal-->
          <!--                            Info</a>-->
          <!--                          <a class="nav-link" href="#"><i class="fas fa-lock me-2"></i>Security</a>-->
          <!--                          <a class="nav-link" href="#"><i class="fas fa-bell me-2"></i>Notifications</a>-->
          <!--                          <a class="nav-link" href="#"><i class="fas fa-credit-card me-2"></i>Billing</a>-->
          <!--                          <a class="nav-link" href="#"><i class="fas fa-chart-line me-2"></i>Activity</a>-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                    </div>-->

          <!--                    &lt;!&ndash; Content Area &ndash;&gt;-->
          <!--                    <div class="col-lg-9">-->
          <!--                      <div class="p-4">-->
          <!--                        &lt;!&ndash; Personal Information &ndash;&gt;-->
          <!--                        <div class="mb-4">-->
          <!--                          <h5 class="mb-4">Personal Information</h5>-->
          <!--                          <div class="row g-3">-->
          <!--                            <div class="col-md-6">-->
          <!--                              <label class="form-label">First Name</label>-->
          <!--                              <input type="text" class="form-control" value="Alex">-->
          <!--                            </div>-->
          <!--                            <div class="col-md-6">-->
          <!--                              <label class="form-label">Last Name</label>-->
          <!--                              <input type="text" class="form-control" value="Johnson">-->
          <!--                            </div>-->
          <!--                            <div class="col-md-6">-->
          <!--                              <label class="form-label">Email</label>-->
          <!--                              <input type="email" class="form-control" value="alex.johnson@example.com">-->
          <!--                            </div>-->
          <!--                            <div class="col-md-6">-->
          <!--                              <label class="form-label">Phone</label>-->
          <!--                              <input type="tel" class="form-control" value="+1 (555) 123-4567">-->
          <!--                            </div>-->
          <!--                            <div class="col-12">-->
          <!--                              <label class="form-label">Bio</label>-->
          <!--                              <textarea class="form-control" rows="4">Product designer with 5+ years of experience in creating user-centered digital solutions. Passionate about solving complex problems through simple and elegant designs.</textarea>-->
          <!--                            </div>-->
          <!--                          </div>-->
          <!--                        </div>-->

          <!--                        &lt;!&ndash; Settings Cards &ndash;&gt;-->
          <!--                        <div class="row g-4 mb-4">-->
          <!--                          <div class="col-md-6">-->
          <!--                            <div class="settings-card card">-->
          <!--                              <div class="card-body">-->
          <!--                                <div class="d-flex justify-content-between align-items-center">-->
          <!--                                  <div>-->
          <!--                                    <h6 class="mb-1">Two-Factor Authentication</h6>-->
          <!--                                    <p class="text-muted mb-0 small">Add an extra layer of-->
          <!--                                      security</p>-->
          <!--                                  </div>-->
          <!--                                  <div class="form-check form-switch">-->
          <!--                                    <input class="form-check-input" type="checkbox" checked>-->
          <!--                                  </div>-->
          <!--                                </div>-->
          <!--                              </div>-->
          <!--                            </div>-->
          <!--                          </div>-->
          <!--                          <div class="col-md-6">-->
          <!--                            <div class="settings-card card">-->
          <!--                              <div class="card-body">-->
          <!--                                <div class="d-flex justify-content-between align-items-center">-->
          <!--                                  <div>-->
          <!--                                    <h6 class="mb-1">Email Notifications</h6>-->
          <!--                                    <p class="text-muted mb-0 small">Receive activity updates-->
          <!--                                    </p>-->
          <!--                                  </div>-->
          <!--                                  <div class="form-check form-switch">-->
          <!--                                    <input class="form-check-input" type="checkbox" checked>-->
          <!--                                  </div>-->
          <!--                                </div>-->
          <!--                              </div>-->
          <!--                            </div>-->
          <!--                          </div>-->
          <!--                        </div>-->

          <!--                        &lt;!&ndash; Recent Activity &ndash;&gt;-->
          <!--                        <div>-->
          <!--                          <h5 class="mb-4">Recent Activity</h5>-->
          <!--                          <div class="activity-item mb-3">-->
          <!--                            <h6 class="mb-1">Updated profile picture</h6>-->
          <!--                            <p class="text-muted small mb-0">2 hours ago</p>-->
          <!--                          </div>-->
          <!--                          <div class="activity-item mb-3">-->
          <!--                            <h6 class="mb-1">Changed password</h6>-->
          <!--                            <p class="text-muted small mb-0">Yesterday</p>-->
          <!--                          </div>-->
          <!--                          <div class="activity-item">-->
          <!--                            <h6 class="mb-1">Updated billing information</h6>-->
          <!--                            <p class="text-muted small mb-0">3 days ago</p>-->
          <!--                          </div>-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--        </div>-->
      }
    }

    <button type="button" (click)="selectRole()" class="btn btn-outline-secondary">Button do call function</button>


  `,
  styles: `
    .grid-steps {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 3rem;
      align-items: center;
      font-size: 1.5rem;
    }

    .step-bar {
      display: flex;
      justify-content: center;
      position: relative;
      height: 2px;
      background-color: #e9ecef;
      transition: background-color 0.3s ease;
    }

    .step-bar.finished {
      background-color: rgba(46, 204, 113, 0.66);
    }

    .step-bar.active {
      background-color: rgba(67, 97, 238, 0.76);
    }

    .step-bar.active .step-icon {
      background-color: #4361ee;
      box-shadow: 0 0 0 5px rgba(67, 97, 238, 0.2);
    }

    .step-icon {
      position: absolute;
      width: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: bold;

      border-radius: 50%;
      background-color: #e9ecef;
      aspect-ratio: 1 / 1;
      transform: translate(0%, -50%) !important;
    }

    .step-bar.finished .step-icon {
      background-color: #2ecc71;
    }

    .profile-sidebar {
      background: linear-gradient(135deg, #4158D0 0%, #C850C0 100%);
    }

    .img-fluid {
      height: 128px;
    }
  `,
})
export default class ProfileComponent {
  authService = inject(AuthService);
  storageService = inject(StorageService);
  functionsService = inject(FunctionsService);
  stepIcons = [faCheck, faEnvelope, faShieldCat, faUser, faCameraRetro];
  protected readonly Role = Role;

  user = this.authService.user;
  userEmailVerified = this.authService.isEmailVerified;
  userToken = this.authService.userToken;
  userRole = this.authService.userRole;
  userName = this.authService.userDisplayName;
  userPhoto = this.authService.userPhoto;
  userProfileCompleted = this.authService.isProfileCompleted;

  isLoading = linkedSignal(() => false);

  currentStep = linkedSignal(() => {
    const user = this.user();
    const userEmailVerified = this.userEmailVerified();
    const token = this.userToken();
    const userRole = this.userRole();
    const profileCompleted = this.userProfileCompleted();
    const userAndVetName = this.userName();

    if (profileCompleted && !!userAndVetName) {
      return 5;
    }

    if (profileCompleted) {
      return 4;
    }

    if (userEmailVerified && token && !userRole) {
      return 3;
    }

    if (!!user && !userEmailVerified) {
      console.log(user, userEmailVerified);
      return 2;
    }

    if (user) {
      return 1;
    }

    this.authService.logout();
    return;
  });

  handleFileSelection(event: Event, user: User) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;
    if (selectedFiles) {
      const upload = {
        file: selectedFiles[0],
        path: `users/${user.uid}/profilePic.jpg`,
      };
      this.updateStoragePhotoUrl(upload, user);
    }
  }

  updateStoragePhotoUrl(upload: UploadFile, user: User) {
    this.isLoading.set(true);
    this.storageService.uploadFileResult(upload).subscribe({
      next: photoUrl => this.updateAuthPhotoUrl(photoUrl, user),
      error: err => console.error(err),
      complete: () => {
        console.log('storagePhoto updated');
        this.isLoading.set(false);
      },
    });
  }

  updateAuthPhotoUrl(firestorePhotoUrl: string, user: User) {
    this.isLoading.set(true);
    this.authService
      .updateProfileData({photoURL: firestorePhotoUrl}, user)
      .subscribe({
        next: () => this.userPhoto.set(firestorePhotoUrl),
        error: err => console.error(err),
        complete: () => {
          this.isLoading.set(false);
          console.log('authProfile photoUrl updated');
        },
      });
  }

  updateAuthDisplayName(name: string, user: User) {
    this.isLoading.set(true);
    this.authService.updateProfileData({displayName: name}, user).subscribe({
      next: () => {
        this.authService.userDisplayName.set(name);
      },
      error: err => console.error(err),
      complete: () => {
        this.isLoading.set(false);
        console.log('authProfile name updated');
      },
    });
  }

  sendEmailVerification(user: User) {
    this.isLoading.set(true);
    this.authService.initiateEmail(user).subscribe({
      next: () => {
        console.log('email sent');
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.isLoading.set(false);
        console.log('stream completed');
      },
    });
  }

  verifyEmailCode(code: string) {
    this.isLoading.set(true);
    this.authService.applyEmailVerificationCode(code).subscribe({
      next: () => {
        console.log('email verified');
        this.authService.isEmailVerified.set(true);
      },
      error: err => {
        console.error(err);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
        console.log('stream completed');
      },
    });
  }

  updateUserRole(role: Role, userToken: string) {
    this.isLoading.set(true);
    this.functionsService.setRoleClaims(userToken, role).subscribe({
      next: () => {
        console.log('update role succsess');
        this.authService.userRole.set(role);
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.isLoading.set(false);
        console.log('stream completed');
      },
    });
  }

  selectRole() {
    this.functionsService.onRoleSelected().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        console.log('stream completed');
      },
    })
  }


}

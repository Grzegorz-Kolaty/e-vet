import {
  ChangeDetectionStrategy,
  Component, effect,
  inject,
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Router} from '@angular/router';
import {RoleAssignmentComponent} from '../role-assignment/role-assignment.component';
import {ProfilePicComponent} from './profile-pic/profile-pic.component';
import {Role} from '../../shared/interfaces/user.interface';


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FontAwesomeModule, RoleAssignmentComponent, ProfilePicComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      @if (!authService.userRole()) {
        <app-role-assignment></app-role-assignment>
      } @else {
        <app-profile-pic [user]="authService.verifiedEmailedUser()"></app-profile-pic>

        <div class="mt-5 p-3 text-center">
          <h4>{{ userRole() === Role.Vet ? Role.Vet + '.' : '' }}{{ user()?.displayName }}</h4>
<!--          <div class="d-inline-flex">-->
<!--            <button class="btn btn-lg btn-outline-primary mx-3" type="submit">Kliniki</button>-->
<!--            <button class="btn btn-lg btn-primary mx-2" type="submit">Pacjenci</button>-->
<!--          </div>-->
        </div>

        <div class="row m-5 justify-content-center my-5 shadow-lg">
          <!-- Main Content -->
          <div class="col-12">
            <div class="card border-0 rounded-3">
              <div class="card-body p-0">
                <div class="row g-0">
                  <!-- Sidebar -->
                  <div class="col-lg-3 border-end">
                    <div class="p-4">
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
                  <div class="col-lg-9 p-4">
                    <!-- Personal Information -->
                    <form class="mb-4">
                      <h5 class="mb-4">Twoje dane</h5>
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Nazwa użytkownika</label>
                          <input type="text" class="form-control" disabled [value]="user()?.displayName">
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Email</label>
                          <input type="email" class="form-control" disabled [value]="user()?.email">
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
                    </form>

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
      }

    </section>
  `,
  styles: ``,
})
export default class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);

  user = this.authService.verifiedEmailedUser;
  userRole = this.authService.userRole

  constructor() {
    effect(() => {
      if (!this.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }

  // updateAuthDisplayName(name: string, user: User) {
  //   this.isLoading.set(true);
  //   this.authService.updateProfileData({displayName: name}, user).subscribe({
  //     next: () => {
  //       console.log(name);
  //     },
  //     error: err => console.error(err),
  //     complete: () => {
  //       this.isLoading.set(false);
  //       console.log('authProfile name updated');
  //     },
  //   });
  // }


  protected readonly Role = Role;
}

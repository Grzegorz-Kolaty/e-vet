import {
  ChangeDetectionStrategy,
  Component, computed, effect,
  inject, resource, signal,
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Router} from '@angular/router';
import {ProfilePicComponent} from './profile-pic/profile-pic.component';
import {Role} from '../../shared/interfaces/user.interface';
import {ProfileFormComponent} from './profile-form/profile-form.component';
import {FunctionsService} from '../../shared/data-access/functions.service';


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FontAwesomeModule, ProfilePicComponent, ProfileFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
        <app-profile-pic [user]="authService.user()"></app-profile-pic>

        <div class="mt-5 p-3 text-center">
<!--          <h4>{{ userRole() === Role.Vet ? Role.Vet + '.' : '' }}{{ user()?.displayName }}</h4>-->
          <!--          <div class="d-inline-flex">-->
          <!--            <button class="btn btn-lg btn-outline-primary mx-3" type="submit">Kliniki</button>-->
          <!--            <button class="btn btn-lg btn-primary mx-2" type="submit">Pacjenci</button>-->
          <!--          </div>-->
        </div>

        <app-profile-form [user]="authService.user()" [role]="Role.User" (userName)="displayNameSig.set($event)"
                          [status]="displayNameChangeStatus()"></app-profile-form>


    </section>
  `,
  styles: ``,
})
export default class ProfileComponent {
  authService = inject(AuthService);
  functionsService = inject(FunctionsService)
  router = inject(Router);

  protected readonly Role = Role;



  // user = this.authService.verifiedEmailedUser;
  //
  // userRole = this.authService.userRole

  displayNameSig = signal<string | undefined>(undefined);
  onDisplayNameChange = resource({
    request: () => this.displayNameSig(),
    loader: name => this.authService.updateProfiles(name.request!)
  })
  displayNameChangeStatus = computed(() => this.onDisplayNameChange.status())

  // constructor() {
  //   effect(() => {
  //     if (!this.authService.user()) {
  //       this.router.navigate(['auth', 'login']);
  //     }
  //   });
  //
  //   // effect(() => {
  //   //   console.log(this.displayNameChangeStatus());
  //   // });
  // }

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


}

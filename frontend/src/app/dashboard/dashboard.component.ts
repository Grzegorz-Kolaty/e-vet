import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {Router} from "@angular/router";
import {Role} from "../shared/interfaces/user.interface";
import UserComponent from "./user/user.component";
import {LoaderComponent} from "../shared/ui/loader/loader.component";
import VetComponent from "./vet/vet.component";
import SendEmailVerificationComponent from "../auth/send-verification-email/ui/send-verification-email.component";
import ProfileFormComponent from "./ui/profile-form/profile-form.component";
import {AuthService} from "../shared/data-access/auth.service";
import {UsersService} from "../shared/data-access/users.service";


@Component({
  selector: 'app-dashboard',
  imports: [
    LoaderComponent,
    VetComponent,
    SendEmailVerificationComponent,
    ProfileFormComponent,
    UserComponent,
  ],
  template: `
    <section class="container-fluid h-100 p-5">
      @if (authService.user(); as profile) {

        @if (profile && !profile.is_email_verified) {
          <app-send-email-verification/>
        } @else if (profile.role === Role.Vet) {
          <app-vet/>

          <app-profile-form
            [user]="profile"

            [uploadPhotoResourceStatus]="uploadPhotoResource.status()"
            (userPhotoFile)="onPhotoUpload($event)"

            [uploadNewProfileResource]="updateNameResource.status()"
            (userName)="onNameChange($event)"

            [emailChangeStatus]="emailChangeResource.status()"
            (userEmailChange)="onEmailChange($event)"
          />
        } @else if (profile.role === Role.User) {
          <app-user/>

          <app-profile-form
            [user]="profile"

            [uploadPhotoResourceStatus]="uploadPhotoResource.status()"
            (userPhotoFile)="onPhotoUpload($event)"

            [uploadNewProfileResource]="updateNameResource.status()"
            (userName)="onNameChange($event)"

            [emailChangeStatus]="emailChangeResource.status()"
            (userEmailChange)="onEmailChange($event)"
          />
        }

      } @else {
        <app-loader/>
      }

    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DashboardComponent {
  public readonly authService = inject(AuthService);
  private readonly userService = inject(UsersService);
  protected readonly Role = Role;
  private readonly router = inject(Router);

  uploadPhotoTrigger = signal<File | undefined>(undefined);
  updateNameTrigger = signal<string | undefined>(undefined);
  emailChangeTrigger = signal<{
    email: string;
    password: string;
  } | undefined>(undefined);

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
      const updatedUser = this.uploadPhotoResource.value();

      if (updatedUser) {
        this.authService.user.set(updatedUser);
      }
    });

    effect(() => {
      const updatedUser = this.updateNameResource.value();

      if (updatedUser) {
        this.authService.user.set(updatedUser);
      }
    });
  }

  uploadPhotoResource = resource({
    params: this.uploadPhotoTrigger,
    loader: async ({params}) => {
      return this.userService.uploadProfilePhoto(params);
    },
  });

  updateNameResource = resource({
    params: this.updateNameTrigger,
    loader: async ({params}) => {
      return this.userService.updateName(params);
    },
  });

  emailChangeResource = resource({
    params: this.emailChangeTrigger,

    loader: async ({params}) => {
      return this.userService.requestEmailChange(
        params.email,
        params.password,
      );
    },
  });

  onPhotoUpload(file: File) {
    this.uploadPhotoTrigger.set(file);
  }

  onNameChange(name: string) {
    this.updateNameTrigger.set(name);
  }

  onEmailChange(data: {
    email: string;
    password: string;
  }) {
    this.emailChangeTrigger.set(data);
  }
}

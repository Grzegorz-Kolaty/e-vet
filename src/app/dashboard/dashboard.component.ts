import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {Router} from "@angular/router";
import {Role, UploadContext, UserInterface} from "../shared/interfaces/user.interface";
import UserComponent from "./user/user.component";
import {LoaderComponent} from "../shared/ui/loader/loader.component";
import VetComponent from "./vet/vet.component";
import SendEmailVerificationComponent from "../auth/send-verification-email/ui/send-verification-email.component";
import ProfileFormComponent from "./ui/profile-form/profile-form.component";
import {AuthService} from "../shared/data-access/auth.service";


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

        @if (profile.is_email_verified) {
          <app-send-email-verification/>
        } @else if (profile.role === Role.Vet) {
          <app-vet/>

          <app-profile-form
            [user]="profile"
            [uploadPhotoResourceStatus]="uploadPhotoResource.status()"
            (userPhotoFile)="onPhotoUpload(profile, $event)"
            (userName)="onNameChange(profile, $event)"
            [uploadNewProfileResource]="updateNameResource.status()"
          />
        } @else if (profile.role === Role.User) {
          <app-user/>

          <app-profile-form
            [user]="profile"
            [uploadPhotoResourceStatus]="uploadPhotoResource.status()"
            (userPhotoFile)="onPhotoUpload(profile, $event)"
            (userName)="onNameChange(profile, $event)"
            [uploadNewProfileResource]="updateNameResource.status()"
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
  protected readonly Role = Role;
  private router = inject(Router)

  uploadPhotoTrigger = signal<UploadContext | null>(null);
  nameTrigger = signal<UserInterface | null>(null)

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
      if (this.uploadPhotoResource.status() === 'resolved' && this.uploadPhotoResource.value()) {
        const data = this.uploadPhotoResource.value();
        console.log(data);

        if (!data) return

        this.authService.user.update(user => ({
          ...user!,
          photo_url:  "",
        }));
      }
    });
  }


  uploadPhotoResource = resource({
    params: this.uploadPhotoTrigger,
    loader: async ({params}) => {
      if (!params || !params.file) throw new Error('No file');
      return
      // return this.userService.uploadProfilePhoto(params.profile, params.file);
    },
  });

  onPhotoUpload(profile: UserInterface, file: File) {
    console.log(profile, file);
    this.uploadPhotoTrigger.set({profile: profile, file: file});
  }

  updateNameResource = resource({
    params: this.nameTrigger,
    loader: async ({params}) => {
      if (!params) return;

      return

      // return this.userService.uploadProfilePhoto(
      //   params,
      // );
    },
  });

  onNameChange(profile: UserInterface, name: string) {
    const newProfile = {
      ...profile,
      name: name,
    }
    this.nameTrigger.set(newProfile);
  }

}

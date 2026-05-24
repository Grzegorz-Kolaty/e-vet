import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {Router} from "@angular/router";
import {Role, UploadContext, UserProfile} from "../shared/interfaces/userProfile";
import UserComponent from "./user/user.component";
import {UserService} from "../shared/data-access/user.service";
import {LoaderComponent} from "../shared/ui/loader/loader.component";
import VetComponent from "./vet/vet.component";
import SendEmailVerificationComponent from "../auth/send-verification-email/ui/send-verification-email.component";
import ProfileFormComponent from "./ui/profile-form/profile-form.component";
import {AuthService} from "../shared/data-access/auth.service";


@Component({
  selector: 'app-dashboard',
  imports: [
    UserComponent,
    LoaderComponent,
    VetComponent,
    SendEmailVerificationComponent,
    ProfileFormComponent,
  ],
  template: `
    <section class="container-fluid h-100 p-5">
      @if (authService.user(); as profile) {

        @if (!profile.email_verified) {
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
  protected readonly userService = inject(UserService);

  uploadPhotoTrigger = signal<UploadContext | null>(null);
  nameTrigger = signal<UserProfile | null>(null)

  constructor() {
    effect(() => {
      const user = this.authService.user()
      if (!user) {
        this.router.navigate(['auth', 'login']);
      }
    });

    effect(() => {
      if (this.uploadPhotoResource.status() === 'resolved' && this.uploadPhotoResource.value()) {
        const data = this.uploadPhotoResource.value();
        console.log(data);

        this.authService.user.update(user => ({
          ...user!,
          photoUrl: data?.photoUrl,
        }));
      }
    });
  }


  uploadPhotoResource = resource({
    params: this.uploadPhotoTrigger,
    loader: async ({params}) => {
      if (!params || !params.file) throw new Error('No file');
      return this.userService.uploadProfilePhoto(params.profile, params.file);
    },
  });

  onPhotoUpload(profile: UserProfile, file: File) {
    console.log(profile, file);
    this.uploadPhotoTrigger.set({profile: profile, file: file});
  }

  updateNameResource = resource({
    params: this.nameTrigger,
    loader: async ({params}) => {
      if (!params) return;

      return this.userService.uploadProfilePhoto(
        params,
      );
    },
  });

  onNameChange(profile: UserProfile, name: string) {
    const newProfile = {
      ...profile,
      name: name,
    }
    this.nameTrigger.set(newProfile);
  }

}

import {Component, inject, input, Input, linkedSignal} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {StorageService, UploadFile} from '../../../shared/data-access/storage.service';
import {User} from 'firebase/auth';
import {AuthService} from '../../../shared/data-access/auth.service';

@Component({
  selector: 'app-profile-pic',
  imports: [FaIconComponent],
  template: `
    <input
      hidden
      #inputField
      type="file"
      id="file"
      accept="image/png, image/jpeg"
      (change)="handleFileSelection($event)"
    />

    <div class="p-5 profile-sidebar position-relative mb-5">
      <div class="position-absolute top-100 start-50 translate-middle">
        <img class="border border-5 border-white rounded-circle img-fluid position-relative" width="126"
             [src]="user()?.photoURL || 'assets/placeholder.svg'" alt="profile"/>
        <button type="button" (click)="inputField.click()"
                class="btn btn-sm btn-outline-secondary border-0  position-absolute bottom-0 end-0">
          <fa-icon [icon]="['fas', 'user']"></fa-icon>
        </button>
      </div>
    </div>
  `,
  styles: `
    .profile-sidebar {
      background: linear-gradient(135deg, #4158D0 0%, #C850C0 100%);
    }

    .img-fluid {
      height: 128px;
    }
  `
})
export class ProfilePicComponent {
  storageService = inject(StorageService);
  authService = inject(AuthService);
  user = input.required<User | null>()
  isLoading = linkedSignal(() => false);


  handleFileSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;
    if (selectedFiles) {
      const upload = {
        file: selectedFiles[0],
        path: `users/${this.user()?.uid}/profilePic.jpg`,
      };
      this.updateStoragePhotoUrl(upload);
    }
  }

  updateStoragePhotoUrl(upload: UploadFile) {
    this.isLoading.set(true);
    this.storageService.uploadFileResult(upload).subscribe({
      next: photoUrl => this.updateAuthPhotoUrl(photoUrl),
      error: err => console.error(err),
      complete: () => {
        console.log('storagePhoto updated');
        this.isLoading.set(false);
      },
    });
  }

  updateAuthPhotoUrl(firestorePhotoUrl: string) {
    this.isLoading.set(true);
    this.authService
      .updateProfileData({photoURL: firestorePhotoUrl}, this.user()!)
      .subscribe({
        next: () => this.authService.refreshToken(),
        error: err => console.error(err),
        complete: () => {
          this.isLoading.set(false);
          window.location.reload();
        },
      });
  }

}

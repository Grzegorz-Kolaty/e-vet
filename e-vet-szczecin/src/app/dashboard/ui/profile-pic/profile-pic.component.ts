import {Component, inject, input, linkedSignal} from '@angular/core';
import {StorageService, UploadFile} from '../../../shared/data-access/storage.service';
import {User} from 'firebase/auth';
import {AuthService} from '../../../shared/data-access/auth.service';

@Component({
  selector: 'app-profile-pic',
  imports: [],
  template: `
    <div class="card bg-dark text-white" style="width: 10rem;">
      <input hidden
             #inputField
             type="file"
             id="file"
             accept="image/png, image/jpeg"
             (change)="handleFileSelection($event)"/>

      <button class="btn" type="button" (click)="inputField.click()">
        <img class="card-img-top"
             height="128" width="128"
             [src]="user()?.photoURL || 'assets/placeholder.svg'"
             alt="profile"/>
      </button>

      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
      </div>
    </div>
  `,
  styles: ``
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
        error: err => console.error(err),
        complete: () => {
          this.isLoading.set(false);
          window.location.reload();
        },
      });
  }

}

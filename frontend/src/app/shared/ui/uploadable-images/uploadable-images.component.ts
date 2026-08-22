import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {NgClass} from "@angular/common";


@Component({
  selector: 'app-uploadable-images',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass
  ],
  template: `
    <div class="bg-transparent">
      <input hidden
             #inputField
             type="file"
             accept="image/png, image/jpeg"
             (change)="handleFileSelection($event)"/>

      <button class="border-0 bg-transparent p-0 w-100"
              type="button"
              (click)="inputField.click()">

        <img class="bg-transparent"
             [ngClass]="widerSize() ? 'cover-image' : 'profile-image'"
             [src]="photoUrl() || 'assets/placeholder.svg'"
             alt="profile"
        />
      </button>
    </div>
  `,
  styles: `
    .cover-image {
      max-width: 100%;
      width: 100%;
      height: 320px;
      object-fit: cover;
      object-position: center;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
      border-radius: 20px;
    }

    .profile-image {
      height: auto;
      max-height: 250px;
      max-width: 100%;
      object-position: center;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
      border-radius: 20px;
    }
  `
})
export class UploadableImagesComponent {
  photoUrl = input<string>()
  widerSize = input<boolean>(false)
  photoFile = output<File>()

  handleFileSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;
    if (!selectedFiles) {
      console.error('No files selected');
      return
    }

    console.log(selectedFiles[0]);

    this.photoFile.emit(selectedFiles[0])
  }


}

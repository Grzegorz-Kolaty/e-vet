import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  template:`
    <div class="upload-box">
      @if (imageUrl()) {
        <img [src]="imageUrl()" class="preview" alt="img"/>
      } @else {
        <div class="placeholder">
          Dodaj zdjęcie kliniki
        </div>
      }

      <input type="file" (change)="onFile($event)"/>
    </div>
  `,
  styles: `
    .upload-box {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      border-radius: 12px;
    }

    .preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppImageUpload {
  fileSelected = output<File>()
  imageUrl = input<string | null>(null)
  onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.fileSelected.emit(file);
  }

}

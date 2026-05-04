import {inject, Injectable} from '@angular/core';
import {from} from 'rxjs';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  StorageReference,
} from 'firebase/storage';
import {STORAGE} from "../../firebase.providers";

export interface UploadFile {
  file: File;
  path: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = inject(STORAGE);

  private ref(path: string) {
    return ref(this.storage, path);
  }

  uploadAndGetUrl(file: File, path: string) {
    const storageRef = this.ref(path);

    return from(
      uploadBytes(storageRef, file).then(() =>
        getDownloadURL(storageRef)
      )
    );
  }

  getUrl(data: StorageReference) {
    return from(getDownloadURL(data));
  }


}

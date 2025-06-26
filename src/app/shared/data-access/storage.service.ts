import { inject, Injectable } from '@angular/core';
import { from } from 'rxjs';
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

  getStorageReference(path: string) {
    return ref(this.storage, path);
  }

  uploadFileResult(data: UploadFile) {
    const storageRef = this.getStorageReference(data.path);
    const promise = uploadBytes(storageRef, data.file).then(() =>
      getDownloadURL(storageRef)
    );
    return from(promise);
  }

  getUrl(data: StorageReference) {
    return from(getDownloadURL(data));
  }
}

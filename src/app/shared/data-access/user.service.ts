import {inject, Injectable} from '@angular/core';
import {Role, UserProfile} from "../interfaces/userProfile";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {FIRESTORE, STORAGE} from "../../firebase.providers";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

export class UserServiceError extends Error {
  constructor(
    message: string,
    public code: 'NO_USER' | 'UPLOAD_FAILED' | 'FIRESTORE_FAILED'
  ) {
    super(message);
  }
}


@Injectable({providedIn: 'root'})
export class UserService {
  private storage = inject(STORAGE);
  private firestore = inject(FIRESTORE);


  async loadProfile(uid: string, role: Role): Promise<UserProfile | null> {
    if (!uid || !role) return null;

    if (role === Role.User) {
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);

      return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
    }

    if (role === Role.Vet) {
      const vetRef = doc(this.firestore, 'vets', uid);
      const vetSnap = await getDoc(vetRef);

      return vetSnap.exists() ? (vetSnap.data() as UserProfile) : null;
    }

    return null;
  }

  // ----------------------------
  // 3. UPLOAD PROFILE PHOTO (FULL FLOW)
  // ----------------------------
  async uploadProfilePhoto(user: UserProfile, file?: File) {
    if (!user) {
      throw new UserServiceError(
        'User is required',
        'NO_USER'
      );
    }

    const folder = user.role === Role.Vet ? 'vets' : 'users';
    const path = `${folder}/${user.user_id}/profile.jpg`;

    try {
      let photoUrl = user.photoUrl;

      if (file) {
        const storageRef = ref(this.storage, path);

        try {
          await uploadBytes(storageRef, file);
          photoUrl = await getDownloadURL(storageRef);
        } catch (err) {
          throw new UserServiceError(
            'Upload failed',
            'UPLOAD_FAILED'
          );
        }
      }

      const profileRef = doc(this.firestore, folder, user.user_id);

      try {
        await setDoc(
          profileRef,
          {
            ...user,
            photoUrl
          },
          { merge: true }
        );
      } catch (err) {
        throw new UserServiceError(
          'Saving profile failed',
          'FIRESTORE_FAILED'
        );
      }

      return {
        ...user,
        photoUrl
      };

    } catch (err) {
      console.error('[UserService]', err);
      throw err;
    }
  }
}

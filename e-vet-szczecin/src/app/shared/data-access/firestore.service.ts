import { inject, Injectable } from '@angular/core';
import { FIRESTORE } from '../../app.config';
import { Profile } from '../interfaces/user.interface';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore = inject(FIRESTORE);

  getProfile(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);

    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        const data = docSnap.data();
        return data as Profile;
      })
    );
  }

  updateFirestoreProfile(profile: Profile) {
    const profileRef = doc(this.firestore, 'users', profile.uid);
    const promise = setDoc(profileRef, profile);
    return from(promise);
  }
}

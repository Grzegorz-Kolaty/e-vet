import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {Profile} from '../interfaces/user.interface';
import {doc, getDoc, setDoc, onSnapshot, DocumentData} from 'firebase/firestore';
import {from, map, switchMap} from 'rxjs';
import {FIRESTORE} from "../../firebase.providers";
import {Clinic} from "../interfaces/clinics.interface";


@Injectable(
  {
    providedIn: 'root',
  }
)
export class FirestoreService implements OnDestroy {
  firestore = inject(FIRESTORE);
  uid2 = signal('1');
  dataSig = signal<DocumentData | undefined>(undefined)

  data = onSnapshot(doc(this.firestore, `appointments/${this.uid2()}`),
    snap => {
      this.dataSig.set(snap.data())
    }
  )

  async getVet(uid: string) {
    return from(getDoc(doc(this.firestore, `vets/${uid}`))).pipe(
      map(snap => snap.data())
    );
  }

  async getMyClinic(uid: string) {
    return (await this.getVet(uid)).pipe(
      map(vet => vet?.["clinicId"]),
      switchMap(clinicId => {
        if (!clinicId) throw new Error('Vet nie ma kliniki');

        return from(getDoc(doc(this.firestore, `clinics/${clinicId}`)));
      }),
      map(snap => snap.data() as Clinic)
    );
  }

  async getVetClinicById(id: string): Promise<Clinic> {
    const snap = await getDoc(doc(this.firestore, 'clinics', id));

    if (!snap.exists()) {
      throw new Error('Klinika nie istnieje');
    }

    const data = snap.data() as any;

    return {
      ...data,
      geojson: JSON.parse(data.geojson),
    };
  }

  async updateClinic(id: string, partial: Partial<Clinic>) {
    const ref = doc(this.firestore, 'clinics', id);

    const promise = setDoc(ref, partial, {merge: true});

    return from(promise)
  }


  // steamData = rxResource({
  //   request: this.uid,
  //   loader: () => ( docData(doc(this.firestore, `users/${this.uid()}`)))
  // })
  // steamData2 = rxResource({
  //   request: this.uid2,
  //   loader: ({ request }) => docData(doc(this.firestore, `appointments/${request}`))
  //   .pipe(
  //   distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  //
  // )
  //     .pipe(take(1))
  // });

  // data = computed(() => this.steamData2.value())

  getProfile(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        const data = docSnap.data();
        return data as Profile;
      })
    );
  }

  updateUid(value: string) {
    this.uid2.update(() => value);
  }

  getProfile2(uid: string) {
    // const userDocRef = doc(this.firestore, `users/${uid}`);

    // return from(getDoc(userDocRef)).pipe(
    //   map(docSnap => {
    //     const data = docSnap.data();
    //     return data as Profile;
    //   })
    // );
  }

  updateFirestoreProfile(profile: Profile) {
    const profileRef = doc(this.firestore, 'users', profile.uid);
    const promise = setDoc(profileRef, profile);
    return from(promise);
  }

  ngOnDestroy() {
    console.log('firestore service destroyed')
    // this.data()
  }
}

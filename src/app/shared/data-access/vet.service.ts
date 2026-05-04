import {inject, Injectable, signal, effect, resource} from '@angular/core';
import {collection, doc, onSnapshot, query, where} from 'firebase/firestore';
import {FIRESTORE} from '../../firebase.providers';
import {UserInterface} from "../interfaces/user.interface";
import {Clinic} from "../interfaces/clinics.interface";

@Injectable({providedIn: 'root'})
export class VetService {
  private firestore = inject(FIRESTORE);

  uid = signal<string | null>(null);
  vet = signal<UserInterface | null>(null);

  clinic = signal<Clinic | null>(null);
  vets = signal<UserInterface[]>([]);

  init(uid: string) {
    console.log("vetservice has id", uid);
    onSnapshot(doc(this.firestore, `vets/${uid}`), (snap) => {
      const vet = snap.data() as UserInterface;

      this.vet.set(vet);

      console.log("vetservice vet", vet)

      if (!vet?.["clinicId"]) {
        this.clinic.set(null);
        return;
      }

      onSnapshot(
        doc(this.firestore, `clinics/${vet["clinicId"]}`),
        (clinicSnap) => {
          this.clinic.set(clinicSnap.data() as Clinic);
        }
      );
    });
  }

  constructor() {
    effect(() => {
      console.log("vetservuce clinic", this.clinic())
    });
  }

  getVetsByClinic(clinicId: string) {
    const q = query(
      collection(this.firestore, 'vets'),
      where('clinicId', '==', clinicId)
    );

    return onSnapshot(q, (snapshot) => {
      const vets = snapshot.docs.map(doc => ({
        ...(doc.data() as any),
        uid: doc.id
      }));

      this.vets.set(vets);
    });
  }
}

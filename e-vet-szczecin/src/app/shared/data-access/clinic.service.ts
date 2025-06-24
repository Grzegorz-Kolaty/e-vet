import {inject, Injectable} from '@angular/core';
import {FIRESTORE} from "../../firebase.providers";
import {defer} from 'rxjs';
import {Appointment} from '../interfaces/user.interface';
import {
  collection,
  deleteDoc,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import {FunctionsService} from "./functions.service";
import {Clinic, CreateClinic} from "../interfaces/clinics.interface";


@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private firestore = inject(FIRESTORE);
  private readonly functionsService = inject(FunctionsService);

  public async getVetClinicById(clinicId: string): Promise<Clinic> {
    const clinicDocRef = doc(this.firestore, 'clinics', clinicId);
    const clinicSnap = await getDoc(clinicDocRef)

    if (clinicSnap.exists()) {
      return clinicSnap.data() as Clinic
    } else {
      throw new Error('Clinic not found')
    }
  }

  async findClinicByCoordinates(lat: number, lon: number, toleranceMeters = 20): Promise<Clinic | null> {
    const clinicsRef = collection(this.firestore, 'clinics');
    const snapshot = await getDocs(clinicsRef);

    for (const doc of snapshot.docs) {
      const data = doc.data() as Clinic & { geo: GeoPoint };
      if (!data.geo) continue;

      const distance = this.haversineDistance(lat, lon, data.geo.latitude, data.geo.longitude);
      if (distance <= toleranceMeters) {
        return {id: doc.id, ...data};
      }
    }

    return null;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (v: number) => v * Math.PI / 180;
    const R = 6371e3; // radius Earth in meters
    const φ1 = toRad(lat1), φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  async createNewClinic(createNewClinic: CreateClinic) {
    await this.functionsService.createNewClinic(createNewClinic)
    // await this.authService.refreshIdToken()
  }


  private removeAppointment(appointment: Appointment) {
    const docRef = doc(this.firestore, `appointments/${appointment.id}`)
    return defer(() => deleteDoc(docRef))
  }

  // private getAppointments() {
  //   const appointmentsCollection = query(
  //     collection(this.firestore, 'appointments'),
  //     orderBy('created', 'desc'),
  //     limit(50),
  //   );
  //
  //   return collectionData<Appointment>(appointmentsCollection, {idField: 'id'}).pipe(
  //     map((appointments: Appointment[]) => [...appointments].reverse()),
  //   ) as Observable<Appointment[]>;
  // }

  private reserveAppointment(appointment: Appointment) {
    const appointmentsCollection = doc(this.firestore, `appointments/${appointment.id}`)
    const updateData = {reserved: true};
    return defer(() => updateDoc(appointmentsCollection, updateData));
  }

  // ngOnDestroy(): void {
  //   // this.subs.dispose()
  // }
}

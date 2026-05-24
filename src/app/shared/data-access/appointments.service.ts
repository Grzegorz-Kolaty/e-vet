import {inject, Injectable} from '@angular/core';
import {collection, doc, getDocs, orderBy, query, setDoc, where} from 'firebase/firestore';
import {AuthService} from './auth.service';
import {FIRESTORE} from "../../firebase.providers";
import {Appointment} from "../interfaces/appointments.interface";

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  firestore = inject(FIRESTORE);
  authService = inject(AuthService);

  public buildDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`
  }

  async getAppointmentsForVet(range: { start: Date; end: Date }): Promise<Appointment[]> {
    const {start, end} = range;
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    const uid = this.authService.firebaseUser()?.uid;
    if (!uid) return [];

    const q = query(
      collection(this.firestore, 'appointments'),
      where('vetId', '==', uid),
      where('dateTimeFrom', '>=', startOfDay),
      where('dateTimeTo', '<=', endOfDay),
      orderBy('dateTimeFrom')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
  }

  async getAppointmentsForVetGroupedByDay(vetId: string, clinicId: string): Promise<Record<string, Appointment[]>> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
      collection(this.firestore, 'appointments'),
      where('vetId', '==', vetId),
      where('clinicId', '==', clinicId),
      where('dateTimeFrom', '>=', startOfDay),
      orderBy('dateTimeFrom', 'asc')
    );

    const snapshot = await getDocs(q);

    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];

    return appointments.reduce((groups: Record<string, Appointment[]>, appointment: Appointment) => {
      const date = appointment.dateTimeFrom instanceof Date
        ? appointment.dateTimeFrom
        : (appointment.dateTimeFrom).toDate();

      const dateKey = this.buildDateKey(date)

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(appointment);

      return groups;
    }, {} as Record<string, Appointment[]>);
  }

  public async reserveAppointment(appointment: Appointment) {
    const uid = this.authService.firebaseUser()?.uid;

    if (!uid) return;

    const docId = `${appointment.vetId}_${appointment.dateTimeFrom.toMillis()}`;
    const appointmentDocRef = doc(this.firestore, 'appointments', docId);
    const filledAppointment = {
      ...appointment,
      patientId: uid,
      reserved: true
    };
    await setDoc(appointmentDocRef, filledAppointment);
  }
}

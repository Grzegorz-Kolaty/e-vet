import {inject, Injectable} from '@angular/core';
import {
  deleteDoc,
  doc,
  setDoc,
  collection,
  query,
  limit,
  where,
  orderBy,
} from 'firebase/firestore';
import {collectionData} from 'rxfire/firestore';

import {from, map} from 'rxjs';
import {Appointment} from '../interfaces/user.interface';
import {AuthService} from './auth.service';
import {FIRESTORE} from "../../firebase.providers";

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private firestore = inject(FIRESTORE);
  authService = inject(AuthService);

  addAppointment(appointment: Appointment) {
    const docId = `${appointment.vetId}_${appointment.dateTimeFrom}`;
    const appointmentDocRef = doc(this.firestore, 'appointments', docId);
    return setDoc(appointmentDocRef, appointment);
  }

  removeAppointment(appointment: Appointment) {
    const docId = `${appointment.vetId}_${appointment.dateTimeFrom}`;
    const appointmentDocRef = doc(this.firestore, 'appointments', docId);
    return from(deleteDoc(appointmentDocRef));
  }

  getAppointmentsForVet(dayDate: Date[]) {
    const startOfDay = new Date(dayDate[0]);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dayDate[dayDate.length - 1]);
    endOfDay.setHours(23, 59, 59, 0);

    const uid = this.authService.firebaseUser()?.uid;

    const appointmentsCollection = query(
      collection(this.firestore, 'appointments'),
      where('vetId', '==', uid),
      where('dateTimeFrom', '>=', startOfDay.toISOString()),
      where('dateTimeFrom', '<=', endOfDay.toISOString()),
      orderBy('dateTimeFrom')
    );

    return collectionData(appointmentsCollection, {idField: 'id'}).pipe(
      map(appointmentsData => {
        return appointmentsData as Appointment[];
      })
    );
  }

  getReservedAppointmentsForVet(userId: string) {
    const appointmentsCollection = query(
      collection(this.firestore, 'appointments'),
      where('vetId', '==', userId),
      where('reserved', '==', true),
      orderBy('dateTimeFrom')
    );

    return collectionData(appointmentsCollection, {idField: 'id'}).pipe(
      map(appointmentsData => {
        console.log(appointmentsData)
        return appointmentsData as Appointment[];
      })
    );
  }

  getAppointmentsForReservation(dayDate: Date[]) {
    const startOfDay = new Date(dayDate[0]);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dayDate[dayDate.length - 1]);
    endOfDay.setHours(23, 59, 59, 0);

    const appointmentsCollection = query(
      collection(this.firestore, 'appointments'),
      // where('reserved', '==', false),
      where('dateTimeFrom', '>=', startOfDay.toISOString()),
      where('dateTimeFrom', '<=', endOfDay.toISOString()),
      orderBy('dateTimeFrom'),
      limit(20)
    );

    return collectionData(appointmentsCollection, {idField: 'id'}).pipe(
      map(appointmentsData => {
        return appointmentsData as Appointment[];
      })
    );
  }

  reserveAppointment(appointment: Appointment) {
    const docId = `${appointment.vetId}_${appointment.dateTimeFrom}`;
    const appointmentDocRef = doc(this.firestore, 'appointments', docId);
    const filledAppointment = {...appointment, reserved: true};
    return from(setDoc(appointmentDocRef, filledAppointment));
  }
}

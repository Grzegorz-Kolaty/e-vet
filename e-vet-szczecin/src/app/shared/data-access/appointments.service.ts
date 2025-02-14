import { inject, Injectable } from '@angular/core';
import { FIRESTORE } from '../../app.config';
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
import { collectionData } from 'rxfire/firestore';

import { from, map } from 'rxjs';
import { Appointment } from '../interfaces/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private firestore = inject(FIRESTORE);
  authService = inject(AuthService);

  // /**
  //  * Builds and object to create appointment
  //  * @param dateWithTime
  //  // * @param hour
  //  * @param vetProfile
  //  */
  // buildAppointment(dateWithTime: Date): Appointment {
  //   const user = this.authService.currentUserSig()?.user;
  //   const dateFormatted = dateWithTime.toISOString();
  //   const dateSplitted = dateFormatted.split('T');
  //
  //   return {
  //     vetId: user.uid,
  //     reserved: false,
  //     realised: false,
  //     city: 'Szczecin',
  //     dateTimeFrom: dateWithTime.toISOString(),
  //     dateTimeTo: dateWithTime.toISOString(),
  //     date: dateSplitted[0],
  //     time: dateSplitted[1],
  //   };
  // }

  addAppointment(appointment: Appointment) {
    const docId = `${appointment.vetId}_${appointment.dateTimeFrom}`;
    const appointmentDocRef = doc(this.firestore, 'appointments', docId);
    return from(setDoc(appointmentDocRef, appointment));
  }

  removeAppointment(appointment: Appointment) {
    const docId = `${appointment.vetId}_${appointment.dateTimeFrom}`;
    const appointmentDocRef = doc(this.firestore, 'appointments', docId);
    return from(deleteDoc(appointmentDocRef));
  }

  // this get function is too general, need more specific ones
  // getAppointments(dayDate: Date[]) {
  //   const startOfDay = new Date();
  //   // startOfDay.setHours(0, 0, 0, 0);
  //
  //   const endOfDay = new Date(dayDate[1]);
  //   endOfDay.setHours(23, 59, 59, 0);
  //
  //   const appointmentsCollection = query(
  //     collection(this.firestore, 'appointments'),
  //     where('dateTimeFrom', '>=', startOfDay.toISOString()),
  //     where('dateTimeFrom', '<=', endOfDay.toISOString()),
  //     orderBy('dateTimeFrom')
  //   );
  //
  //   return collectionData(appointmentsCollection, { idField: 'id' }).pipe(
  //     map(appointmentsData => {
  //       return appointmentsData as Appointment[];
  //     })
  //   );
  // }

  getAppointmentsForVet(dayDate: Date[]) {
    const startOfDay = new Date(dayDate[0]);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dayDate[dayDate.length - 1]);
    endOfDay.setHours(23, 59, 59, 0);

    const uid = this.authService.user()?.uid;

    const appointmentsCollection = query(
      collection(this.firestore, 'appointments'),
      where('vetId', '==', uid),
      where('dateTimeFrom', '>=', startOfDay.toISOString()),
      where('dateTimeFrom', '<=', endOfDay.toISOString()),
      orderBy('dateTimeFrom')
    );

    return collectionData(appointmentsCollection, { idField: 'id' }).pipe(
      map(appointmentsData => {
        console.log(appointmentsData);
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
      where('reserved', '==', false),
      where('dateTimeFrom', '>=', startOfDay.toISOString()),
      where('dateTimeFrom', '<=', endOfDay.toISOString()),
      orderBy('dateTimeFrom'),
      limit(20)
    );

    return collectionData(appointmentsCollection, { idField: 'id' }).pipe(
      map(appointmentsData => {
        return appointmentsData as Appointment[];
      })
    );
  }

  reserveAppointment(appointment: Appointment) {
    const docId = `${appointment.vetId}_${appointment.dateTimeFrom}`;
    const appointmentDocRef = doc(this.firestore, 'appointments', docId);

    const filledAppointment = { ...appointment, reserved: true };

    return from(setDoc(appointmentDocRef, filledAppointment));
  }
}

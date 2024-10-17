import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { AuthService } from "../../core/services/auth.service";
import { Subject } from "rxjs";
import { SubscriptionsManager } from "../../shared/utils/subscriber-manager";
import { FIRESTORE } from "../../app.config";


export interface Appointment {
  author: string;
  reserved: boolean;
  content: string;
  createdTime: string;
  appointmentTime: string
  id?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService implements OnDestroy {
  // appointments$ = this.getAppointments();
  add$ = new Subject<any>();
  patch$ = new Subject<any>();
  delete$ = new Subject<any>();
  error$ = new Subject<any>();
  private authService = inject(AuthService);
  private firestore = inject(FIRESTORE);
  private subs = new SubscriptionsManager();
  //state
  private readonly state = signal<AppointmentState>({
    appointments: [],
    error: null
  })

  // selectors
  appointments = computed(() => this.state().appointments);
  error = computed(() => this.state().error);


  constructor() {
    // this.subs.add = this.add$.pipe(
    //   takeUntilDestroyed(),
    //   exhaustMap((appointment) => this.addAppointment(appointment))).subscribe({
    //   error: (err) => {
    //     console.error(err);
    //     this.error$.next(err)
    //   }
    // })
    //
    // this.subs.add = this.patch$.pipe(
    //   takeUntilDestroyed(),
    //   exhaustMap((appointment) => this.reserveAppointment(appointment))).subscribe({
    //   error: (err) => {
    //     console.error(err);
    //     this.error$.next(err)
    //   }
    // })
    //
    // this.subs.add = this.delete$.pipe(
    //   takeUntilDestroyed(),
    //   exhaustMap((appointment) => this.removeAppointment(appointment))).subscribe({
    //   error: (err) => {
    //     console.error(err);
    //     this.error$.next(err)
    //   }
    // })
    //
    // this.subs.add = this.appointments$.pipe(
    //   takeUntilDestroyed()).subscribe((appointments) =>
    //   this.state.update((state) => ({
    //     ...state,
    //     appointments,
    //   })),
    // );
  }

  ngOnDestroy(): void {
    this.subs.dispose()
  }

  private addAppointment(appointment: Appointment) {
    //   const newAppointment = {
    //     author: this.authService.user()?.email,
    //     reserved: false,
    //
    //     content: appointment,
    //     created: Date.now().toString(),
    //     dateTime: Date.now().toString()
    //   }
    //
    //   const appointmentsCollection = collection(this.firestore, 'appointments');
    //   const appointmentId = "custom-id";
    //   const appointmentDoc = doc(appointmentsCollection, appointmentId);
    //   return setDoc(appointmentDoc, newAppointment);
    // }
    //
    //
    // private removeAppointment(appointment: Appointment) {
    //   const docRef = doc(this.firestore, `appointments/${appointment.id}`)
    //   return defer(() => deleteDoc(docRef))
    // }
    //
    // getAppointments() {
    //   const appointmentsCollection = query(
    //     collection(this.firestore, 'appointments'),
    //     orderBy('created', 'desc'),
    //     limit(50),
    //   );
    //
    //   return collectionData<Appointment>(appointmentsCollection, {idField: 'id'}).pipe(
    //     map((appointments: Appointment[]) => [...appointments].reverse()),
    //   ) as Observable<Appointment[]>;
  }

  private reserveAppointment(appointment: Appointment) {
    // const appointmentsCollection = doc(this.firestore, `appointments/${appointment.id}`)
    // const updateData = {reserved: true};
    // return defer(() => updateDoc(appointmentsCollection, updateData));
  }
}

import {computed, inject, Injectable, OnDestroy, signal} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {defer, exhaustMap, map, Observable, Subject} from "rxjs";
import {SubscriptionsManager} from "../../shared/utils/subscriber-manager";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {
  addDoc,
  collection,
  collectionData, deleteDoc,
  doc,
  Firestore,
  limit,
  orderBy,
  query,
  updateDoc
} from "@angular/fire/firestore";

export interface Appointment {
  author: string;
  reserved: boolean;
  content: string;
  created: string;
  id: string;
}

interface AppointmentState {
  appointments: Appointment[];
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService implements OnDestroy {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private subs = new SubscriptionsManager();

  appointments$ = this.getAppointments();
  add$ = new Subject<any>();
  patch$ = new Subject<any>();
  delete$ = new Subject<any>();
  error$ = new Subject<any>();

  //state
  private readonly state = signal<AppointmentState>({
    appointments: [],
    error: null
  })

  // selectors
  appointments = computed(() => this.state().appointments);
  error = computed(() => this.state().error);


  constructor() {
    this.subs.add = this.add$.pipe(
      takeUntilDestroyed(),
      exhaustMap((appointment) => this.addAppointment(appointment))).subscribe({
      error: (err) => {
        console.error(err);
        this.error$.next(err)
      }
    })

    this.subs.add = this.patch$.pipe(
      takeUntilDestroyed(),
      exhaustMap((appointment) => this.reserveAppointment(appointment))).subscribe({
      error: (err) => {
        console.error(err);
        this.error$.next(err)
      }
    })

    this.subs.add = this.delete$.pipe(
      takeUntilDestroyed(),
      exhaustMap((appointment) => this.removeAppointment(appointment))).subscribe({
      error: (err) => {
        console.error(err);
        this.error$.next(err)
      }
    })

    this.subs.add = this.appointments$.pipe(
      takeUntilDestroyed()).subscribe((appointments) =>
      this.state.update((state) => ({
        ...state,
        appointments,
      })),
    );
  }

  private addAppointment(appointment: any) {
    const newAppointment = {
      author: this.authService.user()?.email,
      content: appointment,
      created: Date.now().toString(),
      reserved: false
    }

    const appointmentsCollection =
      collection(this.firestore, 'appointments')

    return addDoc(appointmentsCollection, newAppointment)
  }

  private removeAppointment(appointment: Appointment) {
    const docRef = doc(this.firestore, `appointments/${appointment.id}`)
    return defer(() => deleteDoc(docRef))
  }

  private getAppointments() {
    const appointmentsCollection = query(
      collection(this.firestore, 'appointments'),
      orderBy('created', 'desc'),
      limit(50),
    );

    return collectionData<Appointment>(appointmentsCollection, {idField: 'id'}).pipe(
      map((appointments: Appointment[]) => [...appointments].reverse()),
    ) as Observable<Appointment[]>;
  }

  private reserveAppointment(appointment: Appointment) {
    const appointmentsCollection = doc(this.firestore, `appointments/${appointment.id}`)
    const updateData = {reserved: true};
    return defer(() => updateDoc(appointmentsCollection, updateData));
  }

  ngOnDestroy(): void {
    this.subs.dispose()
  }
}

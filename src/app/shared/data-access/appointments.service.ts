import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Appointment} from '../interfaces/appointments.interface';
import {ITreatment} from '../interfaces/animals.interface';
import {environment} from '../../../environments/environment';

type AppointmentResponse = Omit<Appointment, 'dateTimeFrom' | 'dateTimeTo'> & {
  dateTimeFrom: string;
  dateTimeTo: string;
};


@Injectable({providedIn: 'root',})
export class AppointmentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private mapAppointment(appointment: AppointmentResponse): Appointment {
    return {
      ...appointment,
      dateTimeFrom: new Date(appointment.dateTimeFrom),
      dateTimeTo: new Date(appointment.dateTimeTo),
    } as Appointment;
  }

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    const response = await firstValueFrom(
      this.http.post<AppointmentResponse>(
        `${this.apiUrl}/appointments`,
        {
          vetId: appointment.vetId,
          clinicId: appointment.clinicId,
          clinicName: appointment.clinicName,
          vetDisplayName: appointment.vetDisplayName,
          city: appointment.city,
          dateTimeFrom: appointment.dateTimeFrom.toISOString(),
          dateTimeTo: appointment.dateTimeTo.toISOString(),
        },
        {
          withCredentials: true,
        },
      ),
    );

    return this.mapAppointment(response);
  }

  async deleteAppointment(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(
        `${this.apiUrl}/appointments/${id}`,
        {
          withCredentials: true,
        },
      ),
    );
  }

  async getAppointmentsForVet(range: { start: Date; end: Date }): Promise<Appointment[]> {
    const startOfDay = new Date(range.start);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(range.end);
    endOfDay.setHours(23, 59, 59, 999);
    const appointments = await firstValueFrom(this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments/vet`, {
      params: {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString(),
      }, withCredentials: true,
    },),);
    return appointments.map((appointment) => this.mapAppointment(appointment));
  }

  async getAppointmentsForVetGroupedByDay(vetId: string, clinicId: string,): Promise<Record<string, Appointment[]>> {
    const appointments = await firstValueFrom(this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments/available`, {
      params: {
        vetId,
        clinicId,
      }, withCredentials: true,
    },),);
    return appointments.map((appointment) => this.mapAppointment(appointment)).reduce((groups: Record<string, Appointment[]>, appointment: Appointment) => {
      const dayStart = new Date(appointment.dateTimeFrom);
      dayStart.setHours(0, 0, 0, 0);
      const dateKey = dayStart.getTime().toString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(appointment);
      return groups;
    }, {});
  }

  async bookAppointment(appointment: Appointment, _userId: string, userName: string, petId: string, petName: string,): Promise<void> {
    if (!appointment.id) {
      throw new Error('Appointment id is required');
    }
    await firstValueFrom(this.http.put<AppointmentResponse>(`${this.apiUrl}/appointments/${appointment.id}/book`, {
      patientName: userName,
      petId,
      petName,
    }, {withCredentials: true,},),);
  }

  async getAppointmentsByUserOrVet(_uid: string, role: 'user' | 'vet',): Promise<Appointment[]> {
    const appointments = await firstValueFrom(this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments`, {
      params: {role,},
      withCredentials: true,
    },),);
    return appointments.map((appointment) => this.mapAppointment(appointment));
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const appointment = await firstValueFrom(this.http.get<AppointmentResponse>(`${this.apiUrl}/appointments/${id}`, {withCredentials: true,},),);
      return this.mapAppointment(appointment);
    } catch {
      return null;
    }
  }

  async markAsRealised(id: string): Promise<void> {
    await firstValueFrom(this.http.patch<void>(`${this.apiUrl}/appointments/${id}/realise`, {}, {withCredentials: true,},),);
  }

  async completeAppointmentAndAddTreatment(petId: string, appointmentId: string, treatmentData: ITreatment,): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.apiUrl}/appointments/${appointmentId}/complete`, {
          ...treatmentData,
          petId,
          appointmentId,
          date: treatmentData.date instanceof Date ? treatmentData.date.toISOString() : treatmentData.date,
        }, {withCredentials: true}
      )
    );
  }
}

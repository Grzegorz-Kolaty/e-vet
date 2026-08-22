import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

import {
  Appointment,
  AppointmentDraft,
  BookAppointmentPayload,
  PetUpcomingAppointment
} from '../interfaces/appointments.interface';
import {ITreatment} from '../interfaces/animals.interface';

type AppointmentResponse = Omit<Appointment, 'dateTimeFrom' | 'dateTimeTo'> & {
  dateTimeFrom: string;
  dateTimeTo: string;
};

type PetUpcomingAppointmentResponse = Omit<
  PetUpcomingAppointment,
  'dateTimeFrom' | 'dateTimeTo'
> & {
  dateTimeFrom: string;
  dateTimeTo: string;
};

type CompleteAppointmentPayload = Pick<
  ITreatment,
  | 'type'
  | 'date'
  | 'diagnosis'
  | 'description'
  | 'recommendation'
  | 'prescription'
  | 'attachments'
>;

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly http = inject(HttpClient);

  private mapAppointment(appointment: AppointmentResponse): Appointment {
    return {
      ...appointment,
      dateTimeFrom: new Date(appointment.dateTimeFrom),
      dateTimeTo: new Date(appointment.dateTimeTo),
    };
  }

  private mapPetUpcomingAppointment(
    appointment: PetUpcomingAppointmentResponse,
  ): PetUpcomingAppointment {
    return {
      ...appointment,
      dateTimeFrom: new Date(appointment.dateTimeFrom),
      dateTimeTo: new Date(appointment.dateTimeTo),
    };
  }

  private mapAppointments(appointments: AppointmentResponse[]): Appointment[] {
    return appointments.map((appointment) => this.mapAppointment(appointment));
  }

  async createAppointment(appointment: AppointmentDraft): Promise<Appointment> {
    const response = await firstValueFrom(
      this.http.post<AppointmentResponse>(
        '/appointments',
        {
          dateTimeFrom: appointment.dateTimeFrom.toISOString(),
          dateTimeTo: appointment.dateTimeTo.toISOString(),
        },
      ),
    );

    return this.mapAppointment(response);
  }

  async deleteAppointment(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`/appointments/${id}`),
    );
  }

  async getAppointmentsForVet(range: { start: Date; end: Date }): Promise<Appointment[]> {
    const startOfDay = new Date(range.start);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(range.end);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await firstValueFrom(
      this.http.get<AppointmentResponse[]>('/appointments/vet', {
        params: {
          start: startOfDay.toISOString(),
          end: endOfDay.toISOString(),
        },
      }),
    );

    return this.mapAppointments(appointments);
  }

  async getAppointmentsForVetGroupedByDay(
    vetId: string,
    clinicId: string,
  ): Promise<Record<string, Appointment[]>> {
    const appointments = await firstValueFrom(
      this.http.get<AppointmentResponse[]>('/appointments/available', {
        params: {
          vetId,
          clinicId,
        },
      }),
    );

    return this.mapAppointments(appointments).reduce(
      (groups, appointment) => {
        const dayStart = new Date(appointment.dateTimeFrom);
        dayStart.setHours(0, 0, 0, 0);

        const dateKey = dayStart.getTime().toString();

        groups[dateKey] ??= [];
        groups[dateKey].push(appointment);

        return groups;
      },
      {} as Record<string, Appointment[]>,
    );
  }

  async bookAppointment(
    appointmentId: string,
    payload: BookAppointmentPayload,
  ): Promise<PetUpcomingAppointment> {
    const response = await firstValueFrom(
      this.http.put<PetUpcomingAppointmentResponse>(
        `/appointments/${appointmentId}/book`,
        payload,
      ),
    );

    return this.mapPetUpcomingAppointment(response);
  }

  async getMyAppointments(): Promise<Appointment[]> {
    const appointments = await firstValueFrom(
      this.http.get<AppointmentResponse[]>('/appointments'),
    );

    return this.mapAppointments(appointments);
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const appointment = await firstValueFrom(
        this.http.get<AppointmentResponse>(`/appointments/${id}`),
      );

      return this.mapAppointment(appointment);
    } catch {
      return null;
    }
  }

  async markAsRealised(id: string): Promise<void> {
    await firstValueFrom(
      this.http.patch<void>(
        `/appointments/${id}/realise`,
        {},
      ),
    );
  }

  async completeAppointmentAndAddTreatment(
    appointmentId: string,
    treatmentData: CompleteAppointmentPayload,
  ): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `/appointments/${appointmentId}/complete`,
        {
          ...treatmentData,
          date:
            treatmentData.date instanceof Date
              ? treatmentData.date.toISOString()
              : treatmentData.date,
        },
      ),
    );
  }
}

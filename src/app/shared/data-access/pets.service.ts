import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

import {
  IAttachment,
  INewPetData,
  IPet,
  ITreatment,
} from '../interfaces/animals.interface';
import {Appointment} from '../interfaces/appointments.interface';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async getPets(): Promise<IPet[]> {
    return firstValueFrom(
      this.http.get<IPet[]>(
        `${this.apiUrl}/pets`,
        {
          withCredentials: true,
        },
      ),
    );
  }

  async getPetTreatmentsHistory(
    petId: string,
    range: { start: Date; end: Date } | null,
  ): Promise<ITreatment[]> {
    if (!range) {
      return [];
    }

    const treatments = await firstValueFrom(
      this.http.get<TreatmentResponse[]>(
        `${this.apiUrl}/pets/${petId}/treatments`,
        {
          params: {
            start: range.start.toISOString(),
            end: range.end.toISOString(),
          },
          withCredentials: true,
        },
      ),
    );

    return treatments.map((treatment) => this.mapTreatmentResponse(treatment));
  }

  async getPetUpcomingAppointments(petId: string): Promise<Appointment[]> {
    const appointments = await firstValueFrom(
      this.http.get<AppointmentResponse[]>(
        `${this.apiUrl}/pets/${petId}/appointments/upcoming`,
        {
          withCredentials: true,
        },
      ),
    );

    return appointments.map((appointment) => ({
      ...appointment,
      dateTimeFrom: appointment.dateTimeFrom
        ? new Date(appointment.dateTimeFrom)
        : null,
      dateTimeTo: appointment.dateTimeTo
        ? new Date(appointment.dateTimeTo)
        : null,
    })) as Appointment[];
  }

  async createPet(dto: INewPetData): Promise<string> {
    const pet = await firstValueFrom(
      this.http.post<IPet>('/pets', dto),
    );

    if (!pet.id) {
      throw new Error('Backend did not return pet id');
    }

    return pet.id;
  }

  async updatePet(id: string, dto: INewPetData): Promise<string> {
    const pet = await firstValueFrom(
      this.http.put<IPet>(
        `${this.apiUrl}/pets/${id}`,
        dto,
        {
          withCredentials: true,
        },
      ),
    );

    if (!pet.id) {
      throw new Error('Backend did not return pet id');
    }

    return pet.id;
  }

  async uploadAttachment(
    petId: string,
    file: File,
  ): Promise<{ name: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return firstValueFrom(
      this.http.post<{ name: string; url: string }>(
        `${this.apiUrl}/pets/${petId}/attachments`,
        formData,
        {
          withCredentials: true,
        },
      ),
    );
  }

  async createTreatment(dto: Omit<ITreatment, 'id'>): Promise<string> {
    const treatment = await firstValueFrom(
      this.http.post<ITreatment>(
        `${this.apiUrl}/treatments`,
        this.serializeTreatment(dto),
        {
          withCredentials: true,
        },
      ),
    );

    if (!treatment.id) {
      throw new Error('Backend did not return treatment id');
    }

    return treatment.id;
  }

  async updateTreatment(
    id: string,
    dto: Omit<ITreatment, 'id'>,
  ): Promise<string> {
    const treatment = await firstValueFrom(
      this.http.put<ITreatment>(
        `${this.apiUrl}/treatments/${id}`,
        this.serializeTreatment(dto),
        {
          withCredentials: true,
        },
      ),
    );

    if (!treatment.id) {
      throw new Error('Backend did not return treatment id');
    }

    return treatment.id;
  }

  async addTreatmentDocument(
    petId: string,
    treatmentId: string,
    file: File,
  ): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('petId', petId);

    await firstValueFrom(
      this.http.post<void>(
        `${this.apiUrl}/treatments/${treatmentId}/attachments`,
        formData,
        {
          withCredentials: true,
        },
      ),
    );
  }

  async deleteTreatmentDocument(
    treatmentId: string,
    attachment: IAttachment,
  ): Promise<void> {
    await firstValueFrom(
      this.http.request<void>(
        'DELETE',
        `${this.apiUrl}/treatments/${treatmentId}/attachments`,
        {
          body: attachment,
          withCredentials: true,
        },
      ),
    );
  }

  getFileUrl(url?: string): string {
    if (!url) return '';

    if (url.startsWith('http')) {
      return url;
    }

    return `${this.apiUrl}${url}`;
  }

  private mapTreatmentResponse(treatment: TreatmentResponse): ITreatment {
    return {
      ...treatment,
      date: treatment.date ? new Date(treatment.date) : null,
    } as ITreatment;
  }

  private serializeTreatment(dto: Omit<ITreatment, 'id'>): unknown {
    return {
      ...dto,
      date: dto.date instanceof Date ? dto.date.toISOString() : dto.date,
    };
  }
}

type TreatmentResponse = Omit<ITreatment, 'date'> & {
  date: string | null;
};

type AppointmentResponse = Omit<Appointment, 'dateTimeFrom' | 'dateTimeTo'> & {
  dateTimeFrom: string | null;
  dateTimeTo: string | null;
};

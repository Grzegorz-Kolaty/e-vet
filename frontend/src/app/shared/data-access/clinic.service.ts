import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Clinic} from '../interfaces/clinics.interface';
import {UserInterface} from '../interfaces/user.interface';

type ClinicCreatePayload = Omit<
  Clinic,
  'id' | 'ownerId' | 'vetIds' | 'createdAt'
>;

@Injectable({
  providedIn: 'root',
})
export default class ClinicService {
  private readonly http = inject(HttpClient);

  /**
   * Potrzebne tylko do budowania URL-i obrazków, np. /uploads/...
   * Interceptor działa dla HttpClienta, ale nie dla <img src>.
   */
  private readonly apiUrl = environment.apiUrl;

  async getMyClinic(): Promise<Clinic | null> {
    try {
      return await firstValueFrom(
        this.http.get<Clinic>('/clinics/my'),
      );
    } catch (error) {
      console.error('[ClinicService] getMyClinic failed', error);
      return null;
    }
  }

  async createClinic(dto: ClinicCreatePayload): Promise<string> {
    const searchCity = this.getSearchCity(dto.address);

    const payload = {
      ...dto,
      address: {
        ...dto.address,
        searchCity,
      },
    };

    const clinic = await firstValueFrom(
      this.http.post<Clinic>('/clinics', payload),
    );

    if (!clinic.id) {
      throw new Error('Backend did not return clinic id');
    }

    return clinic.id;
  }

  async getClinicsByCity(city: string): Promise<Clinic[]> {
    return firstValueFrom(
      this.http.get<Clinic[]>('/clinics', {
        params: {
          city,
        },
      }),
    );
  }

  async getAvailableCities(): Promise<string[]> {
    return firstValueFrom(
      this.http.get<string[]>('/clinics/cities'),
    );
  }

  async updateCover(file: File): Promise<Clinic> {
    const formData = new FormData();
    formData.append('file', file);

    return firstValueFrom(
      this.http.post<Clinic>(
        '/clinics/my/cover',
        formData,
      ),
    );
  }

  async getClinicByClinicId(clinicId: string): Promise<Clinic | null> {
    try {
      return await firstValueFrom(
        this.http.get<Clinic>(`/clinics/${clinicId}`),
      );
    } catch (error) {
      console.error('[ClinicService] getClinicByClinicId failed', error);
      return null;
    }
  }

  async getVeterinariesAssignedToClinic(clinicId: string): Promise<UserInterface[]> {
    try {
      return await firstValueFrom(
        this.http.get<UserInterface[]>(`/clinics/${clinicId}/vets`),
      );
    } catch (error) {
      console.error(
        '[ClinicService] getVeterinariesAssignedToClinic failed',
        error,
      );

      return [];
    }
  }

  getImageUrl(url?: string): string {
    if (!url) return '';

    if (url.startsWith('http')) {
      return url;
    }

    return `${this.apiUrl}${url}`;
  }

  private getSearchCity(address: Clinic['address']): string | undefined {
    return (
      address.city ||
      address.town ||
      address.village
    )?.trim();
  }
}

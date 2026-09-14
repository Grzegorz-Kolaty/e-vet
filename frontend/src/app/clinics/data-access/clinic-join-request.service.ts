import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ClinicJoinRequest} from '../models/clinic-join-request.model';

export interface CreateClinicJoinRequestPayload {
  message?: string;
}

@Injectable({providedIn: 'root'})
export class ClinicJoinRequestService {
  private readonly http = inject(HttpClient);

  create(clinicId: string, payload: CreateClinicJoinRequestPayload): Promise<ClinicJoinRequest> {
    return firstValueFrom(
      this.http.post<ClinicJoinRequest>(`/clinics/${clinicId}/join-requests`, payload),
    );
  }

  getMine(): Promise<ClinicJoinRequest[]> {
    return firstValueFrom(
      this.http.get<ClinicJoinRequest[]>('/clinic-join-requests/me'),
    );
  }

  getById(requestId: string): Promise<ClinicJoinRequest> {
    return firstValueFrom(
      this.http.get<ClinicJoinRequest>(`/clinic-join-requests/${requestId}`),
    );
  }

  cancel(requestId: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`/clinic-join-requests/${requestId}`),
    );
  }

  // Endpointy ownera można dopiąć, gdy backend będzie gotowy.
}

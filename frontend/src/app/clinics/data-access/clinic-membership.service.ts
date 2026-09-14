import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ClinicMembership} from '../models/clinic-membership.model';

@Injectable({providedIn: 'root'})
export class ClinicMembershipService {
  private readonly http = inject(HttpClient);

  getMine(): Promise<ClinicMembership[]> {
    return firstValueFrom(
      this.http.get<ClinicMembership[]>('/clinic-memberships/me'),
    );
  }

  getMembers(clinicId: string): Promise<ClinicMembership[]> {
    return firstValueFrom(
      this.http.get<ClinicMembership[]>(`/clinics/${clinicId}/memberships`),
    );
  }

  // Mutacje ról/usuwanie członków pozostają do podpięcia po migracji backendu.
}

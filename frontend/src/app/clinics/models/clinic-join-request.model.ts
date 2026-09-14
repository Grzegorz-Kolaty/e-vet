export type ClinicJoinRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface ClinicJoinRequest {
  id: string;
  clinicId: string;
  vetId: string;
  message?: string;
  status: ClinicJoinRequestStatus;
  createdAt: Date;
  resolvedAt?: Date;
}

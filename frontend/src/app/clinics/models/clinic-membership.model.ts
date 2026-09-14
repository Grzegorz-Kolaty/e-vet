export type ClinicMembershipRole = 'OWNER' | 'MANAGER' | 'VET' | 'RECEPTIONIST';
export type ClinicMembershipStatus = 'ACTIVE' | 'SUSPENDED';

export interface ClinicMembership {
  id: string;
  clinicId: string;
  userId: string;
  role: ClinicMembershipRole;
  status: ClinicMembershipStatus;
  createdAt: Date;
}

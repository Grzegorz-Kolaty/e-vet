import {Timestamp} from 'firebase/firestore';

export interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Timestamp;
  clinicId?: string;
  email_verified: boolean;
  photoUrl?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
  role: Role
}

export interface UploadContext {
  file: File;
  profile: UserProfile;
}

/**
 * @param email - Hello brother, it is login form credential
 * @param password - Hello brother, it is login form credential
 *
 */
export interface Credentials {
  email: string;
  password: string;
}

export enum Role {
  User = 'user',
  Vet = 'vet',
}

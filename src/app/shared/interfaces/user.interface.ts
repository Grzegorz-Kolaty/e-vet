export enum Role {
  User = 'user',
  Vet = 'vet',
  Admin = 'admin',
}

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  is_email_verified: boolean;
  clinic_id?: string;
  created_at: Date;
  updated_at: Date;
  photo_url?: string;
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


export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: Role
}

export interface UploadContext {
  file: File;
  profile: UserInterface;
}


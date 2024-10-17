export interface Credentials {
  email: string;
  password: string;
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

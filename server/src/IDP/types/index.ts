import { DecodedIdToken } from "firebase-admin/auth";
export interface IClaims {
  cs?: string[];
  admin?: string[];
}

export interface IdpUser {
  id: string;
  email: string;
  claims?: IClaims;
  isEnabled: boolean;
  emailVerified: boolean;
  role?: string | null;
  creationTime: string;
  displayName?: string;
  phone?: string;
}

export interface ICreateUserRequest {
  email: string;
  password: string;
  phone: string;
  emailVerified?: boolean;
  role?: string | null;
}

export interface IUpdateUserRequest {
  email?: string | null;
  password?: string | null;
  claims?: IClaims | null;
  isEnabled?: boolean;
}

export interface IIdentityProviderService {
  createUser(request: ICreateUserRequest): Promise<IdpUser>;
  getUserById(id: string): Promise<IdpUser | null>;
  getUserByEmail(email: string): Promise<IdpUser | null>;
  updateUser(id: string, request: IUpdateUserRequest): Promise<void>;
  verify(token: string): Promise<IdpUser>;
  generatePasswordResetLink(email: string): Promise<string>;
  generateEmailVerificationLink(email: string): Promise<string>;
}

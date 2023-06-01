import { Injectable } from "@nestjs/common";
import * as firebase from "firebase-admin";
import { auth } from "firebase-admin";
import { UserRecord, DecodedIdToken } from "firebase-admin/auth";
import { ICreateUserRequest, IdpUser, IUpdateUserRequest } from "../types";

@Injectable()
export class FirebaseService {
  private readonly authInstance: auth.Auth;
  private readonly actionCodeSettings: any = { url: process.env.CONTINUE_URL };
  constructor() {
    if (!firebase.apps.length) {
      const defaultApp = firebase.initializeApp();
      this.authInstance = auth(defaultApp);
    }
  }

  // Convert UserRecord to IdpUser
  convertUserRecordToUser(userRecord: UserRecord) {
    return {
      id: userRecord.uid,
      email: userRecord.email ?? "",
      isEnabled: !userRecord.disabled,
      claims: userRecord.customClaims ? userRecord.customClaims : {},
    };
  }

  // Get User By id
  async getUserById(id: string): Promise<IdpUser | null> {
    try {
      const userRecord = await this.authInstance.getUser(id);
      if (userRecord == null) {
        return null;
      }
      return this.convertUserRecordToUser(userRecord) as IdpUser;
    } catch (error) {
      throw error;
    }
  }

  // Get User By Email
  async getUserByEmail(email: string): Promise<IdpUser | null> {
    try {
      const userRecord = await this.authInstance.getUserByEmail(email);
      return this.convertUserRecordToUser(userRecord) as IdpUser;
    } catch (err) {
      return null;
    }
  }

  // To Verify JWT Token returns decode payload
  async verify(token: string): Promise<IdpUser> {
    try {
      if (!token) return null;
      const decodedToken = await this.authInstance.verifyIdToken(token);
      const newUserRecord = await this.authInstance.getUser(decodedToken.uid);
      console.log("newUserRecord: " + JSON.stringify(newUserRecord));
      return {
        id: newUserRecord.uid,
        email: newUserRecord.email,
        displayName: newUserRecord.displayName,
        role: newUserRecord.customClaims.role,
        emailVerified: newUserRecord.emailVerified,
        isEnabled: !newUserRecord.disabled,
        creationTime: newUserRecord.metadata.creationTime,
        phone: newUserRecord.phoneNumber,
      };
    } catch (error) {
      throw error;
    }
  }

  // To Create User with provided data return back created userRecord
  async createUser(data: ICreateUserRequest): Promise<IdpUser> {
    try {
      const userRecord = await this.authInstance.createUser(data);

      await this.authInstance.setCustomUserClaims(userRecord.uid, {
        role: data.role,
      });

      const newUserRecord = await this.authInstance.getUser(userRecord.uid);

      return {
        id: newUserRecord.uid,
        email: newUserRecord.email,
        displayName: newUserRecord.displayName,
        role: newUserRecord.customClaims.role,
        emailVerified: newUserRecord.emailVerified,
        isEnabled: !newUserRecord.disabled,
        creationTime: newUserRecord.metadata.creationTime,
      };
    } catch (error) {
      throw error;
    }
  }

  // to generate Password Reset Link
  async generatePasswordResetLink(email: string): Promise<string | null> {
    try {
      const userRecord = await this.authInstance.getUserByEmail(email);

      if (!userRecord) throw new Error("User Not Found");

      const url = await this.authInstance.generatePasswordResetLink(
        userRecord.email,
      );
      return url;
    } catch (error) {
      throw error;
    }
  }

  // To generate Email Verification Link
  async generateEmailVerificationLink(email: string): Promise<string | null> {
    try {
      const userRecord = await this.authInstance.getUserByEmail(email);

      if (!userRecord) throw new Error("User Not Found");

      const url = await this.authInstance.generateEmailVerificationLink(
        userRecord.email,
      );
      return url;
    } catch (error) {
      throw error;
    }
  }

  // Update User with required fields
  async updateUser(id: string, request: IUpdateUserRequest): Promise<void> {
    try {
      const disabled =
        request.isEnabled != null ? !request.isEnabled : undefined;
      await this.authInstance.updateUser(id, {
        email: request.email ?? undefined,
        password: request.password ?? undefined,
        disabled,
      });
      if (request.claims != null) {
        await this.authInstance.setCustomUserClaims(id, request.claims);
      }
    } catch (error) {
      throw error;
    }
  }
}

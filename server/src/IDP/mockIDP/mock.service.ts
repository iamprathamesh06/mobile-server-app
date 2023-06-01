import { Injectable } from "@nestjs/common";

@Injectable()
export class MockService {
  constructor() {
    // Credentials
  }
  // Convert UserRecord to IdpUser
  convertUserRecordToUser() {}

  // Get User By id
  async getUserById() {}

  // Get User By Email
  async getUserByEmail() {}

  // To Verify JWT Token returns decoded payload
  async verify() {}

  // To Create User with provided data return back created userRecord
  async createUser() {}

  // to generate Password Reset Link
  async generatePasswordResetLink() {}

  // To generate Email Verification Link
  async generateEmailVerificationLink() {}

  // Update User with required fields
  async updateUser() {}
}

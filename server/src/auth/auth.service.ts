import { Inject, Injectable } from '@nestjs/common';
import constants from 'src/idp/constants';
import {
  IdpUser,
  IIdentityProviderService,
  IUpdateUserRequest,
} from 'src/idp/types';
import { CreateUserInput } from './dto/input/createUser.input';
import { ResponseDTO } from './dto/response.dto';
import { UserService } from 'src/user/user.service';
import { Roles } from './roles.enum';
import { MailService } from 'src/mail/mail.service';
import { RegisterResponseDTO } from './dto/response/register.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject(constants.IDENTITY_PROVIDER_SERVICE)
    private IDPService: IIdentityProviderService,
    private userService: UserService,
    private mailService: MailService,
  ) {}
  async register(args: CreateUserInput): Promise<RegisterResponseDTO | string> {
    try {
      const user = await this.userService.getUserByEmail(args.email);

      if (user) {
        throw new Error('User Already register! Plz Login');
      }

      const data = {
        ...args,
        role: Roles.Customer,
        displayName: args.name,
        emailVerified: false,
        phoneNumber: args.phone,
        createdDate: new Date(Date.now()),
      };
      const idpUser = await this.IDPService.createUser(data);
      const { password, ...rest } = args;
      const dbUser = {
        ...rest,
        role: idpUser.role,
        idpProvider: 'Firebase',
        idpId: idpUser.id,
        creationTime: idpUser.creationTime,
      };
      await this.userService.createUser(dbUser);

      await this.mailService.sendMail({
        data: {
          to: idpUser.email,
          subject: 'Welcome to Chakii - Fresh Floor Ordering System',
        },
        templateName: 'registrationConfirmation',
        variables: {
          username: idpUser.displayName,
          companyName: 'Chakii',
        },
      });
      return {
        name: idpUser.displayName,
        creationTime: idpUser.creationTime,
        email: idpUser.email,
        emailVerified: idpUser.emailVerified,
        id: idpUser.id,
        isEnabled: idpUser.isEnabled,
        role: idpUser.role,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(
    email: string,
    username: string,
  ): Promise<ResponseDTO | null> {
    try {
      const verificationLink =
        await this.IDPService.generateEmailVerificationLink(email);
      if (!verificationLink) {
        console.log('in block');
        throw new Error(
          'Unable to Generate Link at this moment! try again latter',
        );
      }
      // Logic to send mail through mail module
      await this.mailService.sendMail({
        templateName: 'verifyEmail',
        variables: {
          username: username,
          verificationLink: verificationLink,
          companyName: 'Chakki',
        },
        data: {
          to: email,
          subject: 'Verify your email at Chakki',
        },
      });
      const result: ResponseDTO = { msg: 'Mail Sent Successfully' };
      return result;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<ResponseDTO | null> {
    try {
      const passwordResetLink = await this.IDPService.generatePasswordResetLink(
        email,
      );
      // Logic to send mail through mail module
      if (!passwordResetLink) {
        throw new Error(
          'Unable to Generate Link at this moment! try again latter',
        );
      }
      //mail the link
      await this.mailService.sendMail({
        templateName: 'resetPassword',
        variables: {
          passwordResetLink: passwordResetLink,
          companyName: 'Chakki',
        },
        data: {
          to: email,
          subject: 'Reset your password at Chakki',
        },
      });

      const result: ResponseDTO = { msg: 'Reset Link Sent Successfully' };

      return result;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(
    email: string,
    request: IUpdateUserRequest,
  ): Promise<ResponseDTO | null> {
    try {
      const user = await this.IDPService.getUserByEmail(email);
      await this.IDPService.updateUser(user.id, request);
      const result: ResponseDTO = { msg: 'Password Updated SuccessFully' };
      return result;
    } catch (error) {
      throw error;
    }
  }
}

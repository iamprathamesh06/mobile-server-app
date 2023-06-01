import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

class emailPayload {
  templateName: string;
  data: {
    to: string;
    subject: string;
  };

  variables: {};
}

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(payload: emailPayload) {
    await this.mailerService.sendMail({
      to: payload.data.to,
      subject: payload.data.subject,
      template: payload.templateName,
      from: 'spm.unofficial@gmail.com',
      context: {
        variables: payload.variables,
      },
    });
  }
}

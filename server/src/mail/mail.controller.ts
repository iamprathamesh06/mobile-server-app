import { Body, Controller, Post, Query } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller("mail")
export class MailController {
  constructor(private mailService: MailService) {}

  @Post("send")
  async sendEmail(@Body() payload) {
    return await this.mailService.sendMail({
      templateName: "verifyEmail",
      variables: {
        username: "Prathamesh",
        verificationLink: "https://www.google.com",
        companyName: "Chakki",
      },
      data: {
        to: payload.email,
        subject: payload.subject,
      },
    });
  }
}

import { Controller, Post, Body, Inject, Get } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller("stripe")
export class PaymentController {
  constructor(
    @Inject(PaymentService)
    private readonly PaymentService: PaymentService,
  ) {}

  @Get("")
  async sendHello() {
    return "Hello World";
  }

  @Post("payment-intent")
  async createPaymentIntent(@Body("orderData") orderData: any) {
    const clientSecret = await this.PaymentService.createPaymentIntent(
      orderData,
    );
    return { clientSecret };
  }

  @Post("verify-payment")
  async verifyPayment(@Body("id") id: string) {
    const data = await this.PaymentService.verifyPaymentIntent(id);
    return data;
  }
}

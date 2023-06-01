import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductService } from 'src/product/product.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private STRIPE_API_KEY: string;

  constructor(
    private productService: ProductService,
    private ordersService: OrdersService, // private mailService: MailService,
  ) {
    this.STRIPE_API_KEY = process.env.STRIPE_API_KEY || '';
    this.stripe = new Stripe(this.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPaymentIntent(orderData: any) {
    let totalAmount = 0;

    for (const product of orderData.productData) {
      const productDetails = await this.productService.getProduct(
        product.product_id,
      );
      totalAmount += productDetails.price * product.quantity;
    }

    let amount = totalAmount * 100;
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'INR',
      metadata: { orderData: JSON.stringify(orderData) },
    });

    return paymentIntent;
  }

  async verifyPaymentIntent(id: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
    console.log(paymentIntent);
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      //Add Order in the DB

      let orderData = JSON.parse(paymentIntent.metadata.orderData);
      console.log(orderData);

      let order = {
        user_id: orderData.user_id,
        address: orderData.address,
        contact_info: orderData.email,
        product_details: orderData.productData,
        amount: paymentIntent.amount_received / 100,
        order_status: ['Created'],
        createdAt: paymentIntent.created,
        payment_status: [paymentIntent.status],
        transaction_id: paymentIntent.id,
      };

      let orderStatus = await this.ordersService.createOrder(order);

      // await this.mailService.sendMail({
      //   templateName: 'confirmOrder',
      //   variables: {
      //     passwordResetLink: orderData,
      //     companyName: 'Chakki',
      //   },
      //   data: {
      //     to: orderData.email,
      //     subject: 'Reset your password at Chakki',
      //   },
      // });

      return orderStatus;
      // Handle successful payment here
    } else {
      return 'failed';
      // Handle unsuccessful, processing, or canceled payments and API errors here
    }
  }
}

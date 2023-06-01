import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderInput } from "./dto/create-order.input";
import { UpdateOrderBody, UpdateOrderInput } from "./dto/update-order.input";
import dbconstants from "../database/constants";
import { DBService } from "src/database/types";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersService {
  private collection;
  constructor(
    @Inject(dbconstants.DATABASE_PROVIDER_SERVICE) private DBService: DBService,
  ) {
    this.collection = "orders";
  }

  async createOrder(order: any) {
    //Add Create Order Logic and Which Store will going to get the order for fast delievery logic based on location
    return await this.DBService.insertOne(order, this.collection);
  }

  async getOrder(_id: string) {
    return await this.DBService.getById(_id, this.collection);
  }

  async getUserOrders(user_id: string) {
    return await this.DBService.getByAtrribute(
      "user_id",
      user_id,
      this.collection,
    );
  }

  async getOrders() {
    return await this.DBService.getAllDocs(this.collection);
  }

  async updateOrder(_id: string, updateOrderBody: UpdateOrderBody) {
    return await this.DBService.updateById(
      _id,
      UpdateOrderBody,
      this.collection,
    );
  }

  async deleteOrder(_id: string) {
    const res = await this.DBService.deleteOne(_id, this.collection);
    if (res) return "Order deleted successfully";
  }
}

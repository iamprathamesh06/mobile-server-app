import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { OrdersService } from "./orders.service";
import { Order } from "./entities/order.entity";
import { CreateOrderInput } from "./dto/create-order.input";
import { UpdateOrderInput } from "./dto/update-order.input";

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(@Args("createOrderInput") createOrderInput: CreateOrderInput) {
    return this.ordersService.createOrder(createOrderInput);
  }

  @Query(() => [Order], { name: "getOrders" })
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Query(() => [Order], { name: "getUserOrders" })
  getUserOrders(@Args("user_id") user_id: string) {
    return this.ordersService.getUserOrders(user_id);
  }
  @Query(() => Order)
  getOrder(@Args("_id") _id: string) {
    return this.ordersService.getOrder(_id);
  }
  @Mutation(() => Order)
  updateOrder(@Args("updateOrderInput") updateOrderInput: UpdateOrderInput) {
    return this.ordersService.updateOrder(
      updateOrderInput._id,
      updateOrderInput.body,
    );
  }

  @Mutation(() => String)
  deleteOrder(@Args("_id") _id: string) {
    return this.ordersService.deleteOrder(_id);
  }
}

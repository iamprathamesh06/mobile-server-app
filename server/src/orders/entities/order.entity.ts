import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Order {
  @Field()
  _id: string;

  @Field()
  user_id: string;

  @Field()
  amount: number;

  @Field()
  address: string;

  @Field({ nullable: true })
  latitude: string;

  @Field({ nullable: true })
  longitude: string;

  @Field()
  transaction_id: string;

  @Field(() => [String])
  order_status: [string];

  @Field(() => [String])
  payment_status: [string];

  @Field()
  createdAt: string;

  @Field()
  contact_info: string;

  @Field(() => [ProductDetails])
  product_details: Array<ProductDetails>;
}

@ObjectType()
class ProductDetails {
  @Field()
  product_id: string;
  @Field(() => Number)
  quantity: number;
}

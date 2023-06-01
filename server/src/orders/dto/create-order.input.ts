import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateOrderInput {
  @Field()
  user_id: string;

  @Field()
  address: string;

  @Field()
  latitude?: string;

  @Field()
  longitude?: string;

  @Field()
  contact_info: string;

  @Field(() => [ProductDetailsInput])
  product_details: [ProductDetailsInput];
}

@InputType()
class ProductDetailsInput {
  @Field()
  product_id: string;
  @Field()
  quantity: number;
}

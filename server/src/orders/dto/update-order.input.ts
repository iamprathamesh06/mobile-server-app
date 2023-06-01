import { CreateOrderInput } from "./create-order.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
class ProductDetailsUpdate {
  @Field()
  product_id?: string;
  @Field()
  quantity?: number;
}

@InputType()
export class UpdateOrderBody {
  @Field({ nullable: true })
  user_id?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  latitude?: string;

  @Field({ nullable: true })
  longitude?: string;

  @Field({ nullable: true })
  contact_info?: string;

  @Field(() => [ProductDetailsUpdate], { nullable: true })
  product_details?: [ProductDetailsUpdate];
}

@InputType()
export class UpdateOrderInput {
  @Field()
  _id: string;
  @Field()
  body: UpdateOrderBody;
}

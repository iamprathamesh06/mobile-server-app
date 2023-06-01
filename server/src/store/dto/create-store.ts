import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateStoreInput {
  @Field()
  address: string;
  @Field()
  latitude: string;
  @Field()
  longitude: string;
  @Field(() => [Inventory])
  Inventory: [Inventory];
}

@InputType()
export class Inventory {
  @Field()
  grain_id: string;
  @Field()
  quantity: number;
}

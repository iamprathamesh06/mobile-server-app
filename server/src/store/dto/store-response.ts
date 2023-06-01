import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StoreResponse {
  @Field()
  _id: string;

  @Field()
  address: string;

  @Field()
  latitude: string;

  @Field()
  longitude: string;

  @Field(() => [InventoryResponse])
  Inventory: [InventoryResponse];
}

@ObjectType()
export class InventoryResponse {
  @Field()
  grain_id: string;
  @Field()
  quantity: number;
}

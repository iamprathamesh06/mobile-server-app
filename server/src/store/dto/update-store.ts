import { Field, InputType } from "@nestjs/graphql";
import { CreateStoreInput, Inventory } from "./create-store";

@InputType()
class UpdateStoreInputBody {
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  latitude: string;
  @Field({ nullable: true })
  longitude: string;
  @Field(() => [Inventory], { nullable: true })
  Inventory: [Inventory];
}

@InputType()
export class UpdateStoreInput {
  @Field()
  _id: string;

  @Field()
  body: UpdateStoreInputBody;
}

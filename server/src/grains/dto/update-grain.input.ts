import { CreateGrainInput } from "./create-grain.input";
import { InputType, Field, Int, PartialType, ID } from "@nestjs/graphql";

@InputType()
export class UpdateGrainInput extends PartialType(CreateGrainInput) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  nutrition?: string;

  @Field({ nullable: true })
  imgUrl?: string;
}

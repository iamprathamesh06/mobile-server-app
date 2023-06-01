import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateGrainInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  type: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  nutrition: string;

  @Field({ nullable: true })
  imgUrl: string;
}

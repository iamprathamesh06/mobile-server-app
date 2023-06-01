import { ObjectType, Field, Int, ID } from "@nestjs/graphql";

@ObjectType()
export class Grain {
  @Field(() => ID, { description: "Example field (placeholder)" })
  _id: string;

  @Field(() => String, { description: "Example field (placeholder)" })
  name: string;

  @Field(() => String, { description: "Example field (placeholder)" })
  description: string;

  @Field(() => String, {
    description: "Example field (placeholder)",
    nullable: true,
  })
  type: string;

  @Field(() => Int, { description: "Example field (placeholder)" })
  price: number;

  @Field(() => String, { description: "Example field (placeholder)" })
  nutrition: string;

  @Field({ nullable: true })
  imgUrl: string;
}

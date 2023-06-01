import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ProductOption {
  @Field({ nullable: true })
  limit: number;
  @Field(() => [String], { nullable: true })
  nutrients: [string];
  @Field(() => [String], { nullable: true })
  grains: [string];
}

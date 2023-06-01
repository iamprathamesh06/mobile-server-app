import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field()
  imgUrl: string;

  @Field(() => [IngredientInput])
  ingredients: Array<IngredientInput>;
}

@InputType()
export class UpdateProductInput {
  @Field()
  _id: string;

  @Field()
  body: CreateProductInput;
}

@InputType()
export class UpdateInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  imgUrl: string;

  @Field(() => [IngredientInput], { nullable: true })
  ingredients: Array<IngredientInput>;
}

@InputType()
export class IngredientInput {
  @Field()
  grain_id: string;
  @Field()
  proportion: number;
}

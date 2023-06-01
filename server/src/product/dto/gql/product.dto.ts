import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Ingredient {
  @Field()
  grain_id: string;
  @Field()
  proportion: string;
}

@ObjectType()
export class Product {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => [Ingredient])
  ingredients: Array<Ingredient>;

  @Field({ nullable: true })
  imgUrl: string;
}

// {
//   "_id":"df4g6d4gfdjdhfiuye80wyr",
//   "name":"Fresh Wheat Flour",
//   "description":"lorem ipsum dolor sit amet, consectetur adipiscing",
//   "price":"34", //in Rs.Price
//   "imgUrl:"www.google.com/img/imfskl/fdsf",
//   "ingredients":[{
//     "grain_id":"grains/4343432",
//     "proportion":"0.3",
//   },
//   {
//     "grain_id":"grains/4343432",
//     "proportion":"0.3",
//   }]
// }

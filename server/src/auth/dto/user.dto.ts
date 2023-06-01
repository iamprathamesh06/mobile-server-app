import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserDto {
  @Field({ nullable: true })
  name: string;

  @Field()
  email: string;

  @Field()
  id: string;

  @Field()
  emailVerified: boolean;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  role: string;

  @Field()
  user_dbid: string;
}

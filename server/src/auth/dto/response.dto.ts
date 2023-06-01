import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ResponseDTO {
  @Field({ nullable: true })
  msg: string;
}

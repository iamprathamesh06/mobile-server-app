import { Field, ObjectType } from "@nestjs/graphql";
// import { type } from 'os';
// import { IClaims } from 'src/idp/types';

@ObjectType()
class IClaims {
  @Field((type) => [String], { nullable: true })
  cs: [string];

  @Field((type) => [String], { nullable: true })
  admin: [string];
}

@ObjectType()
export class RegisterResponseDTO {
  @Field()
  name: string;

  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  creationTime: string;

  @Field()
  emailVerified: boolean;

  @Field({ nullable: true })
  isEnabled: boolean;
}

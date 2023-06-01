import { Field, Int, ObjectType } from "@nestjs/graphql";
import { first, Timestamp } from "rxjs";

@ObjectType()
export class User {
    @Field()
    userId: string;
    
    @Field()
    userName: string;

    @Field()
    email: string;

    @Field(() => Int)
    age: number;

    @Field({ nullable: true })
    userAddress: string;

    @Field()
    phoneNumber: number;

    @Field()
    userLocation: string;

    @Field()
    idp: string;

    @Field()
    idp_Id: string;

    @Field({ nullable: true })
    timestamp: Date;





    @Field({ nullable: true })
    isSubscribed?: boolean;
}
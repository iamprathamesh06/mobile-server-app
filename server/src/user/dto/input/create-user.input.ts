import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";

@InputType()
export class CreateUserInput {

    @Field()
    @IsNotEmpty()
    userName: string;

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    age: number;

    @Field()
    userAddress: string;

    @Field()
    @IsPhoneNumber()
    phoneNumber: number;

    @Field()
    userLocation: string;

    @Field()
    idp: string;

    @Field()
    idp_Id: string;

    @Field()
    timestamp: Date




}
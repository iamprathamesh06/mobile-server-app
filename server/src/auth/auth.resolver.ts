import { Args, Resolver, Mutation, Query, Context } from "@nestjs/graphql";
import { Inject, UseGuards } from "@nestjs/common";
import { CreateUserInput } from "./dto/input/createUser.input";
import { RegisterResponseDTO } from "./dto/response/register.dto";
import { GqlAuthGuard } from "./gql-auth.guard";
import { UserDto } from "./dto/user.dto";
import { AuthService } from "./auth.service";
import { ResponseDTO } from "./dto/response.dto";
import { RoleGuard } from "./role.guard";
import { Roles } from "./roles.enum";

@Resolver("auth")
export class AuthResolver {
  constructor(private AuthService: AuthService) {}

  //Mutatation for Registration of new user
  @Mutation(() => RegisterResponseDTO)
  register(@Args("createUser") data: CreateUserInput) {
    console.log("Request Coming");
    console.log(data);
    try {
      return this.AuthService.register(data);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => ResponseDTO)
  @UseGuards(GqlAuthGuard)
  verify(@Context() ctx: any) {
    return this.AuthService.verifyEmail(
      ctx.req.user.email,
      ctx.req.user.displayName,
    );
  }

  @Mutation(() => ResponseDTO)
  forgotPassword(@Args("email") email: string) {
    return this.AuthService.forgotPassword(email);
  }

  @Mutation(() => ResponseDTO)
  @UseGuards(GqlAuthGuard)
  resetPassword(@Context() ctx: any, @Args("password") password: string) {
    return this.AuthService.resetPassword(ctx.req.user.email, {
      password: password,
    });
  }

  @Query(() => UserDto)

  @UseGuards(GqlAuthGuard)
  me(@Context() ctx: any) {
    console.log("user from context ", ctx.req.user);
    return ctx.req.user;
  }
}

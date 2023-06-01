import {
  Injectable,
  ExecutionContext,
  CanActivate,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import constants from "src/idp/constants";
import { IIdentityProviderService } from "src/idp/types";
import { UserService } from "src/user/user.service";
//   import { AuthService } from "./auth.service";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    @Inject(constants.IDENTITY_PROVIDER_SERVICE)
    private IDPService: IIdentityProviderService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    let token = "";
    const XClientType = ctx.req.headers.xclienttype;
    if (XClientType == "mobile") {
      //checks that request coming from any mobile app
      // console.log("from mobile");
      // console.log(ctx.req.headers);
      token = ctx.req.headers.authorization;
    } else {
      console.log("From web ");
      // console.log(ctx.req.headers);
      // token = ctx.req.headers.authorization;
      token = ctx.req.cookies["token"]; //check that request coming from any web browser
    }
    // console.log(token);
    if (!token) {
      throw new HttpException("Not Authenticated", HttpStatus.UNAUTHORIZED);
    }
    const user = await this.IDPService.verify(token);
    let user_dbid = (await this.userService.getUserByEmail(user.email))._id;
    console.log(user_dbid);
    let updatedUser = {
      name: user.displayName,
      email: user.email,
      id: user.id,
      emailVerified: user.emailVerified,
      phone: user.phone,
      role: user.role,
      user_dbid,
    };
    if (!user) {
      throw new HttpException("Not Authenticated", HttpStatus.UNAUTHORIZED);
    } else {
      ctx.req.user = updatedUser;
      return true;
    }
  }
}

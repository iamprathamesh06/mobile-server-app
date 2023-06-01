import { Module } from "@nestjs/common";
import constants from "src/idp/constants";
import { IDPModule } from "src/idp/idp.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { GqlAuthGuard } from "./gql-auth.guard";
import { AuthController } from "./auth.controller";
import { DatabaseModule } from "src/database/database.module";
import dbConstants from "src/database/constants";
import { UserModule } from "src/user/user.module";
import { MailModule } from "src/mail/mail.module";
@Module({
  imports: [
    IDPModule.forRoot(constants.IDENTITY_PROVIDER_FIREBASE),
    UserModule,
    MailModule,
  ],
  providers: [AuthResolver, GqlAuthGuard, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

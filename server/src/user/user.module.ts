import { Module } from "@nestjs/common";
import constants from "src/database/constants";
import { DatabaseModule } from "src/database/database.module";
import { UserService } from "./user.service";

@Module({
  imports: [DatabaseModule.forRoot(constants.DATABASE_PROVIDER_ARANGO)],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

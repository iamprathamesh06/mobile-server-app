import { Module } from "@nestjs/common";
import { GrainsService } from "./grains.service";
import { GrainsResolver } from "./grains.resolver";
import { DatabaseModule } from "src/database/database.module";
import dbConst from "src/database/constants";
import { IDPModule } from "src/idp/idp.module";
import constants from "src/idp/constants";

@Module({
  imports: [
    IDPModule.forRoot(constants.IDENTITY_PROVIDER_FIREBASE),
    DatabaseModule.forRoot(dbConst.DATABASE_PROVIDER_ARANGO),
  ],
  providers: [GrainsResolver, GrainsService],
})
export class GrainsModule {}

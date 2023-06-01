import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersResolver } from "./orders.resolver";
import { DatabaseModule } from "src/database/database.module";
import constants from "src/database/constants";

@Module({
  imports: [DatabaseModule.forRoot(constants.DATABASE_PROVIDER_ARANGO)],
  providers: [OrdersResolver, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

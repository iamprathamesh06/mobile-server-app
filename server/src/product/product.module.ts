import { Module } from "@nestjs/common";
import constants from "src/database/constants";
import { DatabaseModule } from "src/database/database.module";
import { ProductService } from "./product.service";
import { ProductResolver } from "./product.resolver";

@Module({
  imports: [DatabaseModule.forRoot(constants.DATABASE_PROVIDER_ARANGO)],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}

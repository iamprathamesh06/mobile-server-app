import { DynamicModule, Module } from "@nestjs/common";
import { getDatabaseProvider } from ".";

@Module({
  providers: [],
  exports: [],
})
export class DatabaseModule {
  static forRoot(provider: string): DynamicModule {
    const services = getDatabaseProvider(provider);
    return {
      module: DatabaseModule,
      providers: services,
      exports: services,
    };
  }
}

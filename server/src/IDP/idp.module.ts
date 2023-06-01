import { Module, DynamicModule } from "@nestjs/common";
import { getIdentityProvider } from ".";
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class IDPModule {
  static forRoot(provider: string): DynamicModule {
    const services = getIdentityProvider(provider);
    return {
      module: IDPModule,
      providers: services,
      exports: services,
    };
  }
}

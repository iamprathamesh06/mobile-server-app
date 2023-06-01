import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/gql-auth.guard";
import { RoleGuard } from "src/auth/role.guard";
import { Roles } from "src/auth/roles.enum";
import { CreateStoreInput } from "./dto/create-store";
import { StoreResponse } from "./dto/store-response";
import { UpdateStoreInput } from "./dto/update-store";
import { StoreService } from "./store.service";

@Resolver()
export class StoreResolver {
  constructor(private storeService: StoreService) {}
  @Mutation(() => StoreResponse)
  createStore(@Args("createStoreInput") CreateStoreInput: CreateStoreInput) {
    console.log(CreateStoreInput);
    return this.storeService.createStore(CreateStoreInput);
  }

  @Mutation(() => StoreResponse)
  updateStore(@Args("updateStoreInput") UpdateStoreInput: UpdateStoreInput) {
    return this.storeService.updateStore(UpdateStoreInput);
  }

  @Mutation(() => String)
  deleteStore(@Args("_id") _id: string) {
    return this.storeService.deleteStore(_id);
  }

  @Query(() => [StoreResponse])
  @UseGuards(GqlAuthGuard, new RoleGuard([Roles.Customer, Roles.Admin]))
  getAllStores() {
    return this.storeService.getAllStores();
  }

  @Query(() => StoreResponse)
  getStore(@Args("_id") _id: string) {
    return this.storeService.getStore(_id);
  }
}

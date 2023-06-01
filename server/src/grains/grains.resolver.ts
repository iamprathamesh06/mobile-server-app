import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { GrainsService } from "./grains.service";
import { Grain } from "./entities/grain.entity";
import { CreateGrainInput } from "./dto/create-grain.input";
import { UpdateGrainInput } from "./dto/update-grain.input";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/gql-auth.guard";
import { RoleGuard } from "src/auth/role.guard";
import { Roles } from "src/auth/roles.enum";

@Resolver(() => Grain)
export class GrainsResolver {
  constructor(private readonly grainsService: GrainsService) {}

  @Mutation(() => Grain)
  // @UseGuards(GqlAuthGuard, new RoleGuard([Roles.Admin]))
  createGrain(@Args("createGrainInput") createGrainInput: CreateGrainInput) {
    return this.grainsService.create(createGrainInput);
  }

  @Query(() => [Grain], { name: "grains" })
  findAll() {
    return this.grainsService.findAll();
  }

  @Query(() => Grain, { name: "grain" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.grainsService.findOne(id);
  }

  @Mutation(() => Grain)
  // @UseGuards(GqlAuthGuard, new RoleGuard([Roles.Admin]))
  updateGrain(@Args("updateGrainInput") updateGrainInput: UpdateGrainInput) {
    return this.grainsService.update(updateGrainInput.id, updateGrainInput);
  }

  @Mutation(() => Grain)
  // @UseGuards(GqlAuthGuard, new RoleGuard([Roles.Admin]))
  removeGrain(@Args("id", { type: () => String }) id: string) {
    return this.grainsService.remove(id);
  }
}

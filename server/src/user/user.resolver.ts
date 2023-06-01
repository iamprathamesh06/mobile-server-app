import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { GetUserArgs } from "./dto/args/get-user.args";
import { GetUsersArgs } from "./dto/args/get-users.args";
import { CreateUserInput } from "./dto/input/create-user.input";
import { DeleteUserInput } from "./dto/input/delete-user.input";
import { UpdateUserInput } from "./dto/input/update-user.input";

import { User } from "./models/user";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  // @Query(() => User, { name: 'user', nullable: true })
  // async getUser(@Args('id') getUserArgs: string): Promise<any> {
  //     return this.usersService.getUserById(getUserArgs);
  // }

  // @Query(() => [User], { name: 'users', nullable: 'items' })
  // async getUsers(): Promise<any> {
  //     return this.usersService.getUsers();
  // }

  // @Mutation(() => User)
  // async createUser(@Args('createUserData') createUserData: CreateUserInput): Promise<User> {
  //     return this.usersService.createUser(createUserData);
  // }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserData') updateUserData: UpdateUserInput): User {
  //     return this.usersService.updateUser(updateUserData);
  // }

  // @Mutation(() => User)
  // deleteUser(@Args('deleteUserData') deleteUserData: DeleteUserInput): User {
  //     return this.usersService.deleteUser(deleteUserData);
  // }
}

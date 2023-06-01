import { Inject, Injectable } from "@nestjs/common";
import { DBService } from "src/database/types";
import dbconstants from "../database/constants";
import { User } from "./dto/user.dto";

@Injectable()
export class UserService {
  private collection;
  constructor(
    @Inject(dbconstants.DATABASE_PROVIDER_SERVICE) private DBService: DBService,
  ) {
    this.collection = "users";
  }

  async getUsers(): Promise<User[]> {
    const users = await this.DBService.getAllDocs(this.collection);
    return users;
  }

  async getUserById(_id: string): Promise<User> {
    const user = await this.DBService.getById(_id, this.collection);
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.DBService.getByAtrribute(
      "email",
      email,
      this.collection,
    );
    return user[0];
  }

  async getUsersByAtrribute(
    attribute: string,
    attributeValue: any,
  ): Promise<User[]> {
    const user = await this.DBService.getByAtrribute(
      attribute,
      attributeValue,
      this.collection,
    );
    return user;
  }

  async updateUserById(_id: string, body: any): Promise<User> {
    const user = await this.DBService.updateById(_id, body, this.collection);
    return user;
  }

  async createUser(body: any): Promise<User> {
    return await this.DBService.insertOne(body, this.collection);
  }

  async deleteByEmail(email: string): Promise<any> {
    const user: User = await this.getUserByEmail(email);
    const { _id } = user;
    return await this.deleteUserById(_id);
  }

  async deleteUserById(_id: string): Promise<any> {
    return await this.DBService.deleteOne(_id, this.collection);
  }

  async count(): Promise<any> {
    return await this.DBService.count(this.collection);
  }
}

import { Injectable, Inject } from "@nestjs/common";
import dbconstants from "../database/constants";
import { DBService } from "src/database/types";
import { CreateStoreInput } from "./dto/create-store";
import { UpdateStoreInput } from "./dto/update-store";

@Injectable()
export class StoreService {
  private collection;
  constructor(
    @Inject(dbconstants.DATABASE_PROVIDER_SERVICE) private DBService: DBService,
  ) {
    this.collection = "stores";
  }
  async createStore(createStoreInput: CreateStoreInput) {
    console.log("from service", createStoreInput);
    return this.DBService.insertOne(createStoreInput, this.collection);
  }

  async updateStore(updateStoreInput: UpdateStoreInput) {
    return this.DBService.updateById(
      updateStoreInput._id,
      updateStoreInput.body,
      this.collection,
    );
  }

  async deleteStore(_id: string) {
    const res = await this.DBService.deleteOne(_id, this.collection);
    if (res) return "Store deleted successfully";
  }

  async getAllStores() {
    return this.DBService.getAllDocs(this.collection);
  }

  async getStore(_id: string) {
    return this.DBService.getById(_id, this.collection);
  }
}

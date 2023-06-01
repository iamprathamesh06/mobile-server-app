import { Injectable } from "@nestjs/common";
import { Database, aql } from "arangojs";

@Injectable()
export class MockDBService {
  private readonly db: Database;

  constructor() {
    //initialize db instance
  }

  async getCollections() {}

  async getAll(opts: any, collection): Promise<any> {}

  async getByKey(_key: string, collection): Promise<any> {}

  async getByKeys(_key: string[], collection): Promise<any> {}

  async getByBindVars(bindVars: object, collection): Promise<any> {}

  async updateBykey(_key: string, body: any, collection): Promise<any> {}

  async insertOne(body: any, collection): Promise<any> {}

  async deleteOne(_key: string, collection): Promise<any> {}

  async deleteByKeys(_keys: string[], collection): Promise<any> {}

  async count(collection): Promise<any> {}
}

import { Injectable } from "@nestjs/common";
import { Database, aql } from "arangojs";

@Injectable()
export class ArangoDBService {
  private readonly db: Database;

  DB_USERNAME = process.env.DB_USERNAME;
  DB_PASSWORD = process.env.DB_PASSWORD;
  DB_URL = process.env.DB_URL;
  DB_NAME = process.env.DB_NAME;

  constructor() {
    this.db = new Database({
      url: this.DB_URL,
      databaseName: this.DB_NAME,
    });
    this.db.useBasicAuth(this.DB_USERNAME, this.DB_PASSWORD);
  }

  async getCollections() {
    const collections = await this.db.listCollections();
    return collections;
  }

  async getAllDocs(collection: string): Promise<any[]> {
    const query = `FOR doc IN ${collection} RETURN doc`;
    try {
      const cursor = await this.db.query(query);
      const result = cursor.all();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // async getByKey(_key: string, collection): Promise<any> {
  //   let query = `FOR doc IN ${collection} FILTER doc._key == @id RETURN doc`;
  //   let bindVars = { id: _key };
  //   try {
  //     const cursor = await this.db.query(query, bindVars);
  //     const doc = await cursor.next();
  //     return doc;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getById(_id: string, collection: string): Promise<any> {
    const query = `FOR doc IN ${collection} FILTER doc._id == @id RETURN doc`;
    const bindVars = { id: _id };
    try {
      const cursor = await this.db.query(query, bindVars);
      const doc = await cursor.next();
      return doc;
    } catch (error) {
      throw error;
    }
  }

  // async getByKeys(_id: string[], collection): Promise<any> {
  //   let query = `FOR doc IN ${collection} FILTER doc._id IN ${_id} RETURN doc`;

  //   try {
  //     const cursor = await this.db.query(query);
  //     const docs = cursor.all();
  //     return docs;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getByEmail(email: string, collection): Promise<any> {
  //   const query = `FOR user IN ${collection} FILTER user.email == "${email}" RETURN user`;
  //   try {
  //     const cursor = await this.db.query(query);
  //     const result = await cursor.all();
  //     return result[0];
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getByAtrribute(
    attribute: string,
    attributeValue: any,
    collection: string,
  ): Promise<any> {
    const query = `FOR user IN ${collection} FILTER user.${attribute} == "${attributeValue}" RETURN user`;
    try {
      const cursor = await this.db.query(query);
      const result = cursor.all();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // async getByBindVars(bindVars: object, collection): Promise<any> {
  //   return await this.db.collection(collection).firstExample(bindVars);
  // }

  // async updateBykey(_key: string, body: any, collection): Promise<any> {
  //   return await this.db
  //     .collection(collection)
  //     .update(_key, body, { returnNew: true });
  // }

  async updateById(_id: string, body: any, collection: string): Promise<any> {
    const query = `
        FOR doc IN @@collection
          FILTER doc._id == @id
          UPDATE doc WITH @data IN @@collection
          RETURN NEW
      `;
    // let bindVars = { id: _id, newValues: body };
    const bindVars = {
      "@collection": collection,
      id: _id,
      data: body,
    };
    try {
      const cursor = await this.db.query(query, bindVars);
      const updatedDoc = await cursor.next();
      return updatedDoc;
    } catch (error) {
      throw error;
    }
  }

  async insertOne(body: any, collection): Promise<any> {
    const query = `INSERT @newDoc INTO ${collection} RETURN NEW`;
    const bindVars = { newDoc: body };
    try {
      const cursor = await this.db.query(query, bindVars);
      const doc = await cursor.next();
      return doc;
    } catch (error) {
      throw error;
    }
  }

  // async insertList(list: any[]): Promise<any[]> { }
  async deleteOne(_id: string, collection): Promise<any> {
    try {
      const result = await this.db.collection(collection).remove(_id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // async deleteByKeys(_keys: string[], collection): Promise<any> {
  //   let query = `FOR key IN @keys REMOVE key IN ${collection} OPTIONS { ignoreErrors: true }`;
  //   let bindVars = { keys: _keys };
  //   try {
  //     await this.db.query(query, bindVars);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async count(collection): Promise<any> {
    const { count } = await this.db.collection(collection).count();
    return { count };
  }
}

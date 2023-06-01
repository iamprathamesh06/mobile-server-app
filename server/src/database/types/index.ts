export interface DBService {
  getCollections(): any;
  getAllDocs(collection: string): Promise<any[]>;
  getById(_id: string, collection: string): Promise<any>;
  getByAtrribute(
    attribute: string,
    attributeValue: any,
    collection: string,
  ): Promise<any>;
  updateById(_id: string, body: any, collection): Promise<any>;
  insertOne(body: any, collection: string): Promise<any>;
  deleteOne(_id: string, collection: string): Promise<any>;
  count(collection: string): Promise<any>;
}

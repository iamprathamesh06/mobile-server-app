import { Injectable, Inject } from "@nestjs/common";
import dbconstants from "../database/constants";
import { DBService } from "src/database/types";
import { Product } from "./dto/product.dto";
import { ProductOption } from "./dto/productOption.dto";

@Injectable()
export class ProductService {
  private collection;
  constructor(
    @Inject(dbconstants.DATABASE_PROVIDER_SERVICE) private DBService: DBService,
  ) {
    this.collection = "products";
  }

  async createProduct(body: Product): Promise<Product> {
    return this.DBService.insertOne(body, this.collection);
  }

  async getAllProducts(options: ProductOption): Promise<Product[]> {
    let products: Product[] = await this.DBService.getAllDocs(this.collection);
    if (
      !options?.limit &&
      !options?.nutrients?.length &&
      !options?.grains?.length
    ) {
      return products;
    }
    if (options?.grains && options.grains.length > 0) {
      products = products.filter((product) =>
        product.ingredients.some((ingredient) =>
          options.grains?.includes(ingredient.grain_id),
        ),
      );
    }
    console.log(products);
    if (options.limit) {
      return products.slice(0, options.limit);
    }
    return products;
  }

  async updateProduct(_id: string, body: Product): Promise<Product> {
    return await this.DBService.updateById(_id, body, this.collection);
  }

  async getProduct(_id: string): Promise<Product> {
    return await this.DBService.getById(_id, this.collection);
  }

  async deleteProduct(_id: string): Promise<string> {
    const res = await this.DBService.deleteOne(_id, this.collection);
    if (res) return "Product deleted successfully";
  }
}

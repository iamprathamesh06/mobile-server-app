import { Inject, Injectable } from "@nestjs/common";
import { CreateGrainInput } from "./dto/create-grain.input";
import { UpdateGrainInput } from "./dto/update-grain.input";
import dbconstants from "../database/constants";
import { DBService } from "src/database/types";
import { Grain } from "./entities/grain.entity";
@Injectable()
export class GrainsService {
  private collection;
  constructor(
    @Inject(dbconstants.DATABASE_PROVIDER_SERVICE) private DBService: DBService,
  ) {
    this.collection = "grains";
  }
  async create(createGrainInput: CreateGrainInput): Promise<Grain> {
    return await this.DBService.insertOne(createGrainInput, this.collection);
  }

  async findAll(): Promise<Grain[]> {
    const grains = await this.DBService.getAllDocs(this.collection);
    console.log(grains);
    return grains;
  }

  async findOne(id: string) {
    const grain = await this.DBService.getById(id, this.collection);
    return grain;
  }

  async update(id: string, updateGrainInput: UpdateGrainInput): Promise<Grain> {
    const user = await this.DBService.updateById(
      id,
      updateGrainInput,
      this.collection,
    );
    return user;
  }

  async remove(id: string) {
    return await this.DBService.deleteOne(id, this.collection);
  }
}

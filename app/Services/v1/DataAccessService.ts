import LucidAddon from "Config/query"
import Database from "@ioc:Adonis/Lucid/Database";
import { BaseModel, ModelObject } from "@ioc:Adonis/Lucid/Orm";
import SearchRequest from "Config/types/SearchRequest";

export default class DataAccessService<T extends typeof BaseModel> {

  public lucid;

  constructor(model: T) {
    this.lucid = new LucidAddon(Database, model)
  }

  public async create(record: Record<string, any>): Promise<ModelObject> {
    return this.lucid.create(record)
  }

  public async update(record: Record<string, any>): Promise<ModelObject> {
    return this.lucid.update(record)
  }

  public async delete(id: string): Promise<void> {
    return this.lucid.delete(id)
  }

  public async find(query?: SearchRequest): Promise< { data: ModelObject | null }> {
    return this.lucid.find(query)
  }

  public async findOrFail(id: string): Promise<{ data: ModelObject }> {
    return this.lucid.findOrFail(id);
  }

  public async findByOrFail(key: string, value: string): Promise<{ data: ModelObject }> {
    return this.lucid.findByOrFail(key, value);
  }

  public async search(query?: SearchRequest): Promise<{ meta?: any, data: ModelObject[] }> {
    return this.lucid.search(query)
  }

}
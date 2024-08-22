import { FilterQuery } from 'mongoose';

export interface GenericInterfaceRepoistory<T> {
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findOneAndUpdate(id: number): Promise<T>;
  find(input: FilterQuery<T>): Promise<T[]>;
  create(input: FilterQuery<T>): Promise<T>;
}

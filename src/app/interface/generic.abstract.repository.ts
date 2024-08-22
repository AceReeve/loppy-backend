import { FilterQuery, UpdateQuery } from 'mongoose';

export abstract class GenericAbstractRepository<T> {
  abstract findOne(input: FilterQuery<T>): Promise<T | null>;
  abstract findOneAndUpdate(
    input: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T | null>;
  abstract find(input: FilterQuery<T>): Promise<T[]>;
  abstract create(input: any): Promise<T | null>;
}

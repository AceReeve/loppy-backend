import { ObjectId, ObjectIdSchemaDefinition } from 'mongoose';

export interface GenericMessageResponse {
  [key: string]: object | string;
}

export interface ValidationResponse {
  code?: number;
  errors?: { [x: string]: string[] }[];
  message?: string;
}

export interface GenericResponse {
  response: {
    status_code: number;
    message: GenericMessageResponse | string;
    error: string;
  };
  timestamp: string;
  path: string;
}

export declare interface UpdateResult {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: any;
}

export interface Meta {
  total: number;
  limit: number;
  page: number;
  pages: number;
  total_pending?: number;
  total_approved?: number;
}

export interface PaginateResponse<T> {
  data: T[];
  meta: Meta;
}

import { QueryParams } from "../types/QueryParams";

export interface IDao<
    T,
    CreateInput = Partial<T>,
    UpdateInput = Partial<T>
> {
    findMany(params?: QueryParams<T>): Promise<T[]>;
    findOne(id: string): Promise<T | null>;
    findFirst(params?: QueryParams<T>): Promise<T | null>;

    create(data: CreateInput): Promise<T>;
    createMany(data: CreateInput[]): Promise<T[]>;

    update(id: string, data: UpdateInput): Promise<T>;
    updateMany(filter: QueryParams<T>, data: UpdateInput): Promise<T[]>;

    delete(id: string): Promise<T>;
    deleteMany(filter: QueryParams<T>): Promise<T[]>;

    softDelete(id: string): Promise<T>;
    softDeleteMany(filter: QueryParams<T>): Promise<T[]>;

    exists(filter: QueryParams<T>): Promise<boolean>;
    count(filter: QueryParams<T>): Promise<number>;
}
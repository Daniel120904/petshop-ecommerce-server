import { db, executeQuery } from "..";
import { OrderBy, PopulateRelationConfig, QueryParams } from "../types/QueryParams";
import { IDao } from "./IDao";

export abstract class BaseDao<
    T,
    CreateInput = Partial<T>,
    UpdateInput = Partial<T>
> implements IDao<T, CreateInput, UpdateInput> {
    
    protected table: string;

    constructor(table: string) {
        this.table = table;
    }

    async findMany(params?: QueryParams<T>): Promise<T[]> {
        return executeQuery(`findMany:${this.table}`, async () => {
            let query = db(this.table).where({ isDelete: false });

            if (params?.where) {
                query = query.andWhere(params.where);
            }

            if (params?.populate) {
                const baseSelect = `${this.table}.*`;
                const populateSelects: any[] = [];

                for (const [alias, config] of Object.entries(params.populate)) {
                    const populateConfig = config as PopulateRelationConfig;

                    const selectFields = populateConfig.select 
                        ? populateConfig.select.map(field => `'${field}', t.${field}`).join(', ')
                        : `'*', row_to_json(t.*)`;

                    populateSelects.push(
                        db.raw(`
                            (
                                SELECT ${populateConfig.select ? `json_build_object(${selectFields})` : 'row_to_json(t)'}
                                FROM ${populateConfig.table} t
                                WHERE t.id = ${this.table}.${populateConfig.foreignKey}
                            ) as "${alias}"
                        `)
                    );
                }

                query = query.select(db.raw(baseSelect), ...populateSelects);
            }

            if (params?.orderBy) {
                if (Array.isArray(params.orderBy)) {
                    params.orderBy.forEach((order: OrderBy<T>) => {
                        query = query.orderBy(order.column as string, order.order || 'asc');
                    });
                } else {
                    Object.entries(params.orderBy).forEach(([column, order]) => {
                        query = query.orderBy(column, order as 'asc' | 'desc');
                    });
                }
            }

            if (params?.pagination) {
                const { page = 1, pageSize = 10 } = params.pagination;
                query = query.limit(pageSize).offset((page - 1) * pageSize);
            }

            return query;
        });
    }

    async findOne(id: string): Promise<T | null> {
        return executeQuery(`findOne:${this.table}`, async () => {
            const result = await db(this.table)
                .where({ id, isDelete: false })
                .first();

            return result || null;
        });
    }

    async findFirst(params?: QueryParams<T>): Promise<T | null> {
        return executeQuery(`findFirst:${this.table}`, async () => {
            const result = await this.findMany({
                ...params,
                pagination: { page: 1, pageSize: 1 }
            });

            return result[0] || null;
        });
    }

    async create(data: CreateInput): Promise<T> {
        return executeQuery(`create:${this.table}`, async () => {
            const [created] = await db(this.table)
                .insert(data)
                .returning("*");

            if (!created) {
                throw new Error('Falha ao criar registro');
            }

            return created;
        });
    }

    async createMany(data: CreateInput[]): Promise<T[]> {
        return executeQuery(`createMany:${this.table}`, async () => {
            const created = await db(this.table)
                .insert(data)
                .returning("*");

            if (!created || created.length === 0) {
                throw new Error('Falha ao criar registros');
            }

            return created;
        });
    }

    async update(id: string, data: UpdateInput): Promise<T> {
        return executeQuery(`update:${this.table}`, async () => {
            const [updated] = await db(this.table)
                .where({ id })
                .update(data)
                .returning("*");

            if (!updated) {
                throw new Error(`Registro com id ${id} não encontrado`);
            }

            return updated;
        });
    }

    async updateMany(params: QueryParams<T>, data: UpdateInput): Promise<T[]> {
        return executeQuery(`updateMany:${this.table}`, async () => {
            const updated = await db(this.table)
                .where(params?.where || {})
                .update(data)
                .returning("*");

            return updated;
        });
    }

    async delete(id: string): Promise<T> {
        return executeQuery(`delete:${this.table}`, async () => {
            const [deleted] = await db(this.table)
                .where({ id })
                .delete()
                .returning("*");

            if (!deleted) {
                throw new Error(`Registro com id ${id} não encontrado`);
            }

            return deleted;
        });
    }

    async deleteMany(params: QueryParams<T>): Promise<T[]> {
        return executeQuery(`deleteMany:${this.table}`, async () => {
            const deleted = await db(this.table)
                .where(params?.where || {})
                .delete()
                .returning("*");

            return deleted;
        });
    }

    async softDelete(id: string): Promise<T> {
        return executeQuery(`softDelete:${this.table}`, async () => {
            return this.update(id, {
                isDelete: true,
                deletedAt: new Date()
            } as UpdateInput);
        });
    }

    async softDeleteMany(params: QueryParams<T>): Promise<T[]> {
        return executeQuery(`softDeleteMany:${this.table}`, async () => {
            return this.updateMany(params, {
                isDelete: true,
                deletedAt: new Date()
            } as UpdateInput);
        });
    }

    async exists(params: QueryParams<T>): Promise<boolean> {
        return executeQuery(`exists:${this.table}`, async () => {
            const result = await this.findFirst(params);
            return !!result;
        });
    }

    async count(params: QueryParams<T>): Promise<number> {
        return executeQuery(`count:${this.table}`, async () => {
            let query = db(this.table).where({ isDelete: false });

            if (params?.where) {
                query = query.andWhere(params.where);
            }

            const result = await query
                .count<{ count: string }>("* as count")
                .first();

            return Number(result?.count || 0);
        });
    }
}
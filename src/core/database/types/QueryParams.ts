export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

export type OrderByValue = 'asc' | 'desc';

export interface OrderBy<T> {
    column: keyof T & string;
    order?: OrderByValue;
}

export interface PopulateRelationConfig {
    table: string;
    foreignKey: string;
    select?: string[];
}

export type PopulateConfig<T> = {
    [K in keyof T]?: PopulateRelationConfig;
};

export interface QueryParams<T> {
    where?: Partial<T>;
    populate?: PopulateConfig<T>;
    pagination?: PaginationParams;
    orderBy?: OrderBy<T>[] | OrderBy<T>;
}


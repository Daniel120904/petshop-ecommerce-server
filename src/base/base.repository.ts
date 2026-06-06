
type FindOptions<
    TInclude extends object, 
    TSelect extends object, 
    TOrderBy extends object
> =
    (
        | { include?: TInclude; select?: never }
        | { select?: TSelect;   include?: never }
    ) & {
        orderBy?: TOrderBy | TOrderBy[];
        pagination?: {
            page?: number;
            pageSize?: number;
        };
    }

export interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export abstract class BaseRepository<
    TModel,
    TCreateInput,
    TUpdateInput,
    TWhereInput extends object = object,
    TInclude extends object = object,
    TSelect extends object = object ,
    TOrderBy extends object = object
> {
    protected abstract model: any;

    protected hasDeleteFlag: boolean = false;

    protected defaultWhere: TWhereInput = {} as TWhereInput;

    private get softDeleteFilter(): Partial<TWhereInput> {
        return this.hasDeleteFlag
            ? ({ isDelete: false } as unknown as Partial<TWhereInput>)
            : {};
    }

    async findMany(
        where: TWhereInput = {} as TWhereInput,
        options: FindOptions<TInclude, TSelect, TOrderBy> = {}
    ): Promise<{ data: TModel[]; meta: PaginationMeta }> {
        const { pagination, ...restOptions } = options;

        const mergedWhere = {
            ...this.defaultWhere,
            ...this.softDeleteFilter,
            ...where
        };

        const total = await this.model.count({ where: mergedWhere });

        const page = pagination?.page ?? 1;
        const pageSize = pagination?.pageSize ?? total;

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const data = await this.model.findMany({
            where: mergedWhere,
            ...restOptions,
            skip,
            take,
        });

        return {
            data: data as TModel[],
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
                hasNext: page < Math.ceil(total / pageSize),
                hasPrev: page > 1,
            },
        };
    }

    async findFirst(
        where: TWhereInput,
        options: FindOptions<TInclude, TSelect, TOrderBy> = {}
    ): Promise<any> {
        return this.model.findFirst({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
            ...options,
        });
    }

    async findUnique(
        where: TWhereInput,
        options: FindOptions<TInclude, TSelect, TOrderBy> = {}
    ): Promise<any>  {
        return this.model.findUnique({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
            ...options,
        });
    }

    async create<TOptions extends { include?: TInclude; select?: TSelect }>(
        input: TCreateInput,
        options: TOptions = {} as TOptions
    ): Promise<any> {
        const data = await this.beforeCreate(input);

        return this.model.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            ...options,
        });
    }

    async createMany(data: TCreateInput[]) : Promise<{ count: number }> {
        this.validateBulkPayload(data, 'createMany');

        const processed = await Promise.all(data.map(item => this.beforeCreate(item)));

        return this.model.createMany({
            data: processed.map((item) => ({
                ...item,
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });
    }

    protected async beforeCreate(data: TCreateInput): Promise<TCreateInput> {
        return data; 
    }

    async update<TOptions extends { include?: TInclude; select?: TSelect }>(
        where: TWhereInput,
        data: TUpdateInput,
        options: TOptions = {} as TOptions
    ): Promise<any> {
        await this.blockIfDeleted(where);

        return this.model.update({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            ...options,
        });
    }

    async updateMany(where: TWhereInput, data: TUpdateInput) : Promise<{ count: number }> {
        this.validateBulkWhere(where, 'updateMany');
        await this.blockIfAnyDeleted(where);

        return this.model.updateMany({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async delete(where: TWhereInput) : Promise<TModel> {
        if (!this.hasDeleteFlag) {
            await this.blockIfNotFound(where);
            return this.model.delete({ where });
        }

        await this.blockIfDeleted(where);

        return this.model.update({
            where,
            data: {
                isDelete: true,
                updatedAt: new Date(),
            },
        });
    }

    async deleteMany(where: TWhereInput) : Promise<{ count: number }> {
        this.validateBulkWhere(where, 'deleteMany');

        if (!this.hasDeleteFlag) {
            const foundRecords = await this.blockIfNoneFound(where); // garante que existe algo antes de deletar

            if(!foundRecords) return { count: 0 }

            return this.model.deleteMany({ where: { ...this.defaultWhere, ...where } });
        }

        const foundRecords = await this.blockIfAnyDeleted(where);

        if(!foundRecords) return { count: 0 }

        return this.model.updateMany({
            where: { ...this.defaultWhere, ...where },
            data: {
                isDelete: true,
                updatedAt: new Date(),
            },
        });
    }

    /**
     * Bloqueia update/delete em um único registro já deletado.
     */
    private async blockIfDeleted(where: TWhereInput) {
        const record = await this.model.findFirst({ where });

        if (!record) {
            throw new Error('Registro não encontrado');
        }

        if (record.isDelete === true) {
            throw new Error('Operação não permitida: o registro já foi deletado');
        }
    }

    private async blockIfNotFound(where: TWhereInput) {
        const record = await this.model.findFirst({ where });

        if (!record) {
            throw new Error('Registro não encontrado');
        }
    }

    private async blockIfNoneFound(where: TWhereInput) {
        const count = await this.model.count({ where: { ...this.defaultWhere, ...where } });

        if (count === 0) {
            return false 
        }

        return true
    }

    /**
     * Bloqueia update/delete em massa se qualquer registro já estiver deletado.
     */
    private async blockIfAnyDeleted(where: TWhereInput) {
        const deletedCount = await this.model.count({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
        });

        if (deletedCount > 0) {
            return false 
        }

        return true
    }

    /**
     * Garante que o where de operações bulk não está vazio
     * para evitar afetar a tabela inteira acidentalmente.
     */
    private validateBulkWhere(where: TWhereInput, operation: string) {
        if (!where || Object.keys(where).length === 0) {
            throw new Error(
                `${operation} requer ao menos um filtro no 'where'. ` +
                `Operações sem filtro não são permitidas.`
            );
        }
    }

    /**
     * Garante que o array de dados para createMany não está vazio.
     */
    private validateBulkPayload(data: TCreateInput[], operation: string) {
        if (!data || data.length === 0) {
            throw new Error(`${operation} requer ao menos um item no array de dados.`);
        }
    }
}

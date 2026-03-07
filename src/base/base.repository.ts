
interface FindManyOptions {
    include?: object;
    select?: object;
    orderBy?: object | object[];
    pagination?: {
        page: number;
        pageSize: number;
    };
}

export abstract class BaseRepository<T> {
    protected abstract model: any;

    protected defaultWhere = {
        isDelete: false,
    }

    async findMany(where: object = {}, options: FindManyOptions = {}) {
        const { pagination, ...restOptions } = options;

        const paginationArgs = pagination
            ? {
                skip: (pagination.page - 1) * pagination.pageSize,
                take: pagination.pageSize,
            }
            : {};

        const [data, total] = await Promise.all([
            this.model.findMany({
                where: { ...this.defaultWhere, ...where },
                ...restOptions,
                ...paginationArgs,
            }),
            pagination
                ? this.model.count({ where: { ...this.defaultWhere, ...where } })
                : null,
        ]);

        if (!pagination) return data;

        return {
            data,
            meta: {
                total,
                page: pagination.page,
                pageSize: pagination.pageSize,
                totalPages: Math.ceil(total / pagination.pageSize),
                hasNext: pagination.page < Math.ceil(total / pagination.pageSize),
                hasPrev: pagination.page > 1,
            },
        };
    }

    async findFirst(where: object = {}, options: { include?: object; select?: object } = {}) {
        return this.model.findFirst({
            where: { ...this.defaultWhere, ...where },
            ...options,
        });
    }

    async findUnique(where: object, options: { include?: object; select?: object } = {}) {
        return this.model.findUnique({
            where: { ...this.defaultWhere, ...where },
            ...options,
        });
    }

    async create(data: object, options: { include?: object; select?: object } = {}) {
        return this.model.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            ...options,
        });
    }

    async createMany(data: object[]) {
        this.validateBulkPayload(data, 'createMany');

        return this.model.createMany({
            data: data.map((item) => ({
                ...item,
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        });
    }

    async update(where: object, data: object, options: { include?: object; select?: object } = {}) {
        await this.blockIfDeleted(where);

        return this.model.update({
            where,
            data: {
                ...data,
                updatedAt: new Date(),
            },
            ...options,
        });
    }

    async updateMany(where: object, data: object) {
        this.validateBulkWhere(where, 'updateMany');
        await this.blockIfAnyDeleted(where);

        return this.model.updateMany({
            where: { ...this.defaultWhere, ...where },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async delete(where: object) {
        await this.blockIfDeleted(where);

        return this.model.update({
            where,
            data: {
                isDelete: true,
                updatedAt: new Date(),
            },
        });
    }

    async deleteMany(where: object) {
        this.validateBulkWhere(where, 'deleteMany');
        await this.blockIfAnyDeleted(where);

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
    private async blockIfDeleted(where: object): Promise<void> {
        const record = await this.model.findFirst({ where });

        if (!record) {
            throw new Error('Registro não encontrado');
        }

        if (record.isDelete === true) {
            throw new Error('Operação não permitida: o registro já foi deletado');
        }
    }

    /**
     * Bloqueia update/delete em massa se qualquer registro já estiver deletado.
     */
    private async blockIfAnyDeleted(where: object): Promise<void> {
        const deletedCount = await this.model.count({
            where: { ...where, isDelete: true },
        });

        if (deletedCount > 0) {
            throw new Error(
                `Operação não permitida: ${deletedCount} registro(s) já deletado(s) no conjunto`
            );
        }
    }

    /**
     * Garante que o where de operações bulk não está vazio
     * para evitar afetar a tabela inteira acidentalmente.
     */
    private validateBulkWhere(where: object, operation: string): void {
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
    private validateBulkPayload(data: object[], operation: string): void {
        if (!data || data.length === 0) {
            throw new Error(`${operation} requer ao menos um item no array de dados.`);
        }
    }
}
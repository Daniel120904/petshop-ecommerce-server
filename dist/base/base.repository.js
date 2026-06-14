"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const client_1 = require("@prisma/client");
class BaseRepository {
    constructor() {
        this.hasDeleteFlag = false;
        this.defaultWhere = {};
    }
    get softDeleteFilter() {
        return this.hasDeleteFlag
            ? { isDelete: false }
            : {};
    }
    async findMany(where = {}, options = {}) {
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
            data: data,
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
    async findFirst(where, options = {}) {
        return this.model.findFirst({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
            ...options,
        });
    }
    async findUnique(where, options = {}) {
        return this.model.findUnique({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
            ...options,
        });
    }
    async create(input, options = {}) {
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
    async createMany(data) {
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
    async beforeCreate(data) {
        return data;
    }
    async update(where, data, options = {}) {
        await this.blockIfDeleted(where);
        return this.model.update({
            where: this.resolveUniqueWhere(where),
            data: {
                ...data,
                updatedAt: new Date(),
            },
            ...options,
        });
    }
    async updateMany(where, data) {
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
    async delete(where) {
        if (!this.hasDeleteFlag) {
            await this.blockIfNotFound(where);
            return this.model.delete({ where });
        }
        await this.blockIfDeleted(where);
        return this.model.update({
            where: this.resolveUniqueWhere(where),
            data: {
                isDelete: true,
                updatedAt: new Date(),
            },
        });
    }
    async deleteMany(where) {
        this.validateBulkWhere(where, 'deleteMany');
        if (!this.hasDeleteFlag) {
            const foundRecords = await this.blockIfNoneFound(where); // garante que existe algo antes de deletar
            if (!foundRecords)
                return { count: 0 };
            return this.model.deleteMany({ where: { ...this.defaultWhere, ...where } });
        }
        const foundRecords = await this.blockIfAnyDeleted(where);
        if (!foundRecords)
            return { count: 0 };
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
    async blockIfDeleted(where) {
        const record = await this.model.findFirst({ where });
        if (!record) {
            throw new Error('Registro não encontrado');
        }
        if (record.isDelete === true) {
            throw new Error('Operação não permitida: o registro já foi deletado');
        }
    }
    async blockIfNotFound(where) {
        const record = await this.model.findFirst({ where });
        if (!record) {
            throw new Error('Registro não encontrado');
        }
    }
    async blockIfNoneFound(where) {
        const count = await this.model.count({ where: { ...this.defaultWhere, ...where } });
        if (count === 0) {
            return false;
        }
        return true;
    }
    /**
     * Bloqueia update/delete em massa se qualquer registro já estiver deletado.
     */
    async blockIfAnyDeleted(where) {
        const deletedCount = await this.model.count({
            where: { ...this.defaultWhere, ...this.softDeleteFilter, ...where },
        });
        if (deletedCount > 0) {
            return false;
        }
        return true;
    }
    /**
     * Garante que o where de operações bulk não está vazio
     * para evitar afetar a tabela inteira acidentalmente.
     */
    validateBulkWhere(where, operation) {
        if (!where || Object.keys(where).length === 0) {
            throw new Error(`${operation} requer ao menos um filtro no 'where'. ` +
                `Operações sem filtro não são permitidas.`);
        }
    }
    /**
     * Garante que o array de dados para createMany não está vazio.
     */
    validateBulkPayload(data, operation) {
        if (!data || data.length === 0) {
            throw new Error(`${operation} requer ao menos um item no array de dados.`);
        }
    }
    resolveUniqueWhere(where) {
        const modelName = this.model.name; // ex: "cart_item"
        // Busca o model no DMMF
        const dmmfModel = client_1.Prisma.dmmf.datamodel.models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
        if (!dmmfModel)
            return where;
        // Busca o primeiro @@unique composto que todos os campos estão presentes no where
        const compositeUnique = dmmfModel.uniqueIndexes.find(index => index.fields.length > 1 &&
            index.fields.every(field => where[field] !== undefined));
        if (!compositeUnique)
            return where;
        // Monta a chave composta no formato que o Prisma espera
        // ex: { userId_productId: { userId: 2, productId: 26 } }
        const compositeKey = compositeUnique.fields.join('_');
        const compositeValue = Object.fromEntries(compositeUnique.fields.map(field => [field, where[field]]));
        return { [compositeKey]: compositeValue };
    }
}
exports.BaseRepository = BaseRepository;

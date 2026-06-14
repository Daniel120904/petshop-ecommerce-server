"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedRepository = void 0;
const base_repository_1 = require("../base/base.repository");
class TypedRepository extends base_repository_1.BaseRepository {
    async findMany(where = {}, options = {}) {
        return super.findMany(where, options);
    }
    async findFirst(where, options = {}) {
        return super.findFirst(where, options);
    }
    async findUnique(where, options = {}) {
        return super.findUnique(where, options);
    }
    async create(data, options = {}) {
        return super.create(data, options);
    }
    async update(where, data, options = {}) {
        return super.update(where, data, options);
    }
}
exports.TypedRepository = TypedRepository;

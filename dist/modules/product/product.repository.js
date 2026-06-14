"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_typed_repository_1 = require("../../base/base.typed-repository");
const prisma_client_1 = require("../../core/database/prisma.client");
class ProductRepository extends base_typed_repository_1.TypedRepository {
    constructor() {
        super(...arguments);
        this.model = prisma_client_1.prisma.product;
    }
}
exports.default = new ProductRepository();

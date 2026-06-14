"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_typed_repository_1 = require("../../base/base.typed-repository");
const prisma_client_1 = require("../../core/database/prisma.client");
class CardRepository extends base_typed_repository_1.TypedRepository {
    constructor() {
        super(...arguments);
        this.model = prisma_client_1.prisma.card;
    }
    async beforeCreate(data) {
        const hasCard = await this.findFirst({
            userId: data.userId,
            primary: true,
        });
        return { ...data, primary: !hasCard };
    }
}
exports.default = new CardRepository();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubCategories = validateSubCategories;
const category_repository_1 = __importDefault(require("../../modules/product/category.repository"));
const subCategory_repository_1 = __importDefault(require("../../modules/product/subCategory.repository"));
async function validateSubCategories(categoryId, subCategoryIds) {
    const category = await category_repository_1.default.findUnique({ id: categoryId });
    if (!category)
        throw new Error("Categoria não encontrada");
    const subCategories = await subCategory_repository_1.default.findMany({
        id: { in: subCategoryIds },
        categoryId
    });
    if (!subCategories.data.length)
        throw new Error('Nenhuma sub-categoria encontrada');
    const subIds = new Set(subCategories.data.map(sub => sub.id));
    const invalidIds = subCategoryIds.filter(id => !subIds.has(id));
    if (invalidIds.length)
        throw new Error(`${invalidIds}: Sub Categorias Inválidas`);
    return subCategories.data;
}

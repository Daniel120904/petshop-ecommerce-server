import categoryRepository from "../../modules/product/category.repository";
import subCategoryRepository from "../../modules/product/subCategory.repository";

export async function validateSubCategories(categoryId: number, subCategoryIds: number[]) {
    const category = await categoryRepository.findUnique({ id: categoryId });
    if (!category) throw new Error("Categoria não encontrada");

    const subCategories = await subCategoryRepository.findMany({
        id: { in: subCategoryIds },
        categoryId
    });

    if (!subCategories.data.length) throw new Error('Nenhuma sub-categoria encontrada');

    const subIds = new Set(subCategories.data.map(sub => sub.id));
    const invalidIds = subCategoryIds.filter(id => !subIds.has(id));

    if (invalidIds.length) throw new Error(`${invalidIds}: Sub Categorias Inválidas`);

    return subCategories.data;
}
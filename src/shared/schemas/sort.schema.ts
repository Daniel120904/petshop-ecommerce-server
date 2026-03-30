export type SortOrder = 'asc' | 'desc';

export function parseSortToOrderBy(
    sort: string,
    map: Record<string, string>
) {
    if (!sort) return [];

    const result: any[] = [];
    const fields = sort.split(',');

    for (const fieldSort of fields) {
        const [field, order] = fieldSort.split(':');

        const dbField = map[field];
        if (!dbField) continue;

        const direction: SortOrder = order === 'asc' ? 'asc' : 'desc';

        if (dbField.includes('.')) {
            const [relation, column] = dbField.split('.');
            result.push({
                [relation]: { [column]: direction }
            });
        } else {
            result.push({ [dbField]: direction });
        }
    }

    return result;
}

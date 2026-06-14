"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSortToOrderBy = parseSortToOrderBy;
function parseSortToOrderBy(sort, map) {
    if (!sort)
        return [];
    const result = [];
    const fields = sort.split(',');
    for (const fieldSort of fields) {
        const [field, order] = fieldSort.split(':');
        const dbField = map[field];
        if (!dbField)
            continue;
        const direction = order === 'asc' ? 'asc' : 'desc';
        if (dbField.includes('.')) {
            const [relation, column] = dbField.split('.');
            result.push({
                [relation]: { [column]: direction }
            });
        }
        else {
            result.push({ [dbField]: direction });
        }
    }
    return result;
}

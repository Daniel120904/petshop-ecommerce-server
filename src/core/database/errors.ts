// db/errors.ts
export const PG_ERROR_CODES = {
    UNIQUE_VIOLATION: '23505',      // Duplicado
    FOREIGN_KEY_VIOLATION: '23503', // FK inválida
    NOT_NULL_VIOLATION: '23502',    // Campo obrigatório
    INVALID_TEXT: '22P02',          // Formato inválido
    NUMERIC_OVERFLOW: '22003',      // Número muito grande
    DIVISION_BY_ZERO: '22012',      // Divisão por zero
    SYNTAX_ERROR: '42601',          // SQL inválido
    UNDEFINED_COLUMN: '42703',      // Coluna não existe
    UNDEFINED_TABLE: '42P01',       // Tabela não existe
} as const;

export function translateDbError(error: any): Error {
    const code = error.code;
    
    switch (code) {
        case PG_ERROR_CODES.UNIQUE_VIOLATION:
            return new Error('Este registro já existe');
        
        case PG_ERROR_CODES.FOREIGN_KEY_VIOLATION:
            return new Error('Referência inválida');
        
        case PG_ERROR_CODES.NOT_NULL_VIOLATION:
            const field = error.column || 'campo';
            return new Error(`O campo "${field}" é obrigatório`);
        
        case PG_ERROR_CODES.INVALID_TEXT:
            return new Error('Formato de dados inválido');
        
        case PG_ERROR_CODES.UNDEFINED_TABLE:
            return new Error('Tabela não encontrada');
        
        default:
            return new Error(`Erro no banco: ${error.message}`);
    }
}
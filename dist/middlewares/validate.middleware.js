"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (handler, schema) => {
    return async (req, res, next) => {
        if (!schema) {
            try {
                return await handler(req, res);
            }
            catch (err) {
                return next(err);
            }
        }
        const raw = {
            ...req.body,
            ...req.query,
            ...req.params,
        };
        const data = Object.fromEntries(Object.entries(raw).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
        const result = schema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            res.status(400).json({ message: 'Erro de validação', errors });
            return;
        }
        req.validated = result.data;
        try {
            return await handler(req, res);
        }
        catch (err) {
            return next(err);
        }
    };
};
exports.validate = validate;

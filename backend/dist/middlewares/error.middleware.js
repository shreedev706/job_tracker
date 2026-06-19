"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    // Log the error in the server console for background debugging
    console.error('❌ Error Intercepted:', err);
    // 1. Handle Missing Fields / Schema Validation Errors (Zod)
    if (err.name === 'ZodError') {
        const issues = err.issues || err.errors || [];
        return res.status(400).json({
            success: false,
            error: 'Missing or Invalid Fields',
            details: issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }
    // 2. Handle Prisma Specific Database Errors
    if (err.code) {
        switch (err.code) {
            // P2002: Unique constraint failed (Duplicate Error)
            case 'P2002': {
                const targetField = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
                return res.status(400).json({
                    success: false,
                    error: 'Duplicate Record Error',
                    message: `A record with this unique value already exists.${targetField}`
                });
            }
            // P2003: Foreign key constraint failed (Missing relational reference)
            case 'P2003':
                return res.status(400).json({
                    success: false,
                    error: 'Missing Reference Error',
                    message: 'The operation failed because a required related record is missing.'
                });
            // P2025: Record to update or delete not found
            case 'P2025':
                return res.status(404).json({
                    success: false,
                    error: 'Record Not Found',
                    message: err.meta?.cause || 'The requested record could not be found in the database.'
                });
            default:
                break;
        }
    }
    // 3. Handle simple string errors passed via next("Error message string")
    if (typeof err === 'string') {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: err
        });
    }
    // 4. Global fallback for unhandled exceptions
    return res.status(err.status || 500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred on the server.'
    });
};
exports.globalErrorHandler = globalErrorHandler;

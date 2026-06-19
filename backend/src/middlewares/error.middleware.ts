import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  
  console.error(' Error Intercepted:', err);

  
  if (err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    return res.status(400).json({
      success: false,
      error: 'Missing or Invalid Fields',
      details: issues.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }


  if (err.code) {
    switch (err.code) {
      
      case 'P2002': {
        const targetField = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
        return res.status(400).json({
          success: false,
          error: 'Duplicate Record Error',
          message: `A record with this unique value already exists.${targetField}`
        });
      }

      
      case 'P2003':
        return res.status(400).json({
          success: false,
          error: 'Missing Reference Error',
          message: 'The operation failed because a required related record is missing.'
        });

      
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


  if (typeof err === 'string') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: err
    });
  }

 
  return res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
};
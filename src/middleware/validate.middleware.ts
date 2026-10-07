import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Middleware function to validate request body against a Zod schema
export const validate = (schema: z.ZodObject<any>) => (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    // Validate the request body using the provided Zod schema
    const validation = schema.safeParse(req.body);

    // If validation fails, respond with a 400 status and the validation errors
    if (!validation.success) {
        res.status(400).json({
            message: 'Validation failed',
            errors: validation.error.issues
        });
        return; // Stop further processing if validation fails
    }

    // If validation succeeds, replace the request body with the validated data
    req.body = validation.data;

    next();
};
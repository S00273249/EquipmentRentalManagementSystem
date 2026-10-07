import { Request, Response, NextFunction } from 'express';

// Middleware function to authenticate requests based on the presence of an API key in the headers
export const authenticateKey = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    // Extract the API key from the request headers
    const apiKey = req.headers['x-api-key'];

    // If the API key is missing, respond with a 401 Unauthorized status and an error message
    if (!apiKey) {
        res.status(401).json({
            status: 'fail',
            message: 'Unauthorized: Missing api-key header'
        });

        // Stop further processing if the API key is missing
        return;
    }

    // If the API key is present, proceed to the next middleware or route handler
    next();
};
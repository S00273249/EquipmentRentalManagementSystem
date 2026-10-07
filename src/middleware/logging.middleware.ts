import { Request, Response, NextFunction } from 'express';

// Middleware function to log incoming requests
export const loggingMiddleware = (
    req: Request, // The incoming HTTP request object
    _res: Response, // The outgoing HTTP response object 
    next: NextFunction // The next middleware function in the stack
): void => {
    console.log(`${req.method} ${req.originalUrl}`); // Log the HTTP method and the original URL of the request
    next();
};
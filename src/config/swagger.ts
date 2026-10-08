import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition for the API documentation
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: { // API metadata
            title: 'Equipment Rental API',
            version: '1.0.0',
            description: 'REST API for managing equipment rentals'
        },
        servers: [
            {
                url: '/api/v1', // Base URL for the API
            },
        ],
        components: {
            securitySchemes: { // Define security schemes for API authentication
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key'
                }
            }
        },
        security: [
            {
                ApiKeyAuth: [] // Apply the security scheme to all endpoints
            }
        ],
    },
    apis: ['./src/controllers/*.ts', './src/models/*.ts'] // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
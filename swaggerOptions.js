const options = {
    info: {
        version: '1.0.0',
        title: 'Users and Tasks API',
        description: 'API for managing users and their tasks',
    },
    security: {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
        },
    },
    baseDir: __dirname,
    filesPattern: './apiRoutes.js',
    swaggerUIPath: '/api-docs',
    exposeSwaggerUI: true,
    exposeApiDocs: false,
    apiDocsPath: '/v3/api-docs',
    notRequiredAsNullable: false,
    swaggerUiOptions: {},
    tags: [
        {
            name: 'Authentication',
            description: 'Authentication endpoints'
        },
        {
            name: 'Users',
            description: 'User management endpoints'
        },
        {
            name: 'Tasks',
            description: 'Task management endpoints'
        }
    ]
};

module.exports = options;
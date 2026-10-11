const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fleet Flow API Documentation',
      version: '1.0.0',
      description: 'Documentation officielle de l\'API Fleet Flow',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur Docker local',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI disponible sur http://localhost:5000/api-docs');
};

module.exports = swaggerDocs;
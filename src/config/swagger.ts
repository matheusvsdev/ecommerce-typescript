import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API NodeJS",
      version: "1.0.0",
      description: "Documentação da API do e-commerce nodejs",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }], // Define autenticação global para os endpoints protegidos
  },
  apis: ["src/routes/*.ts"], // Captura as rotas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export { swaggerUi, swaggerDocs };

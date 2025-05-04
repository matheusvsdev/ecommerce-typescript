/*

npm install typeorm pg reflect-metadata

Caso não queira que TypeORM crie tabelas automaticamente
npm install ts-node  
npm run typeorm migration:generate -- -n InitMigration
npm run typeorm migration:run


import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres", // Ou "mysql"
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432, // Alterar para 3306 se for MySQL
  username: process.env.DB_USER || "seu_usuario",
  password: process.env.DB_PASSWORD || "sua_senha",
  database: process.env.DB_NAME || "seu_banco",
  entities: ["src/entities/*.ts"], // Define onde estão as entidades
  migrations: ["src/migrations/*.ts"], // Para migrações no banco
  synchronize: false, // Evita alterações automáticas, melhor para produção
  logging: true, // Para depuração
});
*/

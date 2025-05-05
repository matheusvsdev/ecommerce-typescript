# E-commerce API

Esta API foi desenvolvida para gerenciar um sistema de e-commerce robusto e escalável utilizando **Node.js**, **Express**, **TypeScript**, **PostgreSQL** e **Prisma**.

## Tecnologias Utilizadas
- **Node.js 22** – Back-end escalável e eficiente
- **Express** – Framework para criação da API
- **TypeScript** – Tipagem estática para maior segurança
- **PostgreSQL** – Banco de dados relacional
- **Prisma** – ORM moderno e flexível
- **JWT** – Autenticação segura
- **Joi** – Validação de dados
- **Docker** – Contêinerização para deploy eficiente
- **Swagger** – Documentação interativa

## Configuração do Projeto

### **Instalar Dependências**

```sh
npm install
```

### Configurar Banco de Dados  
Caso esteja usando Docker, inicialize os serviços com: 

```sh
docker-compose up --build
```

### Rodar Migração do Banco  
Para criar as tabelas no banco de dados, execute:  

```sh
npx prisma migrate dev --name init
```

### Iniciar a API  
Após configurar tudo, inicie a API com:  

```sh
npm start
```
ou
```sh
npm run dev
```

## Tratamento de Erros

A API possui um middleware de erro centralizado, garantindo que todas as respostas sigam um padrão. Ele lida com erros comuns como **404 (Not Found)**, **409 (Conflict)** e **422 (Unprocessable Entity)**.

```ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { HttpStatusCode } from "../utils/HttpStatusCode";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError("Rota não encontrada.", HttpStatusCode.NOT_FOUND));
};

export const conflictHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError("Conflito de dados.", HttpStatusCode.CONFLICT));
};

export const unprocessableEntityHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new AppError(
      "Dados inválidos ou mal formatados.",
      HttpStatusCode.UNPROCESSABLE_ENTITY
    )
  );
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message} - ${req.path}`);

  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : HttpStatusCode.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Erro interno no servidor.",
    timestamp: err.timestamp || new Date().toISOString(),
  });
};
```

## Autenticação  
A API utiliza JWT (JSON Web Token) para autenticação segura.

- **POST** `/auth/register` – Cria um novo usuário.  
- **POST** `/auth/login` – Autentica e retorna um token.  

## Popular o Banco de Dados (Opcional)
Se quiser preencher o banco com dados iniciais, como roles, usuários, categorias e produtos, execute o seguinte comando:

```sh
npx prisma db seed
```

## Documentação Interativa  
Acesse a documentação Swagger em:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)  

## Testes Automatizados  
Para rodar os testes, utilize o seguinte comando:  

```sh
npm test
```



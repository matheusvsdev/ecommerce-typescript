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

npm install


### Configurar Banco de Dados  
Caso esteja usando Docker, inicialize os serviços com: 

docker-compose up --build


### Rodar Migração do Banco  
Para criar as tabelas no banco de dados, execute:  

npx prisma migrate dev --name init


### Iniciar a API  
Após configurar tudo, inicie a API com:  

npm start ou npm run dev


## Autenticação  
A API utiliza JWT (JSON Web Token) para autenticação segura.

- **POST** `/auth/register` – Cria um novo usuário.  
- **POST** `/auth/login` – Autentica e retorna um token.  

## Documentação Interativa  
Acesse a documentação Swagger em:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)  

## Testes Automatizados  
Para rodar os testes, utilize o seguinte comando:  

npm test




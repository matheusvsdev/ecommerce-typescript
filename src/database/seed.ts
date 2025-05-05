import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // Criar roles
  await prisma.role.createMany({
    data: [
      { name: "ADMIN" },
      { name: "MANAGER" },
      { name: "USER" },
    ],
  });

  console.log("Seed de roles inserido com sucesso!");

  // Criar categorias
  await prisma.category.createMany({
    data: [
      { name: "Livros" },
      { name: "Eletrônicos" },
      { name: "Games" },
    ],
  });

  console.log("Seed de categorias inserido com sucesso!");

  // Buscar os IDs das categorias
  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map(cat => [cat.name, cat.id]));

  console.log("Categorias carregadas:", categoryMap);

  // Criar produtos
  await prisma.product.createMany({
    data: [
        { name: "Programação Web com Node.js", price: 39.99, categoryId: categoryMap["Livros"] },
        { name: "O Livro do Programador", price: 18.75, categoryId: categoryMap["Livros"] },
        { name: "Construindo Aplicações Web do Zero", price: 18.75, categoryId: categoryMap["Livros"] },
        { name: "Java: Guia do Programador", price: 89.90, categoryId: categoryMap["Livros"] },
        { name: "TypeScript na Prática", price: 59.90, categoryId: categoryMap["Livros"] },
        { name: "JavaScript: O Guia Definitivo", price: 129.90, categoryId: categoryMap["Livros"] },
      ],
    });

  console.log("Seed de produtos inserido com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

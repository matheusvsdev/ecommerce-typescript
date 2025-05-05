import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import roleRoutes from "./routes/roleRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import addressRoutes from "./routes/addressRoutes";
import orderRoutes from "./routes/orderRoutes";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandlers";
import { swaggerUi, swaggerDocs } from "./config/swagger";

// import { AppDataSource } from "./config/config";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Funcionando!" });
});

// Definição das rotas
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/addresses", addressRoutes);
app.use("/orders", orderRoutes);

// Documentação Swagger (antes da captura de erros)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Captura de erros
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

/*
AppDataSource.initialize()
  .then(() => console.log("Banco de dados conectado!"))
  .catch((error) => console.error("Erro ao conectar ao banco:", error));
*/

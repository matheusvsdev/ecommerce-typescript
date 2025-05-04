import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *       401:
 *         description: Não autorizado - autenticação necessária
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", getProducts);

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos na requisição
 *       401:
 *         description: Não autorizado -  autenticação necessária
 *       500:
 *         description: Erro no servidor
 */
router.post("/", authenticateToken, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produto específico pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado e retornado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       201:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos na requisição
 *       401:
 *         description: Não autorizado -  autenticação necessária
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put("/:id", authenticateToken, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Exclui um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto excluído com sucesso (sem conteúdo na resposta)
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado - autenticação necessária
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", authenticateToken, deleteProduct);

export default router;

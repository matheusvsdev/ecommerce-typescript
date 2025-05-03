import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateProductInput } from "../middlewares/productValidation";

const router = Router();

router.get("/", authenticateToken, getProducts);
router.post("/", authenticateToken, validateProductInput, createProduct);
router.put("/:id", authenticateToken, validateProductInput, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);

export default router;

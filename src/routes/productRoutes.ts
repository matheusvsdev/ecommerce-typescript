import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/requestValidation";
import { productSchema } from "../middlewares/productValidation";

const router = Router();

router.get("/", authenticateToken, getProducts);
router.post("/", authenticateToken, validateRequest(productSchema), createProduct);
router.put("/:id", authenticateToken, validateRequest(productSchema), updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);

export default router;

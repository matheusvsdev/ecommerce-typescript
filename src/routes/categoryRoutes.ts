import { Router } from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/categoryController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateData } from "../middlewares/validateData";
import { categorySchema } from "../validations/categoryValidation";

const router = Router();

router.get("/", getCategories);
router.post("/", authenticateToken, validateData(categorySchema), createCategory);

export default router;

import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateOrderInput } from "../middlewares/orderValidation";

const router = Router();

router.post("/", authenticateToken, validateOrderInput, createOrder);

export default router;

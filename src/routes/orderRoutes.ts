import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
} from "../controllers/orderController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrderById);
router.post("/", authenticateToken, createOrder);

export default router;

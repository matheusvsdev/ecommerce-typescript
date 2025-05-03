import { Router } from "express";
import { getRoles, createRole } from "../controllers/roleController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getRoles);
router.post("/", authenticateToken, createRole);

export default router;

import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateUserInput } from "../middlewares/validationMiddleware";

const router = Router();

router.get("/", authenticateToken, getUsers);
router.post("/", authenticateToken, validateUserInput, createUser);

export default router;

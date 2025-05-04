import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateData } from "../middlewares/validateData";
import { userSchema } from "../validations/userValidation";

const router = Router();

router.get("/", authenticateToken, getUsers);
router.post("/", authenticateToken, validateData(userSchema), createUser);

export default router;

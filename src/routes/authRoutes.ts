import { Router } from "express";
import { register, login } from "../controllers/authController";
import { validateData } from "../middlewares/validateData";
import { authSchema } from "../validations/authValidation";

const router = Router();

router.post("/register", validateData(authSchema), register);
router.post("/login", login);

export default router;

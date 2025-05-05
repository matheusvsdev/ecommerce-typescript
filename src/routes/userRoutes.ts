import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware";
import { validateData } from "../middlewares/validateData";
import { userSchema } from "../validations/userValidation";
import { RoleName } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles([RoleName.ADMIN, RoleName.MANAGER]),
  getUsers
);
router.post("/", authenticateToken, authorizeRoles([RoleName.ADMIN, RoleName.MANAGER]), validateData(userSchema), createUser);

export default router;

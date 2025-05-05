import { Router } from "express";
import { getRoles } from "../controllers/roleController";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware";
import { RoleName } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles([RoleName.ADMIN, RoleName.MANAGER]),
  getRoles
);

export default router;

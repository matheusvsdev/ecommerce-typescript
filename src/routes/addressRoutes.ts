import { Router } from "express";
import {
  getAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getAddress);
router.get("/:id", authenticateToken, getAddressById);
router.post("/", authenticateToken, createAddress);
router.put("/:id", authenticateToken, updateAddress);
router.delete("/:id", authenticateToken, deleteAddress);

export default router;

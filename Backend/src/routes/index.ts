import { Router } from "express";
import { register, login } from "../controllers/userController";
import schoolRoutes from "./schoolRoutes";
import majorRoutes from "./majorRoutes";

const router = Router();

// Route đăng ký
router.post("/register", register);

// Route đăng nhập
router.post("/login", login);

// Import routes liên quan đến trường, ngành, tổ hợp
router.use("/schools", schoolRoutes);

router.use("/majors", majorRoutes);

export default router;
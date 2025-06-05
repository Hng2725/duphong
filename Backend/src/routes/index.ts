import { Router } from "express";
import { register, login } from "../controllers/userController";

const router = Router();

// Route đăng ký
router.post("/register", register);

// Route đăng nhập
router.post("/login", login);

export default router;

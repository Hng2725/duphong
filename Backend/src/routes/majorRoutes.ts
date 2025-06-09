import { Router } from "express";
import { getMajors, addMajor, updateMajor, deleteMajor } from "../controllers/majorController";

const router = Router();

// Route lấy danh sách ngành
router.get("/", getMajors);

// Route thêm ngành mới
router.post("/", addMajor);

// Route cập nhật ngành
router.put("/:id", updateMajor);

// Route xóa ngành
router.delete("/:id", deleteMajor);

export default router;
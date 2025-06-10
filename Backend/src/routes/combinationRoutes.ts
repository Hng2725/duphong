import { Router } from "express";
import {
  saveCombination,
  updateCombination,
  deleteCombination,
  getCombinations,
} from "../controllers/combinationController";

const router = Router();

// Route lấy danh sách tổ hợp
router.get("/", getCombinations);

// Route thêm tổ hợp mới
router.post("/", saveCombination);

// Route sửa tổ hợp
router.put("/:id", updateCombination);

// Route xóa tổ hợp
router.delete("/:id", deleteCombination);

export default router;
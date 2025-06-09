import { Router } from "express";
import { saveSchool,} from "../controllers/schoolController";

const router = Router();

// Route lưu tổ hợp
router.post("/", saveSchool);

export default router;
import { Router } from "express";
import { saveSchool, deleteSchool, updateSchool} from "../controllers/schoolController";

const router = Router();

router.post("/", saveSchool);

router.delete("/:id", deleteSchool);

router.put("/:id", updateSchool);

export default router;
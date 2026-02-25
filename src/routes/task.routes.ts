import { Router } from "express";
import { generateTask, getTaskById } from "../controllers/task.controller";

const router = Router();

router.post("/tasks", generateTask);
router.get("/tasks/:id", getTaskById);

export default router;
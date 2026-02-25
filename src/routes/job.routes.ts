import { Router } from "express";
import { createJob, getJobStatus } from "../controllers/job.controller";

const router = Router();

router.post("/", createJob);
router.get("/:id", getJobStatus);

export default router;
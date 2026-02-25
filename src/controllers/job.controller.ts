import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Job } from "../entities/Job";
import { hashTranscript } from "../utils/hash";
import { processJob } from "../services/job.service";

export const createJob = async (req: Request, res: Response) => {
  const transcript =
    typeof req.body === "string" ? req.body : req.body?.transcript;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript required" });
  }

  const jobRepo = AppDataSource.getRepository(Job);

  const transcriptHash = hashTranscript(transcript);

  const existing = await jobRepo.findOne({
    where: { transcriptHash },
  });

  if (existing) {
    if (existing.status === "failed") {
      existing.status = "processing";
      existing.result = null;
      await jobRepo.save(existing);

      processJob(existing.id);

      return res.json({
        jobId: existing.id,
        status: "processing",
      });
    }
    return res.json({
      jobId: existing.id,
      status: existing.status,
    });
  }

  const job = jobRepo.create({
    transcript,
    transcriptHash,
    status: "processing",
  });

  await jobRepo.save(job);

  processJob(job.id);

  return res.json({
    jobId: job.id,
    status: "processing",
  });
};

export const getJobStatus = async (req: Request, res: Response) => {
  const jobRepo = AppDataSource.getRepository(Job);

  const job = await jobRepo.findOne({
    where: { id: req.params.id as string },
  });

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.json({
    jobId: job.id,
    status: job.status,
    result: job.result ?? null,
  });
};

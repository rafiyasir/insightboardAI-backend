import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Task } from "../entities/Task";
import { Job } from "../entities/Job";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Task, Job],
  synchronize: true
});
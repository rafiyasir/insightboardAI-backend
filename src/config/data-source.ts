import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Task } from "../entities/Task";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Task],
  synchronize: true
});
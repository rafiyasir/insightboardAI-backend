import express from "express";
import taskRoute from "./routes/task.routes";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.text());

  app.get("/", (req, res) => {
    res.status(200).json({ message: "insighboardAI is running" });
  });

  app.use('/api',taskRoute)

  return app;
}

import express from "express";
import cors from "cors";
import taskRoute from "./routes/task.routes";

export function createApp() {
  const app = express();

  const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.text());

  app.get("/", (req, res) => {
    res.status(200).json({ message: "insighboardAI is running" });
  });

  app.use("/api", taskRoute);

  return app;
}

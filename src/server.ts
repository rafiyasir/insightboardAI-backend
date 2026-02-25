import dotenv from "dotenv";
import { createApp } from "./app";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down gracefully...");

      server.close(async () => {
        await AppDataSource.destroy();
        console.log("Database connection closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

bootstrap();

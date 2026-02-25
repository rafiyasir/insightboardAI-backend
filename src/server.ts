import { createApp } from "./app";


async function bootstrap() {
  try {

    const app = createApp();

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

bootstrap();
import { defineConfig } from "vitest/config";
import path from "path";
import { config as dotenv } from "dotenv";

// Load root .env (default environment variables for dev consistency)
dotenv({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"], // Overwrite the env variables
  },
});

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./backend/openapi.yaml",
  output: "./packages/api-client/src/generated",
});
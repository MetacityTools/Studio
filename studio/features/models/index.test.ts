import { Readable } from "stream";
import { describe, expect, test } from "vitest";
import {
  checkFileExists,
  deleteFile,
  ensureDirectory,
  readFile,
  saveFileStream,
} from "../storage";

describe("model actions", () => {
  const model = new Readable();
  model.push("test");
  model.push(null);

  test("saveModel", async () => {
    // Save the model file
    await ensureDirectory("models");
    await saveFileStream("model", "models", model);

    // Check if the file exists
    const data = await readFile("model", "models");
    expect(data.toString()).toBe("test");
  });

  test("deleteModel", async () => {
    // Delete the model file
    await deleteFile("model", "models");

    // Check if the file exists
    const exists = await checkFileExists("model", "models");
    expect(exists).toBe(false);
  });
});

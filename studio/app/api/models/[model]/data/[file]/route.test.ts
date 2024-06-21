"use server";

import { deleteOwnModel } from "@features/models/mutations/deleteOwnModel";
import { expect } from "vitest";
import { testWithFixtures } from "../../../../../../tests/helpers";
import { GET } from "./route";

testWithFixtures("GET /models/[model]/data/[file]", async ({ model, file }) => {
  const url = new URL(
    `http://localhost:3000/models/${model.id}/data/${file.name}`,
  );

  const req = new Request(url, {
    method: "GET",
  });

  const response = await GET(req, {
    params: { model: String(model.id), file: file.name },
  });
  const body = await response.text();

  expect(response.status).toBe(200);
  expect(body).toBe("test");

  await deleteOwnModel(model.id);
});

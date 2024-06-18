"use server";

import { createModel } from "@features/models/mutations/createOwnModel";
import { deleteOwnModel } from "@features/models/mutations/deleteOwnModel";
import { expect, test } from "vitest";
import { GET } from "./route";

const file = {
  stream: () =>
    new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("test"));
        controller.close();
      },
    }),
  name: "test.txt",
} as File;

test("GET /models/[model]/data/[file]", async () => {
  const model = await createModel(
    {
      name: "TEST",
      coordinateSystem: "WGS84",
    },
    [file]
  );

  const url = new URL(
    `http://localhost:3000/models/${model.id}/data/${file.name}`
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

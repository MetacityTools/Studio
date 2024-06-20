"use server";

import { deleteOwnModel } from "@features/models/mutations/deleteOwnModel";
import { expect, test } from "vitest";
import { POST } from "./route";

test("POST /models", async () => {
  const url = new URL("http://localhost:3000/models");

  const files = [new File(["test"], "file.txt")];

  const requestBody = new FormData();
  requestBody.append("name", "model");
  requestBody.append("coordinateSystem", "WGS84");
  // for (const file of files) requestBody.append("file", file);
  // FIXME: this does not work, no idea why, spent too much time on this
  // Has something to do with File received not being a true File or something

  const req = new Request(url, {
    method: "POST",
    body: requestBody,
  });
  const response = await POST(req);
  const body = await response.json();

  expect(response.status).toBe(201);
  expect(body).toMatchObject({
    coordinateSystem: "WGS84",
    name: "model",
    user: {
      id: "test",
    },
  });

  await deleteOwnModel(body.id);
});

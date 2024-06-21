"use server";

import { deleteModel } from "@features/models/mutations/deleteModel";
import { expect } from "vitest";
import { testWithFixtures } from "../../../tests/helpers";
import { POST } from "./route";

testWithFixtures("POST /models", async ({ user }) => {
  const url = new URL("http://localhost:3000/models");

  const requestBody = new FormData();
  requestBody.append("name", "model");
  requestBody.append("coordinateSystem", "WGS84");

  // const files = [file];
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

  await deleteModel(body.id);
});

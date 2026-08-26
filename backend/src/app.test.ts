import request from "supertest";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createApp,
} from "./app.js";


describe("API Lavandería", () => {
  it("debe responder correctamente en GET /api", async () => {
    const app =
      createApp();

    const response =
      await request(app)
        .get("/api");

    expect(
      response.status,
    ).toBe(200);

    expect(
      response.body,
    ).toMatchObject({
      name: "API Lavanderia ",
      version: "0.1.0",
    });
  });
});

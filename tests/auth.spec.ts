import { test, expect } from "@playwright/test";

test("signed-out requests cannot access chat or admin resources", async ({ request }) => {
  const chatInfo = await request.get("/api/chat");
  expect(chatInfo.status()).toBe(401);
  expect(await chatInfo.json()).toMatchObject({ error: "UNAUTHENTICATED" });

  // Authentication must run before body validation or any AI calls.
  const chatMessage = await request.post("/api/chat", { data: {} });
  expect(chatMessage.status()).toBe(401);
  expect(await chatMessage.json()).toMatchObject({ error: "UNAUTHENTICATED" });

  const dashboard = await request.get("/admin/dashboard", { maxRedirects: 0 });
  expect(dashboard.status()).toBe(307);
  expect(dashboard.headers().location).toBe("/sign-in");

  const adminData = await request.get("/api/admin/dashboard");
  expect(adminData.status()).toBe(401);
  expect(await adminData.json()).toMatchObject({ error: "UNAUTHENTICATED" });
});

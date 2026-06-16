import { test as setup, expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { writeFileSync } from "fs";
import { deleteAllMessages, waitForConfirmationLink } from "./helpers/inbucket";

const AUTH_FILE = "playwright/.auth/user.json";
const SETUP_EMAIL_FILE = "playwright/.auth/setup-email.json";
const PASSWORD = "TestPassword123!";

const email = `e2e-setup-${randomUUID()}@test.com`;

setup("authenticate", async ({ page, context }) => {
  await deleteAllMessages();

  await page.goto("/sign-up");
  await page.getByRole("textbox", { name: "email" }).fill(email);
  await page.getByRole("textbox", { name: "password" }).fill(PASSWORD);
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(
    page.getByText("Your account has been created"),
  ).toBeVisible({ timeout: 10_000 });

  const confirmationLink = await waitForConfirmationLink(email);
  await page.goto(confirmationLink);

  await expect(page.getByText("Sign in to your account")).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("textbox", { name: "email" }).fill(email);
  await page.getByRole("textbox", { name: "password" }).fill(PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/organizations/);
  await context.storageState({ path: AUTH_FILE });
  writeFileSync(SETUP_EMAIL_FILE, JSON.stringify({ email }));
});

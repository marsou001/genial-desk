import { test, expect } from "@playwright/test";
import { deleteAllMessages, waitForConfirmationLink } from "../helpers/inbucket";
import { deleteTestUser } from "../helpers/supabase-admin";
import { generateRandomUUID } from "@/lib/utils";

const TEST_PASSWORD = "TestPassword123!";
const createdUsers: string[] = [];

test.describe("Sign-up flow", () => {
  test.afterAll(async () => {
    await deleteAllMessages();
    for (const email of createdUsers) {
      await deleteTestUser(email);
    }
  });

  test("successful sign-up with email confirmation", async ({ page }) => {
    const email = `e2e-${generateRandomUUID()}@test.com`;
    createdUsers.push(email);

    await page.goto("/sign-up");
    await expect(page.getByRole("heading", { level: 1,  name: "GenialDesk" })).toBeVisible();
    await expect(
      page.getByText("Create your account"),
    ).toBeVisible();

    await page.getByRole("textbox", { name: "email" }).fill(email);
    await page.getByRole("textbox", { name: "password" }).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(
      page.getByText("Your account has been created")
    ).toBeVisible({ timeout: 10_000 });

    const confirmationLink = await waitForConfirmationLink(email);

    await page.goto(confirmationLink);
    await expect(page).toHaveURL(/\/sign-in\?redirect_to=%2Forganizations/);
  });

  test("inputs require values", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page.getByRole("textbox", { name: "email" })).toHaveAttribute("required", "");
    await expect(page.getByRole("textbox", { name: "password" })).toHaveAttribute("required", "");
  });

  test("password must be at least 6 characters", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page.getByRole("textbox", { name: "password" })).toHaveAttribute("minLength", "6");
  });

  test("submit button shows pending state and disables during and after successful submission", async ({
    page,
  }) => {
    const email = `e2e-pending-${generateRandomUUID()}@test.com`;
    createdUsers.push(email);

    await page.goto("/sign-up");

    await page.getByRole("textbox", { name: "email" }).fill(email);
    await page.getByRole("textbox", { name: "password" }).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByRole("button", { name: "Creating account..." })).toBeVisible();
    await expect(page.getByRole("button", { name: "Creating account..." })).toBeDisabled();
    
    await expect(
      page.getByText("Your account has been created")
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeDisabled();
  });
});

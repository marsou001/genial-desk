import { test, expect } from "@playwright/test";
import { deleteAllMessages } from "../helpers/inbucket";
import {
  deleteOrganization,
  deleteTestUser,
  getSetupEmail,
} from "../helpers/supabase-admin";

test.describe("Organizations page — unauthenticated", () => {
  test("redirects to sign-in when not authenticated", async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto("/organizations");
    await expect(page).toHaveURL(/\/sign-in/);
    await context.close();
  });
});

test.describe.serial("Organizations page — authenticated", () => {
  const orgIds: string[] = [];

  test.afterAll(async () => {
    for (const id of orgIds) {
      await deleteOrganization(id);
    }
    const email = getSetupEmail();
    if (email) {
      await deleteTestUser(email);
      await deleteAllMessages();
    }
  });

  test("shows empty state when user has no organizations", async ({ page }) => {
    await page.goto("/organizations");
    await expect(
      page.getByRole("heading", { level: 1, name: "Your organizations" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "No organizations yet" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Organization" }),
    ).toBeVisible();
  });

  test("create organization dialog opens and shows required fields", async ({
    page,
  }) => {
    await page.goto("/organizations");
    await page.getByRole("button", { name: "Create Organization" }).click();

    await expect(
      page.getByRole("heading", { level: 2, name: "Create Organization" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Organization Name" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Organization Name" }),
    ).toHaveAttribute("required", "");

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { level: 2, name: "Create Organization" }),
    ).not.toBeVisible();
  });

  test("submit button is disabled until name has at least 3 characters", async ({
    page,
  }) => {
    await page.goto("/organizations");
    await page.getByRole("button", { name: "Create Organization" }).click();

    const nameInput = page.getByRole("textbox", { name: "Organization Name" });
    const submitBtn = page.getByRole("button", { name: "Create", exact: true });

    await expect(submitBtn).toBeDisabled();

    await nameInput.fill("AB");
    await expect(submitBtn).toBeDisabled();

    await nameInput.fill("ABC");
    await expect(submitBtn).toBeEnabled();
  });

  test("creates a free organization and redirects to dashboard", async ({
    page,
  }) => {
    await page.goto("/organizations");
    await page.getByRole("button", { name: "Create Organization" }).click();

    await page
      .getByRole("textbox", { name: "Organization Name" })
      .fill("E2E Test Org");

    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(
      page.getByText("Organization created successfully"),
    ).toBeVisible({ timeout: 15_000 });

    await page.waitForURL(/\/organizations\/(.+)\/dashboard/, {
      timeout: 15_000,
    });
    const url = page.url();
    const match = url.match(/\/organizations\/([^/]+)\/dashboard/);
    if (match) {
      const orgId = match[1];
      expect(orgId).toBeDefined();
      orgIds.push(orgId);
    }
  });

  test("shows the created organization in the list", async ({ page }) => {
    await page.goto("/organizations");
    await expect(page.getByText("E2E Test Org")).toBeVisible();
    await expect(page.getByText("Owner")).toBeVisible();
    await expect(page.getByTestId("remaining-ai-runs")).toContainText("1");
    await expect(page.getByTestId("remaining-uploads")).toContainText("1");
    await expect(
      page.getByRole("button", { name: "+ Create New Organization" }),
    ).toBeVisible();
  });

  test("creates a free organization and generates a Stripe checkout URL on paid plan chosen", async ({
    page,
  }) => {
    await page.goto("/organizations");
    await page.getByRole("button", { name: "+ Create New Organization" }).click();
    await page.getByRole("combobox").selectOption("pro");

    await expect(
      page.getByRole("button", { name: "Continue to Payment" }),
    ).toBeVisible();

    const orgResponsePromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/organizations") &&
        res.request().method() === "POST",
    );

    await page.route('/api/checkout-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionURL: 'https://checkout.stripe.com/test-session'
        })
      });
    });

    const navigation = page.waitForURL(/checkout\.stripe\.com/);
    await page
      .getByRole("textbox", { name: "Organization Name" })
      .fill("E2E Paid Org");
    await page.getByRole("button", { name: "Continue to Payment" }).click();

    const orgRes = await orgResponsePromise;
    const orgData = await orgRes.json();
    const paidOrgId = orgData.organization?.id;
    expect(paidOrgId).toBeDefined();
    orgIds.push(paidOrgId);
    await navigation
  });

  test("clicking an organization card navigates to its dashboard", async ({
    page,
  }) => {
    await page.goto("/organizations");
    await page.getByText("E2E Test Org").click();
    await expect(page).toHaveURL(
      new RegExp(`/organizations/${orgIds[0]}/dashboard`),
    );
  });
});

import { test, expect } from "@playwright/test";
test("customer can search by district and vehicle type", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("District").selectOption("Colombo");
  await page.getByLabel("Vehicle type").selectOption("car");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/district=Colombo/);
  await expect(
    page.getByRole("heading", { name: "Find a vehicle for your journey" }),
  ).toBeVisible();
});

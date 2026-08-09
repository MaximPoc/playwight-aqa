// @ts-check
import { test, expect } from './fixtures/userGaragePage.fixture.js';

test.describe('Garage page with authenticated user fixture', () => {
  test('userGaragePage opens Garage as already logged-in user', async ({
    userGaragePage,
  }) => {
    await expect(userGaragePage.page).toHaveURL(userGaragePage.urlPattern());
    await expect(userGaragePage.heading).toBeVisible();
    await expect(userGaragePage.addCarButton).toBeVisible();
  });
});

// @ts-check
import { test, expect } from '@playwright/test';
import { ProfilePage } from './poms/index.js';
import { envConfig } from './config/env.config.js';

const mockedProfile = {
  status: 'ok',
  data: {
    userId: 1,
    photoFilename: 'default-user.png',
    name: 'MockedName',
    lastName: 'MockedLast',
  },
};

test.describe('Profile page response mocking', () => {
  test.use({ storageState: envConfig.storageStatePath });

  test('mocked GET /api/users/profile data is displayed on Profile page', async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    await page.route('**/api/users/profile', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockedProfile),
        });
        return;
      }
      await route.continue();
    });

    await profilePage.open();

    await expect(profilePage.profileName).toHaveText(
      `${mockedProfile.data.name} ${mockedProfile.data.lastName}`,
    );
    await expect(profilePage.profileName).toContainText(mockedProfile.data.name);
    await expect(profilePage.profileName).toContainText(mockedProfile.data.lastName);
  });
});

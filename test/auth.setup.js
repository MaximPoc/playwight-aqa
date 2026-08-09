// @ts-check
import { test as setup, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { LandingPage, LoginDialog } from './poms/index.js';
import { envConfig } from './config/env.config.js';

setup('authenticate as existing user and save storage state', async ({ page }) => {
  const landingPage = new LandingPage(page);
  const loginDialog = new LoginDialog(page);

  await landingPage.open();
  await landingPage.clickSignIn();
  await loginDialog.login(envConfig.user.email, envConfig.user.password);

  await expect(page).toHaveURL(/\/panel\/garage/);

  mkdirSync(dirname(envConfig.storageStatePath), { recursive: true });
  await page.context().storageState({ path: envConfig.storageStatePath });
});

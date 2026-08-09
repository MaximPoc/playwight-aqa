// @ts-check
import { test as base } from '@playwright/test';
import { GaragePage } from '../poms/index.js';
import { envConfig } from '../config/env.config.js';

/**
 * @typedef {{ userGaragePage: GaragePage }} UserGarageFixtures
 */

/**
 * @type {import('@playwright/test').Fixtures<
 *   UserGarageFixtures,
 *   {},
 *   import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions,
 *   import('@playwright/test').PlaywrightWorkerArgs & import('@playwright/test').PlaywrightWorkerOptions
 * >}
 */
const userGarageFixtures = {
  userGaragePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL: envConfig.baseURL,
      httpCredentials: envConfig.httpCredentials,
      storageState: envConfig.storageStatePath,
    });
    const page = await context.newPage();
    const userGaragePage = new GaragePage(page);

    await userGaragePage.open();
    await use(userGaragePage);
    await context.close();
  },
};

export const test = base.extend(userGarageFixtures);

export { expect } from '@playwright/test';

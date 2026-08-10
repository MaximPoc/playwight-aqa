// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './test/config/env.config.js';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : 'html',
  use: {
    baseURL: envConfig.baseURL,
    httpCredentials: {
      username: envConfig.httpCredentials.username,
      password: envConfig.httpCredentials.password,
    },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.js/,
    },
  ],
});

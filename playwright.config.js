import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    // Google Fonts sind in Tests nicht nötig und offline nicht erreichbar
    serviceWorkers: 'allow',
  },
  projects: [
    { name: 'handy', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node tests/e2e/server.mjs',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});

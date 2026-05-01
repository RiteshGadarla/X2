import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173/luka-aegis-fe',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: process.env.DEMO
        ? {
            browserName: 'chromium',
            viewport: null,
            launchOptions: {
              slowMo: 600,
              args: ['--start-maximized'],
            },
          }
        : {
            ...devices['Desktop Chrome'],
            viewport: { width: 1440, height: 900 },
          },
    },
  ],
});

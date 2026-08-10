const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 10000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node setup/start-test-backend.js",
      // url: "http://localhost:4000",
      //change for github
      url: "http://127.0.0.1:4000",
      timeout: 30000,
      reuseExistingServer: false,
    },
    {
      command: "npm run dev",
      cwd: "../library-frontend",
      url: "http://127.0.0.1:5173",
      timeout: 30000,
      reuseExistingServer: false,
    },
  ],
});

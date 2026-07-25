import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  webServer: {
    // The app is a static export (next.config.ts `output: "export"`), so
    // there is no `next start` server — tests run against the built `out/`
    // directory the same way a static host serves it. Built without a
    // basePath so routes sit at the root here; the Pages deploy adds one.
    // NOTE: no `-s` flag. That is `serve`'s single-page-app mode, which
    // rewrites every path to index.html — /services would silently return
    // the homepage and unknown paths would 200 instead of 404, hiding real
    // routing bugs. Plain static serving matches how GitHub Pages behaves.
    command: "npm run build && npx --yes serve out -l 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  // NOTE: this sandbox can only reach the pre-installed Chromium build (see
  // docs/performance-report.md "Testing limitations") — WebKit and Firefox
  // binaries could not be downloaded because of the environment's network
  // egress policy. The brief's cross-browser matrix (Chromium/WebKit/Firefox)
  // is defined below but commented out; uncomment once those browsers are
  // installed (`npx playwright install webkit firefox`) in an environment
  // with broader network access, e.g. standard CI.
  projects: [
    {
      name: "chromium-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "chromium-1024",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } },
    },
    {
      name: "chromium-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "chromium-360",
      use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 } },
    },
    // { name: "webkit-1440", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
    // { name: "firefox-1440", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
  ],
});

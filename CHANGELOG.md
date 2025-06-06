# Changelog


## v1.2.1

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.2.0...v1.2.1)

### 💅 Refactors

- Text updates for coloring explanation on table page (b687d8b)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.2.0

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.1.1...v1.2.0)

### 🚀 Enhancements

- Make the selected tariff selectable in the ui (9b86b3f)
- Store selected electricity tariff in the query params (76fc892)
- Add settings page for custom tariff (618967a)
- Store custom tariff in url (eb1c235)

### 🩹 Fixes

- ValidateRuntimeConfig handle arrays (3ec6910)

### 💅 Refactors

- Add store for selecting electricity provider and remove it from url segments (a0a27e8)
- Improve the color scheme for the table page and add a description (0bb4125)
- Adapt e2e tests to configurable provider refactoring (1571429)
- Adapt e2e tests to configurable provider refactoring (0c33565)
- Dynamic colors explanation texts (4e5a9bd)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.1.1

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.1.0...v1.1.1)

### 💅 Refactors

- Table only show extreme colors for hardcoded values (8e693fb)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.1.0

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.0.1...v1.1.0)

### 🚀 Enhancements

- Calculate dynamic range colors (d78b2c3)
- Allow enabling and disabling dynamic colors via get parameter and checkbox (ce7cc49)
- Make it possible to exclude fees via env settings (0a65b6a)
- Add loading statue to PriceItem (f19deb1)
- Table preload more data to prevent loading animation (2d9a89e)

### 🩹 Fixes

- Increase table height if surrounding layout is disabled (6636769)
- E2e tests for different suppliers do no longer exclude fees (12a12e3)

### 💅 Refactors

- Code rabbit suggestions (7ba6fd9)
- Code rabbit suggestions (2dd2a72)
- Table dynamic price range do not use mean and standard deviation but group according to delta from min to max (4728bbd)
- Set max size for the router ranges of table cell colors (8964086)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>
- Dr-erych <dave@satoshiengineering.com>

## v1.0.1

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.0.0...v1.0.1)

### 🩹 Fixes

- Reduction of the bar chart's height if surrounding layout is enabled (da6df83)

### ❤️ Contributors

- Dr-erych <dave@satoshiengineering.com>

## v1.0.0

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v0.0.3...v1.0.0)

### 🚀 Enhancements

- Add prices api route (cadb9b6)
- Add index page functionality from stromchart (b743d0d)
- Add table layout from stromchart (7ed5a84)
- Adjust layout to work with stromchart's contents (c1d542b)
- Add switching of electricity supplier feature including e2e tests (1e7e9ca)
- Localize dates and numbers on table page (cde76e4)
- Add nav (58f19aa)
- Allow disabling the surrounding layout via env var (bae5a5a)
- Add secondary development deploy server in ci scripts (10cb567)
- Allow page title to be configured via env (1cfa610)
- Add icon to power provider links in menu (930c112)
- Add awattar 2024 (7068f85)
- Add checkbox to allow disabling surrounding layout on table page (a58ca46)
- Add deployment to stromchart prod (e4acfe1)

### 🩹 Fixes

- First e2e test (f474a24)
- Set timezone and time for basic e2e test (8dc5754)
- Make sure the server runs on the correct timezone during tests (b1cb664)
- Don't show the bar chart before the width and height can be calculated (f842f7f)
- Use useFetch i/o fetch for loading prices from the api (0f65a56)
- Add pwa meta tags to html head (c417c0c)
- Add timezone to all e2e tests (ec10019)
- Stick position of info to its button (85016f3)
- LoadAwattarPrices also cache on fail to prevent 429 (67ae0df)
- Prepare awattar cache prior to every e2e test suite (a50cd50)
- Awattar data flushing during e2e tests (75feb92)
- Add i18n baseUrl to allow SEO meta info to be generated (c793de3)
- Remove name and short_name from site.webmanifest so that it gets set dynamically based on the page title (cdc3d09)
- Use configured app title in app.vue (a1ab66e)
- Use dynamic runtimeConfig value for apple-mobile-web-app-title (3177230)
- Reduce different number of pixels during height calculation depending on disableSurroundingLayout env flag (30adcca)
- Configure vscode i18n ally extension (6e4cc57)
- Typescriptify BarchartBar component (61e67dd)
- Excludefee e2e tests after refactoring of bar component (c03b4ca)
- More bar segment e2e tests after bar refactoring (3353a3d)
- More bar segment e2e tests after bar refactoring (c2b60f2)

### 💅 Refactors

- Update git hooks (022c739)
- Remove UContainer from index page and add it to table page (9395ef9)
- Use env files to set timezone (e51aa5a)
- Typo (7e46d37)
- Use runtimeConfig appTitle in layout (76476d2)
- First approach for a Bar component (c5b4f16)
- Move more logic into Bar component (aa301b3)
- Barchart use d3 scaleBand to calculate x (301666a)
- Add padding top to barchart (cac5144)
- Add Barchart component and move segment caluclation into it (6de4c4c)
- Barchart handle negative prices (493302a)
- Use pinia store for electricity prices (f34eb59)
- Use options api for pinia store to better support ssr and hydration (d3865bf)
- Remove PageBarchart component and use optional electricitySupplier url segment instead (53c3308)
- Move DatePicker to separate component (3623c29)
- Rename breakpoint variable and DatePicker prop 'type' to 'size' (0fc03c2)

### 🏡 Chore

- Reset npm audit expiry for esbuild (f628f6c)
- Npm audit fix (e2f37cf)
- Update packages (6adbe1b)
- Remove fixed audit exception from .nsprc (db13b3a)

### ✅ Tests

- Add awattar api mock for e2e tests (4d002b3)
- E2e tests use awattar mock api (0fabead)
- Add basic checks to default index page e2e test (3c73417)
- Add e2e test for leap day in march (add6867)
- Add e2e test for switching back to standard time (f4ff366)
- Refactor awattar mock so data can be modified and use it for caching test (a39400a)
- Add e2e test for negative prices (81a6f20)
- Add e2e test for exclude fees (a9f7639)
- Add e2e tests for table page (4b8e348)
- Add 5 minutes to the current hour for test if current table cell is hightlighted (c429502)

### ❤️ Contributors

- Dr-erych <dave@satoshiengineering.com>
- Thomas Schagerl <tom@satoshiengineering.com>

## v0.0.3

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v0.0.2...v0.0.3)

## v0.0.2


### 🚀 Enhancements

- Add validateRuntimeConfig script (ab8fd4d)

### 🩹 Fixes

- Add .env.e2e (5cd43a0)
- Add build:cli (e1b237b)
- Install tsc-alias (22c6f16)

### 🏡 Chore

- Setup nuxt, playwright, vitest etc. (2280f2b)

### ❤️ Contributors

- Dr-erych <dave@satoshiengineering.com>


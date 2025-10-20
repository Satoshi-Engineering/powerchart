# Changelog


## v1.6.1

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.6.0...v1.6.1)

### 🩹 Fixes

- Add new env var to example files (627d39d)
- Allow empty env vars for runtimeConfig vars that are undefined or null by default (095a00e)
- Allow empty env vars for runtimeConfig vars that are undefined or null by default" (b418021)
- Add max height to table using svh (851b8fd)
- Max height for table page also handle surrounding layout (28a4401)

### 💅 Refactors

- Refresh the current hour in the table every minute not only after visibility change (4aa98c8)

### 🏡 Chore

- Npm audit fix (cda4baa)
- Npm audit (0f15521)

### ✅ Tests

- **e2e:** Add e2e test for feedback form (28983ca)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>
- Dr-erych <dave@satoshiengineering.com>

## v1.6.0

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.5.6...v1.6.0)

### 🚀 Enhancements

- Add feedback form (e838d09)

### 💅 Refactors

- Add feedback form enabled button as reading process.env does not work with the built nuxt app (47ed732)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.5.6

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.5.5...v1.5.6)

### 🏡 Chore

- Audit fix (51af00d)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.5.5

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.5.4...v1.5.5)

### 💅 Refactors

- Remove negative segment scaling for barchart (ff0ae4b)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.5.4

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.5.3...v1.5.4)

### 💅 Refactors

- Electricity provider store use composable i/o sync to url plugin for persisting settings to url (36ec799)
- Grid fees use composable i/o sync to url plugin for persisting settings to url (16219bd)
- UseElectricityProviders from store to composable as the pinia store does not handle url changes correctly (3949c1a)
- UseGridFees from store to composable as the pinia store does not handle url changes correctly (21c2666)
- UseAddVat from store to composable and using useQueryParameter composable (ef852be)
- UCheckbox use ref i/o writableComputed for playwright check/uncheck functions (771136d)

### 🏡 Chore

- Npm audit fix (84aa5db)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.5.3

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.5.2...v1.5.3)

### 🩹 Fixes

- Adjust the magic heightReduction number to consider new footer height (cea2d15)

### 💅 Refactors

- Do not send api fetch error to telegram on 429 (feae778)
- Do not wait full 2 minutes on awattar 429 but instead use retry-after header (a4c05de)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>
- Dr-erych <dave@satoshiengineering.com>

## v1.5.2

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.5.1...v1.5.2)

### 🩹 Fixes

- E2e test handle table color fix (15b201a)
- Add waitForUrl to remove e2e test flakiness (9c5990d)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.5.1

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.5.0...v1.5.1)

### 🩹 Fixes

- Price table to not add empty data from next day if there is no data for the next day (5f20ef8)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.5.0

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.4.0...v1.5.0)

### 🚀 Enhancements

- Make multiple grid fees possible and selectable via sidebar (0f9a717)
- Add vat and disableSurroundingLayout options to sidebar (8bc1e99)
- Add more available grid options (dd1b403)
- Add customGrid to grid options (37b164b)
- Add custom grid settings page (b004dbc)
- Save custom grid settings to url (0f0e402)

### 🩹 Fixes

- Type in chargingStation id (2d9dfab)
- Navbar use localePath (55cc787)

### 💅 Refactors

- Page table use grid fees instead of fixedCosts (f34265b)
- Page table always use dynamic colors, but alert colors take electricity provider and grid fee costs into consideration (e7fe2d2)

### ✅ Tests

- Fix e2e tests after selectable gridFees implementation (0f4e342)
- E2e tests handle dynamic color option default and fixed rule removal (461c97d)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.4.0

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.3.0...v1.4.0)

### 🚀 Enhancements

- Handle 429 response from awattar and wait for 2 minutes before sending calls to awattar again (83653b6)

### ✅ Tests

- Add e2e test for footer links (32d3df3)
- Add unit test for fetchWithRateLimiting server util function (0ca76e1)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

## v1.3.0

[compare changes](https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/compare/v1.2.1...v1.3.0)

### 🚀 Enhancements

- Add privacy policy, legal notice and github links to footer (c7b8f54)

### 🩹 Fixes

- Nuxt and vitest ignore stromchart e2e tests (3c9b161)
- Add stromchart e2e env file (f56f6e5)
- E2e lang nav test wait for url change (35a6933)
- Do not set nuxt ui pro license key in e2e env files or it cannot be set by the pipeline (fbe34e8)

### 🏡 Chore

- Add npm audit exception (8d6733c)
- Npm audit fix (5170063)

### ✅ Tests

- Add e2e test with different env setup (f3dbe12)
- Add e2e tests for navigation (0b1af65)
- Add e2e test for disabling surrounding layout (fcefcf8)
- Add e2e test for disabled fee via env settings (f455a33)
- Add e2e test for lang nav (1e20577)
- Add e2e test for table dynamic colors (b8394e6)
- Add e2e test for switching electricity providers (329095c)

### ❤️ Contributors

- Thomas Schagerl <tom@satoshiengineering.com>

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


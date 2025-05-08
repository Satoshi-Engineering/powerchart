# Powerchart

## Setup

Make sure to install dependencies:

```bash
npm install
```

If you are working at Satoshi Engineering, please configure your GIT repo to use the GIT hooks from the directory .githooks:

```bash
git config core.hooksPath .githooks
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Testing

Unit testing:

```bash
npm run test:unit
```

E2E testing:

```bash
npm run test:e2e:ui
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

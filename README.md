# Everytrack

Web application that aims to get everything tracked and provide easy-to-understand metrics. From your account balances, expenses to rolling subscription, Everytrack will assist you in getting them organized with minimal input.

# Table of Contents

- [Features](#features)
  - [Future Roadmap](#future-roadmap)
- [How to start developing](#how-to-start)
  - [Pre-requisite](#pre-requisite)
  - [Commands](#commands)
  - [Import Alias](#import-alias)
  - [How to enable HTTPS for localhost](#how-to-enable-https-for-localhost)

## Features

- Bank Account Balance Tracking
- Broker Account Balance + Stock Holdings Tracking (limited US stocks only)
- Cash Holdings Tracking
- Expenses Tracking
- Future Payments Tracking (rolling and one-off income and subscription)

### Future Roadmap

- Credit Card Balance Tracking
- Metrics like future total asset value calculation

## How to use developing

### Pre-requisite

```bash
❯ npm --version
10.4.0
❯ node --version
v20.11.0
```

### Commands

```bash
# Start development server and serve website
npm run dev
# Compile and build the service for serving
npm run build
```

### Import Alias

Edit the following 3 files

`vite.config.ts`

```typescript
resolve: {
  alias: {
    // Modify paths here
    '@components': path.resolve(__dirname, './src/components')
  }
}
```

`tsconfig.paths.json`

```typescript
"paths": {
  // Modify paths here
  "@components/*": ["src/components/*"]
}
```

`.eslintrc`

```typescript
"import/resolver": {
  "alias": {
    // Edit mapping here
    "map": [["@components", "./src/components"]],
    "extensions": [".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  ...
}
```

### How to enable HTTPS for localhost

```bash
# Specific steps for MacOS only
brew install mkcert
# Only needed if you use Firefox
brew install nss
# Setup mkcert on your machine (creates a CA)
mkcert -install
# Run at the project root directory
mkdir -p .cert && mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem 'localhost' '127.0.0.1' '0.0.0.0'
```

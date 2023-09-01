# Everytrack

Track everything

## Pre-requisite

```bash
❯ npm --version
10.0.0
❯ node --version
v20.5.0
```

## How to use

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

## Remarks

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

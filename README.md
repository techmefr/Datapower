# DataPower

> Framework-agnostic test attributes system with build-time stripping

[![npm version](https://img.shields.io/npm/v/@datapower/nuxt.svg)](https://www.npmjs.com/package/@datapower/nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](./docs/en/README.md) | [Francais](./docs/fr/README.md)

---

## Quick Start

```bash
npm install @datapower/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@datapower/nuxt'],

  datapower: {
    environments: {
      development: ['data-test-id', 'data-test-class', 'data-test-present'],
      production: []
    }
  }
})
```

```vue
<template>
  <button v-t-id="'login-submit'" v-t-class="'form-button'">
    Login
  </button>
</template>
```

## Documentation

- [Full Documentation (EN)](./docs/en/README.md)
- [Documentation complete (FR)](./docs/fr/README.md)

## Packages

- [`@datapower/core`](./packages/core) - Framework-agnostic core
- [`@datapower/nuxt`](./packages/nuxt) - Nuxt 3 module

## License

MIT (c) Tcharlyto

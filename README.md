# DataPower

> Framework-agnostic test attributes system with build-time stripping

[![npm version](https://img.shields.io/npm/v/@datapower/nuxt.svg)](https://www.npmjs.com/package/@datapower/nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Currently available:** Nuxt 3 module  
**Coming soon:** Next.js, Astro, and more

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

**Write this:**
```vue
<button v-t-id="'login-submit'" v-t-class="'form-button'">
  Login
</button>
```

**Get this in development:**
```html

  Login

```

**Get this in production:**
```html

  Login

```

✨ Zero traces. Zero overhead. 100% clean.

---

## Documentation

- [Full Documentation (EN)](./docs/en/README.md)
- [Documentation complete (FR)](./docs/fr/README.md)

## Packages

- [`@datapower/core`](./packages/core) - Framework-agnostic core
- [`@datapower/nuxt`](./packages/nuxt) - Nuxt 3 module

## License

MIT (c) Techmefr

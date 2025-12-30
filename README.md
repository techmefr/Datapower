# DataPower

> Framework-agnostic test attributes system with build-time stripping

[![CI](https://github.com/techmefr/Datapower/actions/workflows/ci.yml/badge.svg)](https://github.com/techmefr/Datapower/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Currently available:** Nuxt 3 module

[English](#english) | [Francais](#francais)

---

<a name="english"></a>

## What is DataPower?

DataPower provides stable test selectors that are automatically stripped from production builds.

**Write this:**
```vue
<button v-t-id="'login-submit'" v-t-class="'form-button'">
  Login
</button>
```

**Get this in development:**
```html
<button data-test-id="login-submit" data-test-class="form-button">
  Login
</button>
```

**Get this in production:**
```html
<button>
  Login
</button>
```

Zero traces. Zero overhead. 100% clean.

---

## Quick Start

### Installation

```bash
# Install from GitHub
pnpm add github:techmefr/Datapower
```

### Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@datapower/nuxt'],

  datapower: {
    environments: {
      development: ['data-test-id', 'data-test-class', 'data-test-present'],
      test: ['data-test-id', 'data-test-class', 'data-test-present'],
      production: []
    }
  }
})
```

---

## Usage

### Vue Directives

```vue
<template>
  <form v-t-id="'login-form'" v-t-class="'form'" @submit.prevent="submit">
    <input
      v-t-id="'login-email'"
      v-t-class="'form-input'"
      type="email"
      v-model="email"
    />

    <button
      v-t-id="'login-submit'"
      v-t-class="'form-button'"
      v-t-present="true"
      type="submit"
    >
      Login
    </button>
  </form>
</template>
```

### Composable

```vue
<script setup>
const { tAttrs, tId, tClass } = useDatapower()
</script>

<template>
  <button v-bind="tAttrs('submit', 'button primary', true)">
    Submit
  </button>

  <input v-bind="tId('email')" type="email" />
</template>
```

### Manual Attributes (also stripped)

```vue
<template>
  <button data-test-id="manual-button" data-test-class="button">
    Click me
  </button>
</template>
```

---

## Available Directives

| Directive | HTML Attribute | Purpose |
|-----------|----------------|---------|
| `v-t-id` | `data-test-id` | Unique identifier |
| `v-t-class` | `data-test-class` | Group/category |
| `v-t-present` | `data-test-present` | Feature flag state |

---

## E2E Testing

### Playwright

```ts
await page.locator('[data-test-id="login-submit"]').click()
await page.locator('[data-test-class~="form-input"]').fill('test@example.com')
```

### Cypress

```ts
cy.get('[data-test-id="login-submit"]').click()
cy.get('[data-test-class~="form-input"]').type('test@example.com')
```

---

## How It Works

1. **Configuration**: Define allowed attributes per environment
2. **Build-time**: Vite compiler strips unauthorized directives
3. **Runtime**: Only allowed directives are registered

```
Development: v-t-id="'btn'" -> data-test-id="btn"
Production:  v-t-id="'btn'" -> (removed)
```

---

## Packages

- [`@datapower/core`](./packages/core) - Framework-agnostic utilities
- [`@datapower/nuxt`](./packages/nuxt) - Nuxt 3 module

---

## License

MIT

---

<a name="francais"></a>

## Qu'est-ce que DataPower ?

DataPower fournit des selecteurs de test stables qui sont automatiquement supprimes des builds de production.

**Ecrivez ceci :**
```vue
<button v-t-id="'login-submit'" v-t-class="'form-button'">
  Connexion
</button>
```

**Obtenez ceci en developpement :**
```html
<button data-test-id="login-submit" data-test-class="form-button">
  Connexion
</button>
```

**Obtenez ceci en production :**
```html
<button>
  Connexion
</button>
```

Zero trace. Zero overhead. 100% propre.

---

## Demarrage Rapide

### Installation

```bash
# Installer depuis GitHub
pnpm add github:techmefr/Datapower
```

### Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@datapower/nuxt'],

  datapower: {
    environments: {
      development: ['data-test-id', 'data-test-class', 'data-test-present'],
      test: ['data-test-id', 'data-test-class', 'data-test-present'],
      production: []
    }
  }
})
```

---

## Utilisation

### Directives Vue

```vue
<template>
  <form v-t-id="'login-form'" v-t-class="'form'" @submit.prevent="submit">
    <input
      v-t-id="'login-email'"
      v-t-class="'form-input'"
      type="email"
      v-model="email"
    />

    <button
      v-t-id="'login-submit'"
      v-t-class="'form-button'"
      v-t-present="true"
      type="submit"
    >
      Connexion
    </button>
  </form>
</template>
```

### Composable

```vue
<script setup>
const { tAttrs, tId, tClass } = useDatapower()
</script>

<template>
  <button v-bind="tAttrs('submit', 'button primary', true)">
    Envoyer
  </button>

  <input v-bind="tId('email')" type="email" />
</template>
```

---

## Directives Disponibles

| Directive | Attribut HTML | Usage |
|-----------|---------------|-------|
| `v-t-id` | `data-test-id` | Identifiant unique |
| `v-t-class` | `data-test-class` | Groupe/categorie |
| `v-t-present` | `data-test-present` | Etat feature flag |

---

## Tests E2E

### Playwright

```ts
await page.locator('[data-test-id="login-submit"]').click()
await page.locator('[data-test-class~="form-input"]').fill('test@example.com')
```

### Cypress

```ts
cy.get('[data-test-id="login-submit"]').click()
cy.get('[data-test-class~="form-input"]').type('test@example.com')
```

---

## Fonctionnement

1. **Configuration**: Definir les attributs autorises par environnement
2. **Build-time**: Le compilateur Vite supprime les directives non autorisees
3. **Runtime**: Seules les directives autorisees sont enregistrees

```
Developpement: v-t-id="'btn'" -> data-test-id="btn"
Production:    v-t-id="'btn'" -> (supprime)
```

---

## Packages

- [`@datapower/core`](./packages/core) - Utilitaires framework-agnostic
- [`@datapower/nuxt`](./packages/nuxt) - Module Nuxt 3

---

## Licence

MIT

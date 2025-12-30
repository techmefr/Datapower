# DataPower Documentation

## Introduction

DataPower is a test attributes system for Vue/Nuxt that automatically strips test attributes in production builds. This keeps your production HTML clean while providing robust selectors for your E2E tests during development.

## Installation

```bash
# npm
npm install @datapower/nuxt

# pnpm
pnpm add @datapower/nuxt

# yarn
yarn add @datapower/nuxt
```

## Configuration

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@datapower/nuxt'],

  datapower: {
    environments: {
      development: ['data-test-id', 'data-test-class', 'data-test-present'],
      test: ['data-test-id', 'data-test-class', 'data-test-present'],
      production: [],
      staging: ['data-test-id']
    }
  }
})
```

## Usage

### Directives

Use Vue directives to add test attributes:

```vue
<template>
  <!-- Single attribute -->
  <button v-t-id="'login-submit'">Login</button>

  <!-- Multiple attributes -->
  <input
    v-t-id="'email-input'"
    v-t-class="'form-input primary'"
    v-t-present="true"
  />

  <!-- Dynamic values -->
  <div v-t-id="`product-${product.id}`">
    {{ product.name }}
  </div>
</template>
```

### Composable

Use the `useDatapower()` composable for programmatic attribute generation:

```vue
<script setup>
const { tAttrs, tId, tClass, tPresent, enabled, environment } = useDatapower()
</script>

<template>
  <!-- Full attributes -->
  <button v-bind="tAttrs('my-button', 'primary large', true)">
    Click Me
  </button>

  <!-- Individual helpers -->
  <input v-bind="tId('email-input')" />
  <div v-bind="tClass('card')" />
</template>
```

## Available Directives

| Directive | HTML Attribute | Description |
|-----------|----------------|-------------|
| `v-t-id` | `data-test-id` | Unique identifier for element |
| `v-t-class` | `data-test-class` | Test class(es) for element |
| `v-t-present` | `data-test-present` | Boolean presence indicator |

## How It Works

1. **Development**: All directives are registered and render their corresponding `data-test-*` attributes
2. **Production**: Vite compiler strips unauthorized directives at build time - no runtime overhead

## E2E Testing

### Playwright

```ts
// Use data-test-id for stable selectors
await page.locator('[data-test-id="login-submit"]').click()
await page.locator('[data-test-class~="form-input"]').fill('test@example.com')
```

### Cypress

```ts
cy.get('[data-test-id="login-submit"]').click()
cy.get('[data-test-class~="form-input"]').type('test@example.com')
```

## Best Practices

1. **Use semantic IDs**: `login-submit` instead of `btn1`
2. **Group with classes**: Use `v-t-class` for similar elements
3. **Keep IDs unique**: Each `v-t-id` should identify one element
4. **Test in staging**: Enable `data-test-id` in staging to catch issues early

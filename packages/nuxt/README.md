# @datapower/nuxt

> DataPower test attributes for Nuxt 3

## Installation

```bash
npm install @datapower/nuxt
```

## Setup

```ts
// nuxt.config.ts
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

```vue
<template>
  <button v-t-id="'login-submit'" v-t-class="'form-button'">
    Login
  </button>
</template>
```

### Composable

```vue
<script setup>
const { tAttrs, tId, tClass, enabled, environment } = useDatapower()
</script>

<template>
  <button v-bind="tAttrs('my-button', 'primary', true)">
    Click Me
  </button>

  <input v-bind="tId('email-input')" />
</template>
```

## Configuration

| Environment | Default Attributes |
|-------------|-------------------|
| development | data-test-id, data-test-class, data-test-present |
| test | data-test-id, data-test-class, data-test-present |
| production | (none) |
| staging | data-test-id |

## License

MIT

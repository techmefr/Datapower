# Documentation DataPower

## Introduction

DataPower est un systeme d'attributs de test pour Vue/Nuxt qui supprime automatiquement les attributs de test en production. Cela garde votre HTML de production propre tout en fournissant des selecteurs robustes pour vos tests E2E pendant le developpement.

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

Ajoutez le module a votre `nuxt.config.ts`:

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

## Utilisation

### Directives

Utilisez les directives Vue pour ajouter des attributs de test:

```vue
<template>
  <!-- Attribut simple -->
  <button v-t-id="'login-submit'">Connexion</button>

  <!-- Attributs multiples -->
  <input
    v-t-id="'email-input'"
    v-t-class="'form-input primary'"
    v-t-present="true"
  />

  <!-- Valeurs dynamiques -->
  <div v-t-id="`product-${product.id}`">
    {{ product.name }}
  </div>
</template>
```

### Composable

Utilisez le composable `useDatapower()` pour la generation programmatique d'attributs:

```vue
<script setup>
const { tAttrs, tId, tClass, tPresent, enabled, environment } = useDatapower()
</script>

<template>
  <!-- Tous les attributs -->
  <button v-bind="tAttrs('my-button', 'primary large', true)">
    Cliquez-moi
  </button>

  <!-- Helpers individuels -->
  <input v-bind="tId('email-input')" />
  <div v-bind="tClass('card')" />
</template>
```

## Directives Disponibles

| Directive | Attribut HTML | Description |
|-----------|---------------|-------------|
| `v-t-id` | `data-test-id` | Identifiant unique pour l'element |
| `v-t-class` | `data-test-class` | Classe(s) de test pour l'element |
| `v-t-present` | `data-test-present` | Indicateur de presence booleen |

## Fonctionnement

1. **Developpement**: Toutes les directives sont enregistrees et rendent leurs attributs `data-test-*` correspondants
2. **Production**: Le compilateur Vite supprime les directives non autorisees au moment du build - aucun impact sur les performances

## Tests E2E

### Playwright

```ts
// Utilisez data-test-id pour des selecteurs stables
await page.locator('[data-test-id="login-submit"]').click()
await page.locator('[data-test-class~="form-input"]').fill('test@example.com')
```

### Cypress

```ts
cy.get('[data-test-id="login-submit"]').click()
cy.get('[data-test-class~="form-input"]').type('test@example.com')
```

## Bonnes Pratiques

1. **Utilisez des IDs semantiques**: `login-submit` au lieu de `btn1`
2. **Groupez avec les classes**: Utilisez `v-t-class` pour les elements similaires
3. **Gardez les IDs uniques**: Chaque `v-t-id` doit identifier un seul element
4. **Testez en staging**: Activez `data-test-id` en staging pour detecter les problemes tot

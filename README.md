# DataPower

> Framework-agnostic test attributes system with build-time stripping

[![npm version](https://img.shields.io/npm/v/@datapower/nuxt.svg)](https://www.npmjs.com/package/@datapower/nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Currently available:** Nuxt 3 module  
**Coming soon:** Next.js, Astro, and more

[🇬🇧 English](#english) | [🇫🇷 Français](#français)

---

<a name="english"></a>

# 🇬🇧 English Documentation

## 🎯 What is DataPower?

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

✨ Zero traces. Zero overhead. 100% clean.

---

## ⚡ Quick Start

### Installation
```bash
npm install @datapower/nuxt
# or
pnpm add @datapower/nuxt
# or
yarn add @datapower/nuxt
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
      production: [] // Completely stripped in production
    }
  }
})
```

---

## 📖 Complete Example

### Component with DataPower
```vue
<!-- components/LoginForm.vue -->
<template>
  <form 
    v-t-id="'login-form'" 
    v-t-class="'auth-form'"
    @submit.prevent="handleSubmit"
  >
    <h2 v-t-id="'login-form-title'">Login to your account</h2>
    
    <!-- Email field -->
    <div v-t-class="'form-field'">
      <label v-t-id="'login-email-label'" for="email">Email</label>
      <input
        v-t-id="'login-email-input'"
        v-t-class="'form-input'"
        id="email"
        type="email"
        v-model="form.email"
        placeholder="you@example.com"
        required
      />
      <span 
        v-if="errors.email"
        v-t-id="'login-email-error'"
        v-t-class="'form-error'"
      >
        {{ errors.email }}
      </span>
    </div>
    
    <!-- Password field -->
    <div v-t-class="'form-field'">
      <label v-t-id="'login-password-label'" for="password">Password</label>
      <input
        v-t-id="'login-password-input'"
        v-t-class="'form-input'"
        id="password"
        type="password"
        v-model="form.password"
        required
      />
      <span 
        v-if="errors.password"
        v-t-id="'login-password-error'"
        v-t-class="'form-error'"
      >
        {{ errors.password }}
      </span>
    </div>
    
    <!-- Remember me -->
    <div v-t-class="'form-checkbox'">
      <input
        v-t-id="'login-remember-checkbox'"
        id="remember"
        type="checkbox"
        v-model="form.remember"
      />
      <label for="remember">Remember me</label>
    </div>
    
    <!-- Submit button -->
    <button
      v-t-id="'login-submit-button'"
      v-t-class="'form-button primary'"
      v-t-present="!isLoading"
      type="submit"
      :disabled="isLoading"
    >
      <span v-if="!isLoading">Sign in</span>
      <span v-else v-t-id="'login-loading-text'">Signing in...</span>
    </button>
    
    <!-- Forgot password link -->
    
      v-t-id="'login-forgot-link'"
      v-t-class="'form-link'"
      href="/forgot-password"
    >
      Forgot your password?
    </a>
  </form>
</template>

<script setup lang="ts">
const form = ref({
  email: '',
  password: '',
  remember: false
})

const errors = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)

async function handleSubmit() {
  // Reset errors
  errors.value = { email: '', password: '' }
  
  // Validate
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    return
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    return
  }
  
  // Submit
  isLoading.value = true
  
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    
    navigateTo('/dashboard')
  } catch (error) {
    errors.value.password = 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}
</script>
```

### Testing with Nuxt Test Utils
```ts
// tests/components/LoginForm.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LoginForm from '~/components/LoginForm.vue'

describe('LoginForm', () => {
  it('renders all form elements', async () => {
    const wrapper = await mountSuspended(LoginForm)
    
    // Check form structure
    expect(wrapper.find('[data-test-id="login-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="login-form-title"]').text())
      .toBe('Login to your account')
    
    // Check inputs
    expect(wrapper.find('[data-test-id="login-email-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="login-password-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="login-remember-checkbox"]').exists()).toBe(true)
    
    // Check submit button
    expect(wrapper.find('[data-test-id="login-submit-button"]').text())
      .toBe('Sign in')
  })
  
  it('shows validation errors for empty fields', async () => {
    const wrapper = await mountSuspended(LoginForm)
    
    // Submit empty form
    await wrapper.find('[data-test-id="login-form"]').trigger('submit')
    
    // Check errors appear
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test-id="login-email-error"]').text())
      .toBe('Email is required')
  })
  
  it('submits form with valid credentials', async () => {
    const wrapper = await mountSuspended(LoginForm)
    
    // Fill form
    await wrapper.find('[data-test-id="login-email-input"]')
      .setValue('user@example.com')
    await wrapper.find('[data-test-id="login-password-input"]')
      .setValue('password123')
    
    // Submit
    await wrapper.find('[data-test-id="login-form"]').trigger('submit')
    
    // Check loading state
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test-id="login-loading-text"]').exists()).toBe(true)
  })
  
  it('counts elements by test class', async () => {
    const wrapper = await mountSuspended(LoginForm)
    
    // Count form fields
    const formFields = wrapper.findAll('[data-test-class~="form-field"]')
    expect(formFields).toHaveLength(2) // email + password
    
    // Count form inputs
    const formInputs = wrapper.findAll('[data-test-class~="form-input"]')
    expect(formInputs).toHaveLength(2)
  })
})
```

### Testing with Playwright
```ts
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('successful login', async ({ page }) => {
    await page.goto('/login')
    
    // Fill form using stable selectors
    await page.locator('[data-test-id="login-email-input"]')
      .fill('user@example.com')
    await page.locator('[data-test-id="login-password-input"]')
      .fill('password123')
    
    // Submit
    await page.locator('[data-test-id="login-submit-button"]').click()
    
    // Verify redirect
    await expect(page).toHaveURL('/dashboard')
  })
  
  test('validation errors', async ({ page }) => {
    await page.goto('/login')
    
    // Submit empty form
    await page.locator('[data-test-id="login-submit-button"]').click()
    
    // Check error messages
    await expect(page.locator('[data-test-id="login-email-error"]'))
      .toBeVisible()
    await expect(page.locator('[data-test-id="login-email-error"]'))
      .toHaveText('Email is required')
  })
  
  test('loading state', async ({ page }) => {
    await page.goto('/login')
    
    // Fill and submit
    await page.locator('[data-test-id="login-email-input"]')
      .fill('user@example.com')
    await page.locator('[data-test-id="login-password-input"]')
      .fill('password123')
    await page.locator('[data-test-id="login-submit-button"]').click()
    
    // Check loading text appears
    await expect(page.locator('[data-test-id="login-loading-text"]'))
      .toBeVisible()
  })
})
```

---

## ✨ Features

- ✅ **Vue Directives** - `v-t-id`, `v-t-class`, `v-t-present`
- ✅ **Build-time Stripping** - Zero overhead in production
- ✅ **Environment-based Configuration** - Different settings per environment
- ✅ **SSR-safe** - Works perfectly with server-side rendering
- ✅ **TypeScript Support** - Full type safety
- ✅ **Framework-agnostic Core** - Reusable across different frameworks

---

## 🎨 Usage Patterns

### Three Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `v-t-id` | Unique identifier | `v-t-id="'login-submit'"` |
| `v-t-class` | Group/category | `v-t-class="'form-button'"` |
| `v-t-present` | Feature flag state | `v-t-present="user.isPremium"` |

### Using the Composable
```vue
<template>
  <!-- All attributes at once -->
  <button v-bind="tAttrs('submit', 'button primary', true)">
    Submit
  </button>
  
  <!-- Just ID -->
  <input v-bind="tId('email')" type="email" />
  
  <!-- Just class -->
  <Card v-bind="tClass('product-card')" />
</template>

<script setup>
const { tAttrs, tId, tClass } = useDatapower()
</script>
```

### Manual Attributes (also stripped)
```vue
<template>
  <!-- These are also stripped in production -->
  <button 
    data-test-id="manual-button"
    data-test-class="button"
  >
    Click me
  </button>
</template>
```

---

## 📋 Naming Conventions

### data-test-id Format

**Pattern:** `{section}-{element}-{action}`
```
✅ login-form-submit
✅ user-profile-header-edit
✅ product-42 (dynamic ID)
✅ header-nav-logout

❌ loginFormSubmit (camelCase)
❌ login_form_submit (underscore)
❌ submit (too generic)
```

### data-test-class Format

**Pattern:** `{type}-{descriptor}`
```
✅ product-card
✅ form-button
✅ premium-feature
✅ "form-button primary" (multiple)
```

---

## 🔧 Advanced Configuration

### Multiple Environments
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@datapower/nuxt'],
  
  datapower: {
    environments: {
      // Development: all attributes
      development: [
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ],
      
      // Tests: all attributes
      test: [
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ],
      
      // CI/Preview: all attributes
      preview: [
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ],
      
      // Staging: only IDs for debugging
      staging: [
        'data-test-id'
      ],
      
      // Production: nothing
      production: [],
      
      // Custom: temporary debug in production
      'prod-debug': [
        'data-test-id'
      ]
    }
  }
})
```

### Custom Environment
```bash
# Build for specific environment
NODE_ENV=staging npm run build
NODE_ENV=prod-debug npm run build
```

---

## 🔍 How It Works

DataPower uses a three-layer system:

### 1. Configuration Layer
Define which attributes are allowed per environment in `nuxt.config.ts`

### 2. Build-time Stripping (Vite)
Vue compiler transform removes unauthorized directives **before** Vue sees them
```ts
// Source code
<button v-t-id="'submit'" v-t-class="'button'">

// In staging (only data-test-id allowed)
// v-t-class is REMOVED by Vite transform

// Compiled code
<button v-t-id="'submit'">
```

### 3. Runtime Directives (Vue Plugin)
Only registers directives that are allowed in current environment
```ts
// In production: no directives registered
// In development: all directives registered
```

---

## 📦 Packages

- [`@datapower/core`](./packages/core) - Framework-agnostic core utilities
- [`@datapower/nuxt`](./packages/nuxt) - Nuxt 3 module with Vue directives

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

---

## 📄 License

MIT © [Techmefr](https://github.com/techmefr)

---

<a name="français"></a>

# 🇫🇷 Documentation Française

## 🎯 Qu'est-ce que DataPower ?

DataPower fournit des sélecteurs de test stables qui sont automatiquement supprimés des builds de production.

**Écrivez ceci :**
```vue
<button v-t-id="'login-submit'" v-t-class="'form-button'">
  Connexion
</button>
```

**Obtenez ceci en développement :**
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

✨ Zéro trace. Zéro overhead. 100% propre.

---

## ⚡ Démarrage Rapide

### Installation
```bash
npm install @datapower/nuxt
# ou
pnpm add @datapower/nuxt
# ou
yarn add @datapower/nuxt
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
      production: [] // Complètement supprimé en production
    }
  }
})
```

---

## 📖 Exemple Complet

### Composant avec DataPower
```vue
<!-- components/FormulaireConnexion.vue -->
<template>
  <form 
    v-t-id="'formulaire-connexion'" 
    v-t-class="'formulaire-auth'"
    @submit.prevent="gererSoumission"
  >
    <h2 v-t-id="'formulaire-connexion-titre'">Connectez-vous à votre compte</h2>
    
    <!-- Champ email -->
    <div v-t-class="'champ-formulaire'">
      <label v-t-id="'connexion-email-label'" for="email">Email</label>
      <input
        v-t-id="'connexion-email-input'"
        v-t-class="'formulaire-input'"
        id="email"
        type="email"
        v-model="formulaire.email"
        placeholder="vous@exemple.com"
        required
      />
      <span 
        v-if="erreurs.email"
        v-t-id="'connexion-email-erreur'"
        v-t-class="'formulaire-erreur'"
      >
        {{ erreurs.email }}
      </span>
    </div>
    
    <!-- Champ mot de passe -->
    <div v-t-class="'champ-formulaire'">
      <label v-t-id="'connexion-password-label'" for="password">Mot de passe</label>
      <input
        v-t-id="'connexion-password-input'"
        v-t-class="'formulaire-input'"
        id="password"
        type="password"
        v-model="formulaire.motDePasse"
        required
      />
      <span 
        v-if="erreurs.motDePasse"
        v-t-id="'connexion-password-erreur'"
        v-t-class="'formulaire-erreur'"
      >
        {{ erreurs.motDePasse }}
      </span>
    </div>
    
    <!-- Se souvenir de moi -->
    <div v-t-class="'formulaire-checkbox'">
      <input
        v-t-id="'connexion-souvenir-checkbox'"
        id="souvenir"
        type="checkbox"
        v-model="formulaire.seSouvenir"
      />
      <label for="souvenir">Se souvenir de moi</label>
    </div>
    
    <!-- Bouton de soumission -->
    <button
      v-t-id="'connexion-soumettre-bouton'"
      v-t-class="'formulaire-bouton primaire'"
      v-t-present="!enChargement"
      type="submit"
      :disabled="enChargement"
    >
      <span v-if="!enChargement">Se connecter</span>
      <span v-else v-t-id="'connexion-chargement-texte'">Connexion en cours...</span>
    </button>
    
    <!-- Lien mot de passe oublié -->
    
      v-t-id="'connexion-oublie-lien'"
      v-t-class="'formulaire-lien'"
      href="/mot-de-passe-oublie"
    >
      Mot de passe oublié ?
    </a>
  </form>
</template>

<script setup lang="ts">
const formulaire = ref({
  email: '',
  motDePasse: '',
  seSouvenir: false
})

const erreurs = ref({
  email: '',
  motDePasse: ''
})

const enChargement = ref(false)

async function gererSoumission() {
  // Réinitialiser les erreurs
  erreurs.value = { email: '', motDePasse: '' }
  
  // Valider
  // tests/components/FormulaireConnexion.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FormulaireConnexion from '~/components/FormulaireConnexion.vue'

describe('FormulaireConnexion', () => {
  it('affiche tous les éléments du formulaire', async () => {
    const wrapper = await mountSuspended(FormulaireConnexion)
    
    // Vérifier la structure du formulaire
    expect(wrapper.find('[data-test-id="formulaire-connexion"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="formulaire-connexion-titre"]').text())
      .toBe('Connectez-vous à votre compte')
    
    // Vérifier les champs
    expect(wrapper.find('[data-test-id="connexion-email-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="connexion-password-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test-id="connexion-souvenir-checkbox"]').exists()).toBe(true)
    
    // Vérifier le bouton de soumission
    expect(wrapper.find('[data-test-id="connexion-soumettre-bouton"]').text())
      .toBe('Se connecter')
  })
  
  it('affiche les erreurs de validation pour les champs vides', async () => {
    const wrapper = await mountSuspended(FormulaireConnexion)
    
    // Soumettre le formulaire vide
    await wrapper.find('[data-test-id="formulaire-connexion"]').trigger('submit')
    
    // Vérifier que les erreurs apparaissent
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test-id="connexion-email-erreur"]').text())
      .toBe('L\'email est requis')
  })
  
  it('soumet le formulaire avec des identifiants valides', async () => {
    const wrapper = await mountSuspended(FormulaireConnexion)
    
    // Remplir le formulaire
    await wrapper.find('[data-test-id="connexion-email-input"]')
      .setValue('utilisateur@exemple.com')
    await wrapper.find('[data-test-id="connexion-password-input"]')
      .setValue('motdepasse123')
    
    // Soumettre
    await wrapper.find('[data-test-id="formulaire-connexion"]').trigger('submit')
    
    // Vérifier l'état de chargement
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test-id="connexion-chargement-texte"]').exists()).toBe(true)
  })
  
  it('compte les éléments par classe de test', async () => {
    const wrapper = await mountSuspended(FormulaireConnexion)
    
    // Compter les champs du formulaire
    const champsFormulaire = wrapper.findAll('[data-test-class~="champ-formulaire"]')
    expect(champsFormulaire).toHaveLength(2) // email + mot de passe
    
    // Compter les inputs du formulaire
    const inputsFormulaire = wrapper.findAll('[data-test-class~="formulaire-input"]')
    expect(inputsFormulaire).toHaveLength(2)
  })
})

### Tests avec Playwright
// e2e/connexion.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Flux de Connexion', () => {
  test('connexion réussie', async ({ page }) => {
    await page.goto('/connexion')
    
    // Remplir le formulaire avec des sélecteurs stables
    await page.locator('[data-test-id="connexion-email-input"]')
      .fill('utilisateur@exemple.com')
    await page.locator('[data-test-id="connexion-password-input"]')
      .fill('motdepasse123')
    
    // Soumettre
    await page.locator('[data-test-id="connexion-soumettre-bouton"]').click()
    
    // Vérifier la redirection
    await expect(page).toHaveURL('/tableau-de-bord')
  })
  
  test('erreurs de validation', async ({ page }) => {
    await page.goto('/connexion')
    
    // Soumettre un formulaire vide
    await page.locator('[data-test-id="connexion-soumettre-bouton"]').click()
    
    // Vérifier les messages d'erreur
    await expect(page.locator('[data-test-id="connexion-email-erreur"]'))
      .toBeVisible()
    await expect(page.locator('[data-test-id="connexion-email-erreur"]'))
      .toHaveText('L\'email est requis')
  })
  
  test('état de chargement', async ({ page }) => {
    await page.goto('/connexion')
    
    // Remplir et soumettre
    await page.locator('[data-test-id="connexion-email-input"]')
      .fill('utilisateur@exemple.com')
    await page.locator('[data-test-id="connexion-password-input"]')
      .fill('motdepasse123')
    await page.locator('[data-test-id="connexion-soumettre-bouton"]').click()
    
    // Vérifier que le texte de chargement apparaît
    await expect(page.locator('[data-test-id="connexion-chargement-texte"]'))
      .toBeVisible()
  })
})

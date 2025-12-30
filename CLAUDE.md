# Claude Code Configuration

## Commit Rules

**NEVER include in commit messages:**
- `Generated with Claude Code`
- `Co-Authored-By: Claude`
- Any reference to Claude, Claude Code, or Anthropic

**Commit format:**
```
type(scope): short description

Optional longer description
```

**Types:** feat, fix, docs, chore, refactor, test, ci

---

## Conventions de code

### Naming
- **Booleens** : Prefixe `is` (isLoading, isActive, isValid)
- **Interfaces** : Prefixe `I` dans dossier `types/` (IProduct, IUser)
- **Mock data** : Prefixe `mock` (mockProducts, mockUser)
- **Composables** : Prefixe `use` en camelCase (useAuth, useProducts)
- **Constantes** : SCREAMING_SNAKE_CASE (MAX_FILE_SIZE, API_TIMEOUT)
- **IDs CSS** : kebab-case (user-profile, main-container)
- **Attributs Vue** : kebab-case (model-value, custom-prop, @update:model-value)

### Style de code
- **Pas de commentaires** : Code auto-documente uniquement (sauf demande explicite)
- **Pas de type `any`** : Typage strict obligatoire
- **Pas d'emojis** : Jamais dans le code ni dans les console.log
- **Console logs** : Messages humains et naturels, pas robotiques

### Structure Vue
- **defineProps/defineModel/defineEmits** : Jamais de const, utilisation directe
- **Template** : Display-only, toute logique dans `<script setup>`
- **Computed/methods** : Tout dans le script, pas dans le template

### TypeScript
- **Preferer `ref()`** a `reactive()`
- **Typage explicite** des retours de fonction
- **Preferer `null`** a `undefined` pour valeurs absentes
- **Type guards** : Explicites, pas d'optional chaining unsafe

### Bonnes pratiques
- **Early returns** : Gerer les erreurs d'abord, reduire l'indentation
- **Try/catch obligatoire** pour async/await
- **Pas de valeurs magiques** : Extraire en constantes nommees
- **Ternaires simples** uniquement, if/else pour logique complexe
- **Une responsabilite** par fonction
- **KISS and DRY**

### Ordre des imports
1. Vue core
2. Nuxt
3. Vuetify
4. Types
5. Composables
6. Utils

---

## ESLint config

```js
export default withNuxt({
    rules: {
        'vue/require-default-prop': 'off',
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'never',
                },
                svg: 'always'
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/no-unsafe-optional-chaining': 'error',
    }
})
```

## Prettier config

```json
{
    "tabWidth": 4,
    "useTabs": false,
    "singleQuote": true,
    "semi": false,
    "printWidth": 100,
    "bracketSpacing": true,
    "arrowParens": "avoid",
    "vueIndentScriptAndStyle": false,
    "htmlWhitespaceSensitivity": "ignore"
}
```

---

## Architecture DDD

Organisation en Domain-Driven Design avec separation claire des responsabilites.

## Tests Vitest/Vue

Mocks simples de composants Vuetify. Tests minimalistes et fiables.

## Stack technique

- **TypeScript strict** : Pas d'any, variables non utilisees avec `_`
- **i18n** : Multi-langue (fr/en/de/es/it) avec cookies

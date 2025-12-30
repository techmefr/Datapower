export default defineNuxtConfig({
  modules: ['../src/module'],

  datapower: {
    environments: {
      development: ['data-test-id', 'data-test-class', 'data-test-present'],
      test: ['data-test-id', 'data-test-class', 'data-test-present'],
      production: []
    }
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-01-01'
})

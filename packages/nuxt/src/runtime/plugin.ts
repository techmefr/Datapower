import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createHelpers } from '@datapower/core'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.datapower
  const allowedAttrs = config.allowedAttributes || []

  // Early return if disabled
  if (!config.enabled || allowedAttrs.length === 0) {
    return {
      provide: {
        datapower: {
          tAttrs: () => ({}),
          tId: () => ({}),
          tClass: () => ({}),
          tPresent: () => ({}),
          allowedAttributes: [],
          environment: config.environment,
          enabled: false
        }
      }
    }
  }

  const helpers = createHelpers(allowedAttrs)

  // Register v-t-id directive
  if (allowedAttrs.includes('data-test-id')) {
    nuxtApp.vueApp.directive('t-id', {
      mounted(el, binding) {
        el.setAttribute('data-test-id', binding.value)
      },
      updated(el, binding) {
        el.setAttribute('data-test-id', binding.value)
      }
    })
  }

  // Register v-t-class directive
  if (allowedAttrs.includes('data-test-class')) {
    nuxtApp.vueApp.directive('t-class', {
      mounted(el, binding) {
        el.setAttribute('data-test-class', binding.value)
      },
      updated(el, binding) {
        el.setAttribute('data-test-class', binding.value)
      }
    })
  }

  // Register v-t-present directive
  if (allowedAttrs.includes('data-test-present')) {
    nuxtApp.vueApp.directive('t-present', {
      mounted(el, binding) {
        el.setAttribute('data-test-present', String(binding.value))
      },
      updated(el, binding) {
        el.setAttribute('data-test-present', String(binding.value))
      }
    })
  }

  return {
    provide: {
      datapower: {
        tAttrs: helpers.attrs,
        tId: helpers.id,
        tClass: helpers.class,
        tPresent: helpers.present,
        allowedAttributes: allowedAttrs,
        environment: config.environment,
        enabled: true
      }
    }
  }
})

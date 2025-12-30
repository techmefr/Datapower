import { defineNuxtModule, addPlugin, addImports, createResolver } from '@nuxt/kit'
import {
  DEFAULT_CONFIG,
  getAllowedAttributes,
  getDirectivesToStrip,
  shouldStripAttribute,
  DIRECTIVE_MAPPING,
  type DataPowerConfig
} from '@datapower/core'

export interface ModuleOptions extends DataPowerConfig {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@datapower/nuxt',
    configKey: 'datapower',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },

  defaults: DEFAULT_CONFIG,

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const currentEnv = process.env.NODE_ENV || 'development'
    const allowedAttrs = getAllowedAttributes(options, currentEnv)
    const directivesToStrip = getDirectivesToStrip(allowedAttrs)

    // Inject runtime config
    nuxt.options.runtimeConfig.public.datapower = {
      allowedAttributes: allowedAttrs,
      environment: currentEnv,
      enabled: allowedAttrs.length > 0
    }

    // Add composable auto-import
    addImports({
      name: 'useDatapower',
      from: resolver.resolve('./runtime/composables')
    })

    // Add plugin only if enabled
    if (allowedAttrs.length > 0) {
      addPlugin(resolver.resolve('./runtime/plugin'))

      console.log(`✅ DataPower [${currentEnv}]`)
      console.log(`   Allowed: ${allowedAttrs.join(', ')}`)
      if (directivesToStrip.length > 0) {
        console.log(`   Stripped: ${directivesToStrip.join(', ')}`)
      }
    } else {
      console.log(`⚪ DataPower [${currentEnv}]: Disabled`)
    }

    // Directive name to attribute mapping (without v- prefix)
    const directiveToAttr: Record<string, string> = {
      't-id': 'data-test-id',
      't-class': 'data-test-class',
      't-present': 'data-test-present'
    }

    // Configure Vite to transform and strip directives
    nuxt.hook('vite:extendConfig', (config) => {
      config.vue = config.vue || {}
      config.vue.template = config.vue.template || {}
      config.vue.template.compilerOptions = config.vue.template.compilerOptions || {}

      const existingTransforms = config.vue.template.compilerOptions.nodeTransforms || []

      config.vue.template.compilerOptions.nodeTransforms = [
        ...existingTransforms,
        (node: any) => {
          if (node.type !== 1) return // Element node type
          if (!node.props) return

          const newProps: any[] = []

          for (const prop of node.props) {
            // Handle directives (type 7)
            if (prop.type === 7) {
              const attrName = directiveToAttr[prop.name]

              if (attrName) {
                // This is one of our directives
                if (allowedAttrs.includes(attrName)) {
                  // Transform directive to attribute
                  // Create a new attribute node with the expression value
                  newProps.push({
                    type: 7, // Keep as directive for dynamic binding
                    name: 'bind',
                    arg: {
                      type: 4, // Simple expression
                      content: attrName,
                      isStatic: true,
                      constType: 3,
                      loc: prop.loc
                    },
                    exp: prop.exp,
                    modifiers: [],
                    loc: prop.loc
                  })
                }
                // If not allowed, skip (strip)
                continue
              }
            }

            // Handle manual data-test-* attributes (type 6)
            if (prop.type === 6) {
              if (shouldStripAttribute(prop.name, allowedAttrs)) {
                continue // Strip unauthorized attribute
              }
            }

            // Keep all other props
            newProps.push(prop)
          }

          node.props = newProps
        }
      ]
    })
  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    datapower?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    datapower?: ModuleOptions
  }
}

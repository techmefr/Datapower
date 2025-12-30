import { defineNuxtModule, addPlugin, addImports, createResolver } from '@nuxt/kit'
import {
  DEFAULT_CONFIG,
  getAllowedAttributes,
  getDirectivesToStrip,
  shouldStripAttribute,
  DIRECTIVE_MAPPING,
  type DataPowerConfig
} from '@datapower/core'
import type { NodeTransform } from '@vue/compiler-core'

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

    // Build directive name to attribute mapping from DIRECTIVE_MAPPING (without v- prefix)
    const directiveToAttr: Record<string, string> = Object.entries(DIRECTIVE_MAPPING).reduce(
      (acc, [directive, attr]) => {
        const name = directive.replace('v-', '')
        acc[name] = attr
        return acc
      },
      {} as Record<string, string>
    )

    // Configure Vite to transform and strip directives
    nuxt.hook('vite:extendConfig', (config) => {
      type VueConfig = { template?: { compilerOptions?: { nodeTransforms?: NodeTransform[] } } }
      if (!config.vue) {
        (config as { vue?: VueConfig }).vue = {}
      }
      const vueConfig = config.vue as VueConfig
      vueConfig.template = vueConfig.template || {}
      vueConfig.template.compilerOptions = vueConfig.template.compilerOptions || {}

      const existingTransforms = vueConfig.template.compilerOptions.nodeTransforms || []

      const datapowerTransform: NodeTransform = (node) => {
        if (node.type !== 1) return // Element node type
        if (!('props' in node)) return

        const elementNode = node as { props: Array<{ type: number; name: string; exp?: unknown; loc: unknown }> }
        const newProps: Array<{ type: number; name: string; exp?: unknown; loc: unknown; arg?: unknown; modifiers?: string[] }> = []

        for (const prop of elementNode.props) {
          // Handle directives (type 7)
          if (prop.type === 7) {
            const attrName = directiveToAttr[prop.name]

            if (attrName) {
              // This is one of our directives
              if (allowedAttrs.includes(attrName)) {
                // Transform directive to v-bind with data-test-* attribute
                newProps.push({
                  type: 7,
                  name: 'bind',
                  exp: prop.exp,
                  loc: prop.loc,
                  arg: {
                    type: 4,
                    content: attrName,
                    isStatic: true,
                    constType: 3,
                    loc: prop.loc
                  },
                  modifiers: []
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

        elementNode.props = newProps as typeof elementNode.props
      }

      vueConfig.template.compilerOptions.nodeTransforms = [
        ...existingTransforms,
        datapowerTransform
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

import type { DataPowerPlugin } from './types'

declare module '#app' {
  interface NuxtApp {
    vueApp: {
      directive: (name: string, definition: object) => void
    }
    $datapower: DataPowerPlugin
  }

  export function defineNuxtPlugin<T>(plugin: (nuxtApp: NuxtApp) => T): T
  export function useRuntimeConfig(): {
    public: {
      datapower: {
        allowedAttributes: string[]
        environment: string
        enabled: boolean
      }
    }
  }
}

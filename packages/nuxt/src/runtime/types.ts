/** DataPower plugin interface */
export interface DataPowerPlugin {
  tAttrs: (id?: string, classes?: string | string[], present?: boolean) => Record<string, string>
  tId: (id: string) => Record<string, string>
  tClass: (classes: string | string[]) => Record<string, string>
  tPresent: (present: boolean) => Record<string, string>
  allowedAttributes: string[]
  environment: string
  enabled: boolean
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $datapower: DataPowerPlugin
  }
}

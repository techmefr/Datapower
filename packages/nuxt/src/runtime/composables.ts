import { useNuxtApp } from '#app'

/**
 * DataPower composable - Test attributes utilities
 */
export const useDatapower = () => {
  const { $datapower } = useNuxtApp()

  return {
    /**
     * Generate all test attributes
     */
    tAttrs: $datapower.tAttrs,

    /**
     * Generate only data-test-id
     */
    tId: $datapower.tId,

    /**
     * Generate only data-test-class
     */
    tClass: $datapower.tClass,

    /**
     * Generate only data-test-present
     */
    tPresent: $datapower.tPresent,

    /**
     * List of allowed attributes
     */
    allowedAttributes: $datapower.allowedAttributes,

    /**
     * Current environment
     */
    environment: $datapower.environment,

    /**
     * Whether DataPower is enabled
     */
    enabled: $datapower.enabled
  }
}

export interface DataPowerConfig {
  /**
   * Attributes allowed per environment
   */
  environments: {
    development?: string[]
    test?: string[]
    production?: string[]
    staging?: string[]
    [key: string]: string[] | undefined
  }
}

export const DEFAULT_CONFIG: DataPowerConfig = {
  environments: {
    development: ['data-test-id', 'data-test-class', 'data-test-present'],
    test: ['data-test-id', 'data-test-class', 'data-test-present'],
    production: [],
    staging: ['data-test-id']
  }
}

/**
 * Get allowed attributes for current environment
 */
export function getAllowedAttributes(
  config: DataPowerConfig,
  environment: string
): string[] {
  return config.environments[environment] || []
}

/**
 * Check if an attribute should be stripped
 */
export function shouldStripAttribute(
  attributeName: string,
  allowedAttributes: string[]
): boolean {
  if (!attributeName.startsWith('data-test-')) return false
  return !allowedAttributes.includes(attributeName)
}

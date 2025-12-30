/**
 * Generate test attributes object
 */
export function generateTestAttrs(
  allowedAttributes: string[],
  id?: string,
  classes?: string | string[],
  present?: boolean
): Record<string, string> {
  const attrs: Record<string, string> = {}

  if (id && allowedAttributes.includes('data-test-id')) {
    attrs['data-test-id'] = id
  }

  if (classes && allowedAttributes.includes('data-test-class')) {
    attrs['data-test-class'] = Array.isArray(classes)
      ? classes.join(' ')
      : classes
  }

  if (present !== undefined && allowedAttributes.includes('data-test-present')) {
    attrs['data-test-present'] = String(present)
  }

  return attrs
}

/**
 * Create helpers for specific attributes
 */
export function createHelpers(allowedAttributes: string[]) {
  return {
    /**
     * Generate all attributes
     */
    attrs: (id?: string, classes?: string | string[], present?: boolean) => {
      return generateTestAttrs(allowedAttributes, id, classes, present)
    },

    /**
     * Generate only data-test-id
     */
    id: (id: string) => {
      if (!allowedAttributes.includes('data-test-id')) return {}
      return { 'data-test-id': id }
    },

    /**
     * Generate only data-test-class
     */
    class: (classes: string | string[]) => {
      if (!allowedAttributes.includes('data-test-class')) return {}
      return {
        'data-test-class': Array.isArray(classes) ? classes.join(' ') : classes
      }
    },

    /**
     * Generate only data-test-present
     */
    present: (present: boolean) => {
      if (!allowedAttributes.includes('data-test-present')) return {}
      return { 'data-test-present': String(present) }
    },

    /**
     * Check if attribute is allowed
     */
    isAllowed: (attr: string) => allowedAttributes.includes(attr)
  }
}

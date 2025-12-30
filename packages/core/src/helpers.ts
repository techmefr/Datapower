/** Test attributes record type */
export type TestAttrs = Record<string, string>

/** DataPower helpers interface */
export interface DataPowerHelpers {
  attrs: (id?: string, classes?: string | string[], present?: boolean) => TestAttrs
  id: (id: string) => TestAttrs
  class: (classes: string | string[]) => TestAttrs
  present: (present: boolean) => TestAttrs
  isAllowed: (attr: string) => boolean
}

/**
 * Generate test attributes object
 */
export function generateTestAttrs(
  allowedAttributes: string[],
  id?: string,
  classes?: string | string[],
  present?: boolean
): TestAttrs {
  const attrs: TestAttrs = {}

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
export function createHelpers(allowedAttributes: string[]): DataPowerHelpers {
  return {
    attrs: (id?: string, classes?: string | string[], present?: boolean): TestAttrs => {
      return generateTestAttrs(allowedAttributes, id, classes, present)
    },

    id: (id: string): TestAttrs => {
      if (!allowedAttributes.includes('data-test-id')) return {}
      return { 'data-test-id': id }
    },

    class: (classes: string | string[]): TestAttrs => {
      if (!allowedAttributes.includes('data-test-class')) return {}
      return {
        'data-test-class': Array.isArray(classes) ? classes.join(' ') : classes
      }
    },

    present: (present: boolean): TestAttrs => {
      if (!allowedAttributes.includes('data-test-present')) return {}
      return { 'data-test-present': String(present) }
    },

    isAllowed: (attr: string): boolean => allowedAttributes.includes(attr)
  }
}

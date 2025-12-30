/**
 * Mapping between Vue directives and HTML attributes
 * SINGLE SOURCE OF TRUTH
 */
export const DIRECTIVE_MAPPING = {
  'v-t-id': 'data-test-id',
  'v-t-class': 'data-test-class',
  'v-t-present': 'data-test-present'
} as const

export type VueDirective = keyof typeof DIRECTIVE_MAPPING
export type DataAttribute = typeof DIRECTIVE_MAPPING[VueDirective]

/**
 * Get Vue directive from data attribute
 */
export function getDirectiveFromAttribute(attr: DataAttribute): VueDirective | undefined {
  return Object.entries(DIRECTIVE_MAPPING).find(
    ([_, value]) => value === attr
  )?.[0] as VueDirective | undefined
}

/**
 * Get data attribute from Vue directive
 */
export function getAttributeFromDirective(directive: VueDirective): DataAttribute {
  return DIRECTIVE_MAPPING[directive]
}

/**
 * Get all possible directives
 */
export function getAllDirectives(): VueDirective[] {
  return Object.keys(DIRECTIVE_MAPPING) as VueDirective[]
}

/**
 * Determine which directives should be stripped
 */
export function getDirectivesToStrip(allowedAttributes: string[]): VueDirective[] {
  return getAllDirectives().filter(directive => {
    const attr = DIRECTIVE_MAPPING[directive]
    return !allowedAttributes.includes(attr)
  })
}

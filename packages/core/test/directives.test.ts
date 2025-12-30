import { describe, it, expect } from 'vitest'
import {
  DIRECTIVE_MAPPING,
  getDirectiveFromAttribute,
  getAttributeFromDirective,
  getAllDirectives,
  getDirectivesToStrip
} from '../src/directives'

describe('directives', () => {
  describe('DIRECTIVE_MAPPING', () => {
    it('should map v-t-id to data-test-id', () => {
      expect(DIRECTIVE_MAPPING['v-t-id']).toBe('data-test-id')
    })

    it('should map v-t-class to data-test-class', () => {
      expect(DIRECTIVE_MAPPING['v-t-class']).toBe('data-test-class')
    })

    it('should map v-t-present to data-test-present', () => {
      expect(DIRECTIVE_MAPPING['v-t-present']).toBe('data-test-present')
    })

    it('should have exactly 3 mappings', () => {
      expect(Object.keys(DIRECTIVE_MAPPING)).toHaveLength(3)
    })
  })

  describe('getDirectiveFromAttribute', () => {
    it('should return v-t-id for data-test-id', () => {
      expect(getDirectiveFromAttribute('data-test-id')).toBe('v-t-id')
    })

    it('should return v-t-class for data-test-class', () => {
      expect(getDirectiveFromAttribute('data-test-class')).toBe('v-t-class')
    })

    it('should return v-t-present for data-test-present', () => {
      expect(getDirectiveFromAttribute('data-test-present')).toBe('v-t-present')
    })

    it('should return undefined for unknown attribute', () => {
      expect(getDirectiveFromAttribute('data-test-unknown' as any)).toBeUndefined()
    })
  })

  describe('getAttributeFromDirective', () => {
    it('should return data-test-id for v-t-id', () => {
      expect(getAttributeFromDirective('v-t-id')).toBe('data-test-id')
    })

    it('should return data-test-class for v-t-class', () => {
      expect(getAttributeFromDirective('v-t-class')).toBe('data-test-class')
    })

    it('should return data-test-present for v-t-present', () => {
      expect(getAttributeFromDirective('v-t-present')).toBe('data-test-present')
    })
  })

  describe('getAllDirectives', () => {
    it('should return all directive names', () => {
      const directives = getAllDirectives()
      expect(directives).toContain('v-t-id')
      expect(directives).toContain('v-t-class')
      expect(directives).toContain('v-t-present')
      expect(directives).toHaveLength(3)
    })
  })

  describe('getDirectivesToStrip', () => {
    it('should return all directives when no attributes allowed', () => {
      const toStrip = getDirectivesToStrip([])
      expect(toStrip).toContain('v-t-id')
      expect(toStrip).toContain('v-t-class')
      expect(toStrip).toContain('v-t-present')
      expect(toStrip).toHaveLength(3)
    })

    it('should return empty array when all attributes allowed', () => {
      const toStrip = getDirectivesToStrip([
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ])
      expect(toStrip).toHaveLength(0)
    })

    it('should return correct directives to strip for partial allowlist', () => {
      const toStrip = getDirectivesToStrip(['data-test-id'])
      expect(toStrip).not.toContain('v-t-id')
      expect(toStrip).toContain('v-t-class')
      expect(toStrip).toContain('v-t-present')
      expect(toStrip).toHaveLength(2)
    })
  })
})

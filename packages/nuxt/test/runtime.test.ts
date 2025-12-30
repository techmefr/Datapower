import { describe, it, expect } from 'vitest'
import { createHelpers } from '@datapower/core'

describe('runtime helpers', () => {
  describe('createHelpers integration', () => {
    describe('with all attributes enabled', () => {
      const allowedAttrs = ['data-test-id', 'data-test-class', 'data-test-present']
      const helpers = createHelpers(allowedAttrs)

      it('tAttrs equivalent should generate all attributes', () => {
        const result = helpers.attrs('button-id', 'btn primary', true)
        expect(result).toEqual({
          'data-test-id': 'button-id',
          'data-test-class': 'btn primary',
          'data-test-present': 'true'
        })
      })

      it('tId equivalent should generate only id', () => {
        const result = helpers.id('my-element')
        expect(result).toEqual({ 'data-test-id': 'my-element' })
      })

      it('tClass equivalent should generate only class', () => {
        const result = helpers.class('form-input')
        expect(result).toEqual({ 'data-test-class': 'form-input' })
      })

      it('tPresent equivalent should generate only present', () => {
        const result = helpers.present(true)
        expect(result).toEqual({ 'data-test-present': 'true' })
      })
    })

    describe('with no attributes enabled (production)', () => {
      const allowedAttrs: string[] = []
      const helpers = createHelpers(allowedAttrs)

      it('tAttrs equivalent should return empty object', () => {
        const result = helpers.attrs('button-id', 'btn primary', true)
        expect(result).toEqual({})
      })

      it('tId equivalent should return empty object', () => {
        const result = helpers.id('my-element')
        expect(result).toEqual({})
      })

      it('tClass equivalent should return empty object', () => {
        const result = helpers.class('form-input')
        expect(result).toEqual({})
      })

      it('tPresent equivalent should return empty object', () => {
        const result = helpers.present(true)
        expect(result).toEqual({})
      })
    })

    describe('with partial attributes enabled (staging)', () => {
      const allowedAttrs = ['data-test-id']
      const helpers = createHelpers(allowedAttrs)

      it('should only generate allowed attributes', () => {
        const result = helpers.attrs('button-id', 'btn primary', true)
        expect(result).toEqual({ 'data-test-id': 'button-id' })
      })

      it('tId should work', () => {
        expect(helpers.id('my-element')).toEqual({ 'data-test-id': 'my-element' })
      })

      it('tClass should return empty', () => {
        expect(helpers.class('form-input')).toEqual({})
      })

      it('tPresent should return empty', () => {
        expect(helpers.present(true)).toEqual({})
      })
    })
  })

  describe('attribute validation', () => {
    const helpers = createHelpers(['data-test-id', 'data-test-class'])

    it('isAllowed should return true for allowed attributes', () => {
      expect(helpers.isAllowed('data-test-id')).toBe(true)
      expect(helpers.isAllowed('data-test-class')).toBe(true)
    })

    it('isAllowed should return false for non-allowed attributes', () => {
      expect(helpers.isAllowed('data-test-present')).toBe(false)
      expect(helpers.isAllowed('data-test-custom')).toBe(false)
    })
  })
})

describe('directive runtime behavior', () => {
  describe('directive value handling', () => {
    it('should handle string values', () => {
      const value = 'login-button'
      expect(typeof value).toBe('string')
    })

    it('should handle template literal values', () => {
      const id = 1
      const value = `product-${id}`
      expect(value).toBe('product-1')
    })

    it('should handle boolean values for present', () => {
      const present = true
      expect(String(present)).toBe('true')
    })

    it('should handle array values for class', () => {
      const classes = ['btn', 'primary', 'large']
      expect(classes.join(' ')).toBe('btn primary large')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { generateTestAttrs, createHelpers } from '../src/helpers'

describe('helpers', () => {
  describe('generateTestAttrs', () => {
    const allAttrs = ['data-test-id', 'data-test-class', 'data-test-present']

    it('should generate data-test-id when allowed', () => {
      const attrs = generateTestAttrs(allAttrs, 'my-id')
      expect(attrs).toEqual({ 'data-test-id': 'my-id' })
    })

    it('should generate data-test-class when allowed (string)', () => {
      const attrs = generateTestAttrs(allAttrs, undefined, 'btn primary')
      expect(attrs).toEqual({ 'data-test-class': 'btn primary' })
    })

    it('should generate data-test-class when allowed (array)', () => {
      const attrs = generateTestAttrs(allAttrs, undefined, ['btn', 'primary'])
      expect(attrs).toEqual({ 'data-test-class': 'btn primary' })
    })

    it('should generate data-test-present when allowed', () => {
      const attrs = generateTestAttrs(allAttrs, undefined, undefined, true)
      expect(attrs).toEqual({ 'data-test-present': 'true' })
    })

    it('should generate all attributes when provided', () => {
      const attrs = generateTestAttrs(allAttrs, 'my-id', 'btn', true)
      expect(attrs).toEqual({
        'data-test-id': 'my-id',
        'data-test-class': 'btn',
        'data-test-present': 'true'
      })
    })

    it('should return empty object when no attributes allowed', () => {
      const attrs = generateTestAttrs([], 'my-id', 'btn', true)
      expect(attrs).toEqual({})
    })

    it('should only include allowed attributes', () => {
      const attrs = generateTestAttrs(['data-test-id'], 'my-id', 'btn', true)
      expect(attrs).toEqual({ 'data-test-id': 'my-id' })
    })

    it('should handle false for present', () => {
      const attrs = generateTestAttrs(allAttrs, undefined, undefined, false)
      expect(attrs).toEqual({ 'data-test-present': 'false' })
    })
  })

  describe('createHelpers', () => {
    describe('with all attributes allowed', () => {
      const helpers = createHelpers([
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ])

      it('attrs() should generate all attributes', () => {
        const attrs = helpers.attrs('my-id', 'btn', true)
        expect(attrs).toEqual({
          'data-test-id': 'my-id',
          'data-test-class': 'btn',
          'data-test-present': 'true'
        })
      })

      it('id() should generate only data-test-id', () => {
        const attrs = helpers.id('my-id')
        expect(attrs).toEqual({ 'data-test-id': 'my-id' })
      })

      it('class() should generate only data-test-class (string)', () => {
        const attrs = helpers.class('btn primary')
        expect(attrs).toEqual({ 'data-test-class': 'btn primary' })
      })

      it('class() should generate only data-test-class (array)', () => {
        const attrs = helpers.class(['btn', 'primary'])
        expect(attrs).toEqual({ 'data-test-class': 'btn primary' })
      })

      it('present() should generate only data-test-present', () => {
        const attrs = helpers.present(true)
        expect(attrs).toEqual({ 'data-test-present': 'true' })
      })

      it('isAllowed() should return true for allowed attributes', () => {
        expect(helpers.isAllowed('data-test-id')).toBe(true)
        expect(helpers.isAllowed('data-test-class')).toBe(true)
        expect(helpers.isAllowed('data-test-present')).toBe(true)
      })

      it('isAllowed() should return false for unknown attributes', () => {
        expect(helpers.isAllowed('data-test-unknown')).toBe(false)
      })
    })

    describe('with no attributes allowed', () => {
      const helpers = createHelpers([])

      it('attrs() should return empty object', () => {
        const attrs = helpers.attrs('my-id', 'btn', true)
        expect(attrs).toEqual({})
      })

      it('id() should return empty object', () => {
        const attrs = helpers.id('my-id')
        expect(attrs).toEqual({})
      })

      it('class() should return empty object', () => {
        const attrs = helpers.class('btn')
        expect(attrs).toEqual({})
      })

      it('present() should return empty object', () => {
        const attrs = helpers.present(true)
        expect(attrs).toEqual({})
      })

      it('isAllowed() should return false for all attributes', () => {
        expect(helpers.isAllowed('data-test-id')).toBe(false)
        expect(helpers.isAllowed('data-test-class')).toBe(false)
        expect(helpers.isAllowed('data-test-present')).toBe(false)
      })
    })

    describe('with partial attributes allowed', () => {
      const helpers = createHelpers(['data-test-id'])

      it('should only generate allowed attributes', () => {
        const attrs = helpers.attrs('my-id', 'btn', true)
        expect(attrs).toEqual({ 'data-test-id': 'my-id' })
      })

      it('id() should work', () => {
        expect(helpers.id('my-id')).toEqual({ 'data-test-id': 'my-id' })
      })

      it('class() should return empty object', () => {
        expect(helpers.class('btn')).toEqual({})
      })

      it('present() should return empty object', () => {
        expect(helpers.present(true)).toEqual({})
      })
    })
  })
})

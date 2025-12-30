import { describe, it, expect } from 'vitest'
import {
  DEFAULT_CONFIG,
  getAllowedAttributes,
  shouldStripAttribute,
  type DataPowerConfig
} from '../src/config'

describe('config', () => {
  describe('DEFAULT_CONFIG', () => {
    it('should have development environment with all attributes', () => {
      expect(DEFAULT_CONFIG.environments.development).toEqual([
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ])
    })

    it('should have test environment with all attributes', () => {
      expect(DEFAULT_CONFIG.environments.test).toEqual([
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ])
    })

    it('should have empty production environment', () => {
      expect(DEFAULT_CONFIG.environments.production).toEqual([])
    })

    it('should have staging environment with only data-test-id', () => {
      expect(DEFAULT_CONFIG.environments.staging).toEqual(['data-test-id'])
    })
  })

  describe('getAllowedAttributes', () => {
    it('should return allowed attributes for development', () => {
      const attrs = getAllowedAttributes(DEFAULT_CONFIG, 'development')
      expect(attrs).toEqual([
        'data-test-id',
        'data-test-class',
        'data-test-present'
      ])
    })

    it('should return empty array for production', () => {
      const attrs = getAllowedAttributes(DEFAULT_CONFIG, 'production')
      expect(attrs).toEqual([])
    })

    it('should return empty array for unknown environment', () => {
      const attrs = getAllowedAttributes(DEFAULT_CONFIG, 'unknown')
      expect(attrs).toEqual([])
    })

    it('should work with custom config', () => {
      const customConfig: DataPowerConfig = {
        environments: {
          custom: ['data-test-id', 'data-test-custom']
        }
      }
      const attrs = getAllowedAttributes(customConfig, 'custom')
      expect(attrs).toEqual(['data-test-id', 'data-test-custom'])
    })
  })

  describe('shouldStripAttribute', () => {
    const allowedAttrs = ['data-test-id']

    it('should return false for non data-test attributes', () => {
      expect(shouldStripAttribute('class', allowedAttrs)).toBe(false)
      expect(shouldStripAttribute('id', allowedAttrs)).toBe(false)
      expect(shouldStripAttribute('data-custom', allowedAttrs)).toBe(false)
    })

    it('should return false for allowed data-test attributes', () => {
      expect(shouldStripAttribute('data-test-id', allowedAttrs)).toBe(false)
    })

    it('should return true for non-allowed data-test attributes', () => {
      expect(shouldStripAttribute('data-test-class', allowedAttrs)).toBe(true)
      expect(shouldStripAttribute('data-test-present', allowedAttrs)).toBe(true)
    })

    it('should strip all data-test attributes when none allowed', () => {
      const noAttrs: string[] = []
      expect(shouldStripAttribute('data-test-id', noAttrs)).toBe(true)
      expect(shouldStripAttribute('data-test-class', noAttrs)).toBe(true)
    })
  })
})

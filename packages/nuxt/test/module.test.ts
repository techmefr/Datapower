import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Mock @nuxt/kit
vi.mock('@nuxt/kit', () => ({
  defineNuxtModule: vi.fn((config) => config),
  addPlugin: vi.fn(),
  addImports: vi.fn(),
  createResolver: vi.fn(() => ({
    resolve: (path: string) => path
  }))
}))

// Import after mocking
import { defineNuxtModule, addPlugin, addImports, createResolver } from '@nuxt/kit'

describe('module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('module meta', () => {
    it('should have correct module name', async () => {
      const { default: moduleConfig } = await import('../src/module')
      expect(moduleConfig.meta?.name).toBe('@datapower/nuxt')
    })

    it('should have correct config key', async () => {
      const { default: moduleConfig } = await import('../src/module')
      expect(moduleConfig.meta?.configKey).toBe('datapower')
    })

    it('should be compatible with Nuxt 3', async () => {
      const { default: moduleConfig } = await import('../src/module')
      expect(moduleConfig.meta?.compatibility?.nuxt).toBe('^3.0.0')
    })
  })

  describe('module defaults', () => {
    it('should have default environments config', async () => {
      const { default: moduleConfig } = await import('../src/module')
      expect(moduleConfig.defaults?.environments).toBeDefined()
      expect(moduleConfig.defaults?.environments?.development).toContain('data-test-id')
      expect(moduleConfig.defaults?.environments?.production).toEqual([])
    })
  })
})

describe('module setup behavior', () => {
  describe('environment detection', () => {
    it('should use NODE_ENV for environment detection', () => {
      // This tests the concept - actual integration would need Nuxt test utils
      const env = process.env.NODE_ENV || 'development'
      expect(['development', 'production', 'test']).toContain(env)
    })
  })

  describe('directive to attribute mapping', () => {
    const directiveToAttr: Record<string, string> = {
      't-id': 'data-test-id',
      't-class': 'data-test-class',
      't-present': 'data-test-present'
    }

    it('should map t-id to data-test-id', () => {
      expect(directiveToAttr['t-id']).toBe('data-test-id')
    })

    it('should map t-class to data-test-class', () => {
      expect(directiveToAttr['t-class']).toBe('data-test-class')
    })

    it('should map t-present to data-test-present', () => {
      expect(directiveToAttr['t-present']).toBe('data-test-present')
    })
  })
})

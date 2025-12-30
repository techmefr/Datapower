# @datapower/core

> Framework-agnostic test attributes utilities

## Installation

```bash
npm install @datapower/core
```

## Usage

```ts
import {
  createHelpers,
  getAllowedAttributes,
  DEFAULT_CONFIG
} from '@datapower/core'

// Get allowed attributes for current environment
const allowedAttrs = getAllowedAttributes(DEFAULT_CONFIG, 'development')

// Create helpers
const helpers = createHelpers(allowedAttrs)

// Generate test attributes
helpers.id('my-button')        // { 'data-test-id': 'my-button' }
helpers.class('btn primary')   // { 'data-test-class': 'btn primary' }
helpers.attrs('btn', 'primary', true) // Combined attributes
```

## API

### Configuration

- `DataPowerConfig` - Configuration type
- `DEFAULT_CONFIG` - Default configuration
- `getAllowedAttributes(config, environment)` - Get allowed attributes for environment
- `shouldStripAttribute(attr, allowedAttributes)` - Check if attribute should be stripped

### Directives

- `DIRECTIVE_MAPPING` - Mapping between Vue directives and HTML attributes
- `getDirectivesToStrip(allowedAttributes)` - Get directives to strip

### Helpers

- `createHelpers(allowedAttributes)` - Create attribute generation helpers
- `generateTestAttrs(allowedAttributes, id?, classes?, present?)` - Generate attributes

## License

MIT

<template>
  <div class="container">
    <header>
      <h1>DataPower Playground</h1>
      <p class="subtitle">Test attributes with build-time stripping</p>
    </header>

    <div class="info-card">
      <h3>Current Configuration</h3>
      <div class="info-grid">
        <div>
          <strong>Environment:</strong>
          <span class="badge">{{ environment }}</span>
        </div>
        <div>
          <strong>Status:</strong>
          <span :class="['badge', enabled ? 'badge-success' : 'badge-disabled']">
            {{ enabled ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
        <div>
          <strong>Allowed Attributes:</strong>
          <code>{{ allowedAttributes.join(', ') || 'none' }}</code>
        </div>
      </div>
    </div>

    <hr>

    <!-- Example 1: Directives -->
    <section class="example">
      <h2>1. Vue Directives</h2>
      <p>Use <code>v-t-id</code>, <code>v-t-class</code>, <code>v-t-present</code></p>

      <form
        v-t-id="'login-form'"
        v-t-class="'form'"
        class="demo-form"
        @submit.prevent="handleLogin"
      >
        <input
          v-t-id="'login-email'"
          v-t-class="'form-input'"
          v-model="email"
          type="email"
          placeholder="Email"
          class="input"
        />

        <input
          v-t-id="'login-password'"
          v-t-class="'form-input'"
          v-model="password"
          type="password"
          placeholder="Password"
          class="input"
        />

        <button
          v-t-id="'login-submit'"
          v-t-class="'form-button primary'"
          v-t-present="true"
          type="submit"
          class="btn btn-primary"
        >
          Login
        </button>
      </form>

      <div class="code-preview">
        <strong>Code:</strong>
        <pre><code>&lt;button v-t-id="'login-submit'" v-t-class="'form-button'"&gt;</code></pre>
        <strong>HTML in dev:</strong>
        <pre><code>&lt;button data-test-id="login-submit" data-test-class="form-button"&gt;</code></pre>
        <strong>HTML in prod:</strong>
        <pre><code>&lt;button&gt;</code></pre>
      </div>
    </section>

    <hr>

    <!-- Example 2: Composable -->
    <section class="example">
      <h2>2. Composable</h2>
      <p>Use <code>tAttrs()</code>, <code>tId()</code>, <code>tClass()</code></p>

      <div class="button-group">
        <button
          v-bind="tAttrs('composable-all', 'button primary', true)"
          class="btn btn-primary"
        >
          tAttrs() - All
        </button>

        <button
          v-bind="tId('composable-id')"
          class="btn btn-secondary"
        >
          tId() - ID only
        </button>

        <button
          v-bind="tClass('button secondary')"
          class="btn btn-secondary"
        >
          tClass() - Class only
        </button>
      </div>

      <div class="code-preview">
        <strong>Code:</strong>
        <pre><code>&lt;button v-bind="tAttrs('submit', 'button', true)"&gt;</code></pre>
      </div>
    </section>

    <hr>

    <!-- Example 3: Dynamic List -->
    <section class="example">
      <h2>3. Dynamic Product List</h2>
      <p>Test with dynamic IDs and classes</p>

      <div v-t-class="'product-list'" class="product-grid">
        <div
          v-for="product in products"
          :key="product.id"
          v-t-id="`product-${product.id}`"
          v-t-class="`product-card ${product.category}`"
          class="product-card"
        >
          <h3>{{ product.name }}</h3>
          <p class="price">${{ product.price }}</p>
          <span class="category">{{ product.category }}</span>
        </div>
      </div>

      <div class="code-preview">
        <strong>Playwright test:</strong>
        <pre><code>const card = page.locator('[data-test-id="product-2"]')
const allCards = page.locator('[data-test-class~="product-card"]')
await expect(allCards).toHaveCount(3)</code></pre>
      </div>
    </section>

    <hr>

    <!-- Example 4: Feature Flag -->
    <section class="example">
      <h2>4. Feature Flags</h2>
      <p>Test with <code>v-t-present</code></p>

      <div class="feature-demo">
        <div
          v-t-id="'premium-feature'"
          v-t-class="'feature premium'"
          v-t-present="isPremium"
          :class="['feature-card', { premium: isPremium }]"
        >
          <h3>Premium Dashboard</h3>
          <p>Status: {{ isPremium ? 'Active' : 'Inactive' }}</p>
          <button class="btn btn-sm" @click="isPremium = !isPremium">
            Toggle (current: {{ isPremium }})
          </button>
        </div>
      </div>

      <div class="code-preview">
        <strong>Playwright test:</strong>
        <pre><code>const feature = page.locator('[data-test-id="premium-feature"]')
await expect(feature).toHaveAttribute('data-test-present', 'true')</code></pre>
      </div>
    </section>

    <hr>

    <!-- Example 5: Manual Attributes -->
    <section class="example">
      <h2>5. Manual Attributes</h2>
      <p>Writing attributes manually also works (and gets stripped in prod)</p>

      <button
        data-test-id="manual-button"
        data-test-class="button manual"
        class="btn btn-secondary"
      >
        Manual Button
      </button>

      <div class="code-preview">
        <strong>Code:</strong>
        <pre><code>&lt;button data-test-id="manual" data-test-class="button"&gt;</code></pre>
        <strong>Note:</strong> These are also stripped in production!
      </div>
    </section>

    <hr>

    <footer class="footer">
      <p><strong>Tip:</strong> Open DevTools and inspect elements to see the attributes</p>
      <p><strong>Production:</strong> Run <code>NODE_ENV=production pnpm build</code> to verify stripping</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { tAttrs, tId, tClass, allowedAttributes, environment, enabled } = useDatapower()

const email = ref('')
const password = ref('')
const isPremium = ref(true)

const products = ref([
  { id: 1, name: 'Laptop Pro', price: 1299, category: 'electronics' },
  { id: 2, name: 'Headphones', price: 199, category: 'electronics' },
  { id: 3, name: 'Book: Vue 3', price: 29, category: 'books' }
])

function handleLogin() {
  console.log('Login:', { email: email.value, password: password.value })
  alert(`Login attempt: ${email.value}`)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.info-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-disabled {
  background: #f8d7da;
  color: #721c24;
}

.example {
  margin: 2rem 0;
}

.example h2 {
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.example > p {
  color: #666;
  margin: 0.5rem 0 1.5rem 0;
}

code {
  background: #f1f3f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'SF Mono', 'Courier New', monospace;
  font-size: 0.9rem;
}

.demo-form {
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.product-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.product-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.product-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #667eea;
  margin: 0.5rem 0;
}

.category {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: #f1f3f5;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
}

.feature-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 350px;
  transition: all 0.3s;
}

.feature-card.premium {
  border-color: #ffc107;
  background: linear-gradient(135deg, #fffbeb 0%, #fff 100%);
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
}

.code-preview {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1.25rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  overflow-x: auto;
}

.code-preview strong {
  display: block;
  color: #4ec9b0;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.code-preview pre {
  margin: 0.25rem 0 0.75rem 0;
}

.code-preview code {
  background: transparent;
  color: #ce9178;
  padding: 0;
  font-size: 0.85rem;
}

hr {
  border: none;
  border-top: 2px solid #e9ecef;
  margin: 2.5rem 0;
}

.footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
  color: #666;
}

.footer p {
  margin: 0.5rem 0;
}

@media (max-width: 600px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>

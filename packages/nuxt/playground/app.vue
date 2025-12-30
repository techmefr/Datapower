<template>
  <div class="container">
    <h1>DataPower Playground</h1>

    <div class="info">
      <p><strong>Environment:</strong> {{ environment }}</p>
      <p><strong>Enabled:</strong> {{ enabled }}</p>
      <p><strong>Allowed:</strong> {{ allowedAttributes.join(', ') || 'none' }}</p>
    </div>

    <hr>

    <!-- Example 1: Login Form -->
    <section>
      <h2>Login Form (Directives)</h2>
      <form v-t-id="'login-form'" v-t-class="'form'" @submit.prevent="handleLogin">
        <input
          v-t-id="'login-email'"
          v-t-class="'form-input'"
          type="email"
          placeholder="Email"
          v-model="email"
        />

        <input
          v-t-id="'login-password'"
          v-t-class="'form-input'"
          type="password"
          placeholder="Password"
          v-model="password"
        />

        <button
          v-t-id="'login-submit'"
          v-t-class="'form-button primary'"
          v-t-present="true"
          type="submit"
        >
          Login
        </button>
      </form>
    </section>

    <hr>

    <!-- Example 2: Product List -->
    <section>
      <h2>Product List (Dynamic IDs)</h2>
      <div v-t-class="'product-list'">
        <div
          v-for="product in products"
          :key="product.id"
          v-t-id="`product-${product.id}`"
          v-t-class="'product-card'"
          class="product"
        >
          <h3>{{ product.name }}</h3>
          <p>${{ product.price }}</p>
        </div>
      </div>
    </section>

    <hr>

    <!-- Example 3: Composable Usage -->
    <section>
      <h2>Composable Usage</h2>
      <button v-bind="tAttrs('composable-button', 'button primary', true)">
        Click Me (Composable)
      </button>

      <input v-bind="tId('composable-input')" placeholder="Input with tId()" />
    </section>

    <hr>

    <!-- Example 4: Manual Attributes -->
    <section>
      <h2>Manual Attributes (also stripped in prod)</h2>
      <button
        data-test-id="manual-button"
        data-test-class="button secondary"
      >
        Manual Button
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
const { tAttrs, tId, allowedAttributes, environment, enabled } = useDatapower()

const email = ref('')
const password = ref('')

const products = ref([
  { id: 1, name: 'Product 1', price: 29.99 },
  { id: 2, name: 'Product 2', price: 49.99 },
  { id: 3, name: 'Product 3', price: 19.99 }
])

function handleLogin() {
  console.log('Login:', { email: email.value, password: password.value })
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.info p {
  margin: 0.5rem 0;
}

section {
  margin: 2rem 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

input, button {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  background: #007bff;
  color: white;
  cursor: pointer;
  border: none;
}

button:hover {
  background: #0056b3;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.product {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
}

hr {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #eee;
}
</style>

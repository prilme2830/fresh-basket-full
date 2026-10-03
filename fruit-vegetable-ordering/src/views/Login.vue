<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/authService.js";

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSubmit = () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Please enter username and password";
    return;
  }
  try {
    login({ username: username.value, password: password.value });
    window.dispatchEvent(new CustomEvent("auth-updated"));
    router.push("/");
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.error-message {
  color: var(--color-danger);
  margin-top: 10px;
  font-size: 14px;
}
</style>

<template>
  <div class="form-page">
    <div class="form-card">
      <h1>Welcome back</h1>
      <p class="form-subtitle">Log in to order fresh produce.</p>
      <form @submit.prevent="handleSubmit">
        <label>Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="Enter username"
          required
        />

        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
        />

        <p class="error-message">{{ errorMessage }}</p>

        <div class="form-actions">
          <button class="btn-primary" type="submit">Login</button>
        </div>
      </form>
      <div class="auth-footer">
        Don't have an account?
        <router-link to="/register">Create Account</router-link>
      </div>
      <div class="auth-footer">
        <router-link to="/forgot-password">Forgot Password?</router-link>
      </div>
    </div>
  </div>
</template>

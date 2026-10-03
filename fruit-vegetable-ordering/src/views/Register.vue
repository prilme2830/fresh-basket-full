<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../services/authService.js";

const router = useRouter();
const name = ref("");
const usernameInput = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

const handleSubmit = () => {
  if (
    !name.value ||
    !usernameInput.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  try {
    register({
      name: name.value,
      username: usernameInput.value,
      password: password.value,
    });
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
      <h1>Create Account</h1>
      <p class="form-subtitle">Join Fresh Basket in under a minute.</p>
      <form @submit.prevent="handleSubmit">
        <label>Full Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter your name"
          required
        />

        <label>Username</label>
        <input
          v-model="usernameInput"
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

        <label>Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password"
          required
        />

        <p class="error-message">{{ errorMessage }}</p>

        <div class="form-actions">
          <button class="btn-primary" type="submit">Create Account</button>
        </div>
      </form>
      <div class="auth-footer">
        Already have an account? <router-link to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="form-page">
    <div class="form-card">
      <h1>Forgot Password</h1>
      <p class="form-subtitle">Enter your username to reset your password.</p>

      <form v-if="!resetDone" @submit.prevent="handleSubmit">
        <label>Username</label>

        <input
          v-model="username"
          type="text"
          placeholder="Enter your username"
          required
        />

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div v-if="showNewPassword" class="form-group">
          <label>New Password</label>

          <input
            v-model="newPassword"
            type="password"
            placeholder="Enter new password"
            required
          />
        </div>

        <div class="form-actions">
          <button class="btn-primary" type="submit">
            {{ showNewPassword ? "Reset Password" : "Find Account" }}
          </button>

          <router-link to="/login" class="btn-cancel">Cancel</router-link>
        </div>
      </form>

      <div v-else class="reset-success">
        <p>Your password has been reset successfully.</p>

        <router-link to="/login" class="btn-primary">Login Now</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { findUser, resetPassword } from "../services/authService.js";

const username = ref("");
const newPassword = ref("");
const errorMessage = ref("");
const showNewPassword = ref(false);
const resetDone = ref(false);

const handleSubmit = () => {
  errorMessage.value = "";

  if (!showNewPassword.value) {
    const user = findUser(username.value);
    if (user) {
      showNewPassword.value = true;
    } else {
      errorMessage.value = "Username not found.";
    }
  } else {
    if (newPassword.value.length < 3) {
      errorMessage.value = "Password must be at least 3 characters.";
      return;
    }
    try {
      resetPassword(username.value, newPassword.value);
      resetDone.value = true;
    } catch (error) {
      errorMessage.value = error.message;
    }
  }
};
</script>

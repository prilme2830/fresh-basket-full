<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getCurrentUser, logout } from "../services/authService.js";

const router = useRouter();

const cartCount = ref(0);
const currentUser = ref(null);
const isLoggedIn = ref(false);

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cartCount.value = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function updateAuthStatus() {
  currentUser.value = getCurrentUser();
  isLoggedIn.value = !!currentUser.value;
}

function handleLogout() {
  logout();
  window.dispatchEvent(new CustomEvent("auth-updated"));
  router.push("/");
}

onMounted(() => {
  updateCartCount();
  updateAuthStatus();
  window.addEventListener("cart-updated", updateCartCount);
  window.addEventListener("auth-updated", updateAuthStatus);
});

onUnmounted(() => {
  window.removeEventListener("cart-updated", updateCartCount);
  window.removeEventListener("auth-updated", updateAuthStatus);
});
</script>

<template>
  <nav class="navbar">
    <router-link to="/" class="logo">Fresh Basket</router-link>

    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/products">Products</router-link>

      <template v-if="isLoggedIn">
        <router-link to="/cart">Cart <span class="cart-count">{{ cartCount }}</span></router-link>
        <router-link to="/orders">Orders</router-link>
        <span class="nav-user">Hi, {{ currentUser?.name }}</span>
        <button class="btn-logout" @click="handleLogout">Logout</button>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register" class="nav-cta">Sign Up</router-link>
      </template>
    </div>
  </nav>
</template>

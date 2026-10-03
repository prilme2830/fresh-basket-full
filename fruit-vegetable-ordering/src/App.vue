<template>
  <div>
    <Navbar />

    <main class="main-container">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>

    <footer>
      <p>Fruits & Vegetables Ordering System</p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>

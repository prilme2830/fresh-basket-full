<script setup>
import { ref, computed, onMounted } from "vue";

import { getCurrentUser, isAdmin } from "../services/authService.js";

const orders = ref([]);

const currentUser = ref(null);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month} ${day}, ${year} at ${hours}:${minutes}`;
};

const filteredOrders = computed(() => {
  if (isAdmin()) {
    return orders.value;
  }
  return orders.value.filter(
    (order) => order.userId === currentUser.value?.id
  );
});

onMounted(() => {
  currentUser.value = getCurrentUser();
  orders.value = JSON.parse(localStorage.getItem("orders")) || [];
});
</script>

<template>
  <div>
    <h1>Order History</h1>

    <div v-if="filteredOrders.length === 0" class="empty">No orders yet.</div>

    <div v-for="order in filteredOrders" :key="order.id" class="order-card">
      <div class="order-info">
        <h3>Order #{{ order.id }}</h3>
        <p class="order-customer">
          <strong>Customer:</strong> {{ order.userName || "Unknown" }}
        </p>
        <p>{{ formatDate(order.date) }}</p>
      </div>
      <div>
        <p>{{ order.items.length }} item(s)</p>
        <div class="order-items">
          <span v-for="item in order.items" :key="item.id"
            >{{ item.name }} ×{{ item.quantity }}</span
          >
        </div>
        <strong class="order-total">₱{{ order.total.toFixed(2) }}</strong>
        <div class="order-meta" v-if="order.paymentMethod">
          <p><strong>Payment Method:</strong> {{ order.paymentMethod }}</p>
          <p><strong>Address:</strong> {{ order.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
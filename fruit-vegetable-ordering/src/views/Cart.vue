<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import gcashQr from "../assets/gcash-placeholder.svg";
import { getCurrentUser } from "../services/authService.js";

const cart = ref([]);

const products = ref([]);

let dispatching = false;

const paymentMethod = ref("Cash on Delivery");

const address = ref("");

const loadData = () => {
  cart.value = JSON.parse(localStorage.getItem("cart")) || [];

  products.value = JSON.parse(localStorage.getItem("products")) || [];
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart.value));
  window.dispatchEvent(new CustomEvent("cart-updated"));
};

const updateCartCount = () => {
  if (dispatching) return;

  dispatching = true;

  window.dispatchEvent(new CustomEvent("cart-updated"));

  dispatching = false;
};

const unitStep = (item) => {
  return item.unit === "kg" ? 0.1 : 1;
};

const getItemStock = (item) => {
  const product = products.value.find((p) => p.id === item.id);
  if (!product) return Infinity;
  if (Array.isArray(product.unitOptions)) {
    const opt = product.unitOptions.find((o) => o.unit === item.unit);
    if (opt) return opt.stock;
  }
  return product.stock || Infinity;
};

const increase = (item) => {
  const step = unitStep(item);
  const stock = getItemStock(item);

  if (item.quantity + step <= stock) {
    item.quantity = Math.round((item.quantity + step) * 100) / 100;
  } else {
    alert("Not enough stock.");
  }

  saveCart();
};

const decrease = (item) => {
  const step = unitStep(item);

  const next = Math.round((item.quantity - step) * 100) / 100;

  if (next > 0) {
    item.quantity = next;
  } else {
    remove(item);
  }

  saveCart();
};

const remove = (item) => {
  cart.value = cart.value.filter(
    (i) => !(i.id === item.id && i.unit === item.unit),
  );

  saveCart();
};

const clearCart = () => {
  cart.value = [];

  saveCart();
};

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const placeOrder = () => {
  if (cart.value.length === 0) return;

  if (!paymentMethod.value) {
    alert("Please select a payment method.");
    return;
  }

  if (!address.value.trim()) {
    alert("Please enter your delivery address.");
    return;
  }

  const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

  cart.value.forEach((item) => {
    const product = storedProducts.find((p) => p.id === item.id);

    if (product) {
      if (Array.isArray(product.unitOptions)) {
        const opt = product.unitOptions.find((o) => o.unit === item.unit);
        if (opt) {
          opt.stock -= item.quantity;
        }
      } else {
        product.stock -= item.quantity;
      }
    }
  });

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const user = getCurrentUser();

  orders.unshift({
    id: Date.now(),

    date: new Date().toLocaleString(),

    items: JSON.parse(JSON.stringify(cart.value)),

    total: total.value,

    paymentMethod: paymentMethod.value,

    address: address.value,

    userId: user?.id || null,

    userName: user?.name || "Unknown",
  });

  localStorage.setItem("products", JSON.stringify(storedProducts));

  localStorage.setItem("orders", JSON.stringify(orders));

  cart.value = [];

  saveCart();

  paymentMethod.value = "Cash on Delivery";
  address.value = "";

  alert("Order placed successfully!");
};

onMounted(() => {
  loadData();

  window.addEventListener("cart-updated", updateCartCount);
});

onBeforeUnmount(() => {
  window.removeEventListener("cart-updated", updateCartCount);
});
</script>

<template>
  <div>
    <h1>Shopping Cart</h1>

    <div v-if="cart.length === 0" class="empty">
      Your cart is empty.

      <br /><br />

      <router-link to="/products" class="add-button">
        Shop Products
      </router-link>
    </div>

    <div v-else>
      <div v-for="item in cart" :key="item.id + '-' + item.unit" class="cart-item">
        <div class="item-info">
          <h3>
            {{ item.name }}
          </h3>

          <p>
            ₱{{ item.price.toFixed(2) }}
            <span v-if="item.unit === 'kg'">per kg</span>
            <span v-else-if="item.unit === 'box'">per box</span>
            <span v-else>each</span>
          </p>
        </div>

        <div class="quantity">
          <button @click="decrease(item)">−</button>

          <strong>
            {{ item.quantity }}
            <span v-if="item.unit === 'kg'"> kg</span>
            <span v-else-if="item.unit === 'box'"> box</span>
          </strong>

          <button @click="increase(item)">+</button>
        </div>

        <strong class="item-price"
          >₱{{ (item.price * item.quantity).toFixed(2) }}</strong
        >

        <button class="btn-delete" @click="remove(item)">Remove</button>
      </div>

      <div class="checkout-form">
        <div class="checkout-section">
          <h2>Order Summary</h2>

          <div class="order-summary-list">
            <div v-for="item in cart" :key="item.id + '-' + item.unit" class="order-summary-item">
              <span>{{ item.name }} ×{{ item.quantity }}{{ item.unit === 'kg' ? ' kg' : item.unit === 'box' ? ' box' : '' }}</span>

              <strong>₱{{ (item.price * item.quantity).toFixed(2) }}</strong>
            </div>
          </div>

          <div class="order-summary-total">
            <strong>Total: ₱{{ total.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="checkout-section">
          <h2>Payment Method</h2>

          <div class="payment-options">
            <label class="payment-option">
              <input
                type="radio"
                value="Cash on Delivery"
                v-model="paymentMethod"
              />
              Cash on Delivery
            </label>

            <label class="payment-option">
              <input type="radio" value="GCash" v-model="paymentMethod" />
              GCash
            </label>
          </div>

          <div v-if="paymentMethod === 'GCash'" class="gcash-details">
            <p class="gcash-title">Pay via GCash</p>

            <img :src="gcashQr" alt="GCash QR code" class="gcash-qr" />

            <p><strong>GCash Number:</strong> 0912 345 6789</p>

            <p class="gcash-note">
              Send the payment to the GCash number or scan the QR code above.
              Use your order reference as payment details.
            </p>
          </div>
        </div>

        <div class="checkout-section address-form">
          <h2>Delivery Address</h2>

          <label for="address">Address</label>

          <textarea
            id="address"
            v-model="address"
            placeholder="Enter your delivery address..."
          ></textarea>
        </div>

        <div class="checkout-actions">
          <button class="btn-order checkout-btn" @click="placeOrder">
            Place Order
          </button>

          <button class="btn-clear" @click="clearCart">Clear Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

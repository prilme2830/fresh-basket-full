<script setup>
import { ref, computed, onMounted } from "vue";
import ProductCard from "../components/ProductCard.vue";
import { isAdmin } from "../services/authService.js";
import appleImg from "../assets/apple.webp";
import bananaImg from "../assets/banana.jpg";
import orangeImg from "../assets/orange.jpg";
import carrotImg from "../assets/carrot.jpg";
import tomatoImg from "../assets/tomato.jpg";
import potatoImg from "../assets/potato.jpg";
import spinachImg from "../assets/spinach.jpg";
import broccoliImg from "../assets/broccoli.png";
import strawberryImg from "../assets/strawberry.webp";
import mangoImg from "../assets/manga.webp";

const products = ref([]);

const search = ref("");

const category = ref("All");

const isAdminUser = ref(false);

/* =========================
   LOAD PRODUCTS
========================= */

const loadProducts = () => {
  const savedProducts = localStorage.getItem("products");

  if (savedProducts) {
    products.value = JSON.parse(savedProducts);
  } else {
    products.value = [
      {
        id: 1,
        name: "Apple",
        category: "Fruit",
        price: 120,
        stock: 20,
        unit: "kg",
        image: appleImg,
        unitOptions: [
          { unit: "kg", price: 120, stock: 20 },
          { unit: "each", price: 15, stock: 100 },
          { unit: "box", price: 200, stock: 10 },
        ],
      },

      {
        id: 2,
        name: "Banana",
        category: "Fruit",
        price: 80,
        stock: 30,
        unit: "kg",
        image: bananaImg,
        unitOptions: [
          { unit: "kg", price: 80, stock: 30 },
          { unit: "each", price: 10, stock: 200 },
          { unit: "box", price: 150, stock: 15 },
        ],
      },

      {
        id: 3,
        name: "Orange",
        category: "Fruit",
        price: 100,
        stock: 25,
        unit: "kg",
        image: orangeImg,
        unitOptions: [
          { unit: "kg", price: 100, stock: 25 },
          { unit: "each", price: 20, stock: 80 },
          { unit: "box", price: 180, stock: 12 },
        ],
      },

      {
        id: 4,
        name: "Carrot",
        category: "Vegetable",
        price: 70,
        stock: 20,
        unit: "kg",
        boxSize: 500,
        image: carrotImg,
        unitOptions: [
          { unit: "kg", price: 70, stock: 20 },
          { unit: "each", price: 10, stock: 100 },
          { unit: "box", price: 150, stock: 15, boxSize: 500 },
        ],
      },

      {
        id: 5,
        name: "Tomato",
        category: "Vegetable",
        price: 90,
        stock: 25,
        unit: "each",
        image: tomatoImg,
        unitOptions: [
          { unit: "kg", price: 90, stock: 15 },
          { unit: "each", price: 15, stock: 80 },
          { unit: "box", price: 200, stock: 10, boxSize: 500 },
        ],
      },

      {
        id: 6,
        name: "Potato",
        category: "Vegetable",
        price: 60,
        stock: 40,
        unit: "kg",
        image: potatoImg,
        unitOptions: [
          { unit: "kg", price: 60, stock: 40 },
          { unit: "each", price: 8, stock: 200 },
          { unit: "box", price: 120, stock: 20, boxSize: 500 },
        ],
      },
      {
        id: 7,
        name: "Mango",
        category: "Fruit",
        price: 150,
        stock: 15,
        unit: "each",
        image: mangoImg,
        unitOptions: [
          { unit: "kg", price: 120, stock: 20 },
          { unit: "each", price: 150, stock: 15 },
          { unit: "box", price: 250, stock: 10, boxSize: 500 },
        ],
      },
      {
        id: 8,
        name: "Spinach",
        category: "Vegetable",
        price: 50,
        stock: 30,
        unit: "box",
        boxSize: 250,
        image: spinachImg,
        unitOptions: [
          { unit: "kg", price: 100, stock: 20 },
          { unit: "each", price: 10, stock: 100 },
          { unit: "box", price: 50, stock: 30, boxSize: 250 },
        ],
      },
      {
        id: 9,
        name: "Strawberry",
        category: "Fruit",
        price: 200,
        stock: 10,
        unit: "box",
        boxSize: 250,
        image: strawberryImg,
        unitOptions: [
          { unit: "kg", price: 400, stock: 5 },
          { unit: "each", price: 20, stock: 50 },
          { unit: "box", price: 200, stock: 10, boxSize: 250 },
        ],
      },
      {
        id: 10,
        name: "Broccoli",
        category: "Vegetable",
        price: 120,
        stock: 20,
        unit: "each",
        image: broccoliImg,
        unitOptions: [
          { unit: "kg", price: 200, stock: 10 },
          { unit: "each", price: 120, stock: 20 },
          { unit: "box", price: 250, stock: 5, boxSize: 500 },
        ],
      },
    ];

    saveProducts();
  }
};

/* =========================
   SAVE PRODUCTS
========================= */

const saveProducts = () => {
  localStorage.setItem("products", JSON.stringify(products.value));
};

const removeProduct = (id) => {
  products.value = products.value.filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products.value));
  alert("Product removed.");
};

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.value.toLowerCase());

    const matchesCategory =
      category.value === "All" || product.category === category.value;

    return matchesSearch && matchesCategory;
  });
});

/* =========================
   ADD TO CART
========================= */

const addToCart = (payload) => {
  const product =
    typeof payload === "object" && payload !== null ? payload : { ...payload };

  const qty = product.quantity ?? 1;
  const unit = product.unit || "each";
  const price = product.price;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(
    (item) => item.id === product.id && item.unit === unit,
  );

  if (existing) {
    if (existing.quantity + qty <= product.stock) {
      existing.quantity += qty;
    } else {
      alert("Not enough stock.");

      return;
    }
  } else {
    cart.push({
      id: product.id,

      name: product.name,

      price: price,

      quantity: qty,

      unit: unit,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart-updated"));

  alert(`${product.name} added to cart!`);
};

/* =========================
   START
========================= */

onMounted(() => {
  loadProducts();
  isAdminUser.value = isAdmin();
});
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Products</h1>
      <router-link v-if="isAdminUser" to="/add-product" class="btn-primary"
        >Add Product</router-link
      >
    </div>

    <div class="filters">
      <input v-model="search" type="text" placeholder="Search product..." />

      <select v-model="category">
        <option value="All">All</option>

        <option value="Fruit">Fruits</option>

        <option value="Vegetable">Vegetables</option>
      </select>
    </div>

    <div class="products-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :is-admin="isAdminUser"
        @add-to-cart="addToCart"
        @remove="removeProduct"
      />
    </div>

    <p v-if="filteredProducts.length === 0" class="empty">No products found.</p>
  </div>
</template>

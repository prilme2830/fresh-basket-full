<template>
  <div class="form-page">
    <div class="form-card">
      <h1>{{ editing ? "Edit Product" : "Add Product" }}</h1>

      <form @submit.prevent="saveProduct">
        <label> Product Name </label>

        <input
          v-model="form.name"
          type="text"
          placeholder="Example: Mango"
          required
        />

        <label> Category </label>

        <select v-model="form.category" required>
          <option value="">Select Category</option>

          <option value="Fruit">Fruit</option>

          <option value="Vegetable">Vegetable</option>
        </select>

        <label> Price </label>

        <input v-model.number="form.price" type="number" min="1" required />

        <label> Stock </label>

        <input v-model.number="form.stock" type="number" min="0" required />

        <label> Unit </label>

        <select v-model="form.unit" required>
          <option value="each">Each</option>
          <option value="kg">Per Kilo</option>
          <option value="box">Per Box</option>
        </select>

        <label v-if="form.unit === 'box'"> Box Size (g) </label>

        <input v-if="form.unit === 'box'" v-model.number="form.boxSize" type="number" min="1" placeholder="e.g. 250" />

        <div class="form-actions">
          <button class="btn-primary" type="submit">
            {{ editing ? "Update Product" : "Add Product" }}
          </button>

          <router-link to="/products" class="btn-cancel"> Cancel </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();

const editing = ref(false);

const products = ref([]);

const form = ref({
  name: "",

  category: "",

  price: 0,

  stock: 0,

  unit: "each",

  boxSize: "",
});

/* =========================
   LOAD
========================= */

const loadProducts = () => {
  products.value = JSON.parse(localStorage.getItem("products")) || [];
};

/* =========================
   SAVE
========================= */

const saveProducts = () => {
  localStorage.setItem("products", JSON.stringify(products.value));
};

/* =========================
   CREATE / UPDATE
========================= */

const saveProduct = () => {
  if (editing.value) {
    const id = Number(route.query.id);

    const index = products.value.findIndex((product) => product.id === id);

    if (index !== -1) {
      products.value[index] = {
        id,

        name: form.value.name,

        category: form.value.category,

        price: Number(form.value.price),

        stock: Number(form.value.stock),

        unit: form.value.unit,

        boxSize: form.value.unit === "box" ? Number(form.value.boxSize) : undefined,

        unitOptions: [{
          unit: form.value.unit,
          price: Number(form.value.price),
          stock: Number(form.value.stock),
          ...(form.value.unit === "box" ? { boxSize: Number(form.value.boxSize) } : {}),
        }],
      };
    }
  } else {
    products.value.push({
      id: Date.now(),

      name: form.value.name,

      category: form.value.category,

      price: Number(form.value.price),

      stock: Number(form.value.stock),

      unit: form.value.unit,

      boxSize: form.value.unit === "box" ? Number(form.value.boxSize) : undefined,

      unitOptions: [{
        unit: form.value.unit,
        price: Number(form.value.price),
        stock: Number(form.value.stock),
        ...(form.value.unit === "box" ? { boxSize: Number(form.value.boxSize) } : {}),
      }],
    });
  }

  saveProducts();

  alert(
    editing.value
      ? "Product updated successfully!"
      : "Product added successfully!",
  );

  router.push("/products");
};

/* =========================
   START
========================= */

onMounted(() => {
  loadProducts();

  if (route.query.id) {
    editing.value = true;

    const product = products.value.find(
      (product) => product.id === Number(route.query.id),
    );

    if (product) {
      const firstOpt =
        product.unitOptions && product.unitOptions.length > 0
          ? product.unitOptions[0]
          : {};

      form.value = {
        name: product.name,

        category: product.category,

        price: firstOpt.price ?? product.price ?? 0,

        stock: firstOpt.stock ?? product.stock ?? 0,

        unit: firstOpt.unit ?? product.unit ?? "each",

        boxSize: firstOpt.boxSize ?? product.boxSize ?? "",
      };
    }
  }
});
</script>


<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["add-to-cart", "remove"]);

const imgError = ref(false);

const imageSrc = computed(() => {
  if (imgError.value) return null;
  return props.product.image || null;
});

const onImgError = () => {
  imgError.value = true;
};

const unitOptions = computed(() => {
  if (Array.isArray(props.product.unitOptions) && props.product.unitOptions.length > 0) {
    return props.product.unitOptions;
  }
  const u = props.product.unit || "each";
  const p = props.product.price || 0;
  const s = props.product.stock || 0;
  return [{ unit: u, price: p, stock: s }];
});

const selectedOption = ref(unitOptions.value[0]);

watch(
  unitOptions,
  () => {
    const first = unitOptions.value[0];
    if (!unitOptions.value.find((o) => o.unit === selectedOption.value?.unit)) {
      selectedOption.value = first;
    }
  },
);

const quantity = ref(1);

const stepValue = computed(() => {
  return selectedOption.value?.unit === "kg" ? 0.1 : 1;
});

const minValue = computed(() => {
  return selectedOption.value?.unit === "kg" ? 0.1 : 1;
});

const unitLabel = computed(() => {
  const u = selectedOption.value?.unit;
  if (u === "kg") return "kg";
  if (u === "box") return "box";
  return "";
});

const priceLabel = computed(() => {
  const u = selectedOption.value?.unit;
  if (u === "kg") return `/kg`;
  if (u === "box") return `/box`;
  return "";
});

const handleRemove = () => {
  if (confirm(`Remove "${props.product.name}" from products?`)) {
    emit("remove", props.product.id);
  }
};

const handleSubmit = () => {
  emit("add-to-cart", {
    ...props.product,
    unit: selectedOption.value.unit,
    price: selectedOption.value.price,
    stock: selectedOption.value.stock,
    quantity: quantity.value,
  });
  quantity.value = selectedOption.value.unit === "kg" ? 1 : 1;
};

const handleQtyChange = (delta) => {
  const step = stepValue.value;
  const next = quantity.value + delta * step;
  if (next >= minValue.value && next <= selectedOption.value.stock) {
    quantity.value = next;
  }
};
</script>

<template>
  <div class="product-card">
    <div class="product-image-wrapper">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="product.name"
        class="product-image"
        loading="lazy"
        @error="onImgError"
      />
      <div v-else class="product-image-placeholder">{{ product.name }}</div>
    </div>

    <button
      v-if="isAdmin"
      class="product-card__remove"
      @click="handleRemove"
      title="Remove product"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
    </button>

    <h3>{{ product.name }}</h3>

    <span class="category-pill">{{ product.category }}</span>

    <p class="price">
      ₱{{ Number(selectedOption.price).toFixed(2) }}
      <span class="unit-price">{{ priceLabel }}</span>
    </p>

    <div
      class="stock-badge"
      :class="{
        low: selectedOption.stock <= 5 && selectedOption.stock > 0,
        out: selectedOption.stock === 0,
      }"
    >
      {{ selectedOption.stock === 0 ? "Out of Stock" : selectedOption.stock + (unitLabel ? " " + unitLabel + " left" : " left") }}
    </div>

    <div v-if="unitOptions.length > 1" class="unit-selector">
      <span class="unit-label">Buy by:</span>
      <button
        v-for="opt in unitOptions"
        :key="opt.unit"
        type="button"
        class="unit-btn"
        :class="{ active: selectedOption.unit === opt.unit }"
        @click="selectedOption = opt"
      >
        {{ opt.unit === "kg" ? "Kilo" : opt.unit === "box" ? "Box" : "Each" }}
      </button>
    </div>

    <div class="product-buttons">
      <div v-if="selectedOption.unit === 'kg'" class="qty-control">
        <button type="button" class="qty-btn" @click="handleQtyChange(-1)">−</button>
        <input
          type="number"
          min="0.1"
          step="0.1"
          v-model.number="quantity"
          class="qty-input"
        />
        <button type="button" class="qty-btn" @click="handleQtyChange(1)">+</button>
      </div>

      <button
        class="btn-cart"
        @click="handleSubmit"
        :disabled="selectedOption.stock <= 0"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

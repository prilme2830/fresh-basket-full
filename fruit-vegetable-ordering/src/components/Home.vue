<script setup>
import apple from "../assets/apple.webp";
import orange from "../assets/orange.jpg";
import carrot from "../assets/carrot.jpg";
import tomato from "../assets/tomato.jpg";
</script>

<template>
  <div class="home">
    <section class="hero">
      <div>
        <h1>Fresh <span>Fruits &amp; Vegetables</span> at your doorstep</h1>
        <p>
          Hand-picked produce at affordable prices. Browse, add to your basket,
          and pay with Cash on Delivery or GCash.
        </p>
        <div class="hero-actions">
          <router-link to="/products" class="hero-button">Shop Now</router-link>
        </div>
      </div>

      <div class="hero-collage">
        <img :src="apple" alt="Apples" />
        <img :src="carrot" alt="Carrots" />
        <img :src="orange" alt="Oranges" />
        <img :src="tomato" alt="Tomatoes" />
      </div>
    </section>

    <h2 class="section-title">Why Fresh Basket?</h2>
    <section class="features">
      <div class="feature">
        <div class="icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path
              d="M12 2.5C9.25 2.5 7 4.75 7 7.5c0 2.75 2.25 5 5 5s5-2.25 5-5-2.25-5-5-5zm0 8c-2.21 0-4-2.24-4-5s1.79-5 4-5 4 2.24 4 5-1.79 5-4 5z"
            />
            <path
              d="M12 15.5c-3.31 0-6 3.69-6 8h2c0-2.76 1.76-5 4-5s4 2.24 4 5h2c0-4.31-2.69-8-6-8z"
            />
          </svg>
        </div>
        <h3>Fresh Fruits</h3>
        <p>Sweet, juicy fruits picked at their best.</p>
      </div>
      <div class="feature">
        <div class="icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path
              d="M12.5 2C9.74 2 7.5 4.24 7.5 7c0 2.17 1.29 4.05 3.14 4.73l-.02.27c0 2.21-1.24 4.09-3 4.82.23.53.67.97 1.2 1.22-.13.25-.22.52-.22.82v1.5c0 .83.67 1.5 1.5 1.5H17c.83 0 1.5-.67 1.5-1.5v-1.5c0-.3-.09-.57-.22-.82.53-.25 1 .79 1.22 1.32.18-.21.28-.46.34-.74 1.66-.58 2.88-2.24 2.88-4.1v-.5c0-.83-.67-1.5-1.5-1.5h-2.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h3c.83 0 1.5-.67 1.5-1.5V8c0-1.54-1.08-2.82-2.56-3.12A4.5 4.5 0 0 0 12.5 2zm-3.5 9.5a3.5 3.5 0 0 1 0-7 3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5z"
            />
          </svg>
        </div>
        <h3>Fresh Vegetables</h3>
        <p>Healthy greens and roots for your family.</p>
      </div>
      <div class="feature">
        <div class="icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path
              d="M20 8h-3V4c0-1.1-.9-2-2-2H7C5.9 2 5 2.9 5 4v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8h3c.55 0 1-.45 1-1s-.45-1-1-1zm-7 3c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-1.1.9-2 2-2s2 .9 2 2v3z"
            />
            <path
              d="M7 18h8c1.1 0 2 .9 2 2v1h-2v-1h-1.5c-.28 0-.5-.22-.5-.5 0-.28.22-.5.5-.5H15v-1H7v1c0 .55.45 1 1 1.5V18c0-.55-.45-1-1-1s-1 .45-1 1v2c0 .55.45 1 1 1z"
            />
          </svg>
        </div>
        <h3>Easy Ordering</h3>
        <p>Simple checkout with flexible payment options.</p>
      </div>
    </section>
  </div>
</template>

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Products from '../views/Products.vue'
import AddProduct from '../views/AddProduct.vue'
import Cart from '../views/Cart.vue'
import Orders from '../views/Orders.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import { isAuthenticated, isAdmin } from '../services/authService.js'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/products', name: 'products', component: Products, meta: { requiresAuth: true } },
  { path: '/add-product', name: 'add-product', component: AddProduct, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/cart', name: 'cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/orders', name: 'orders', component: Orders, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next('/products')
  } else {
    next()
  }
})

export default router

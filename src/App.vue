<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from './utils/supabase'
import type { Product, CartItem } from './types/database'
import LandingPage from './components/LandingPage.vue'
import Catalog from './components/Catalog.vue'
import ProductDetail from './components/ProductDetail.vue'
import AdminLogin from './components/AdminLogin.vue'
import AdminUpload from './components/AdminUpload.vue'
import CartDrawer from './components/CartDrawer.vue'
import { Store, ShieldCheck, LogOut, ShoppingBag, Building2, CheckCircle2, Home } from 'lucide-vue-next'

const currentView = ref<'landing' | 'catalog' | 'detail' | 'admin'>('landing')
const selectedProduct = ref<Product | null>(null)
const allProducts = ref<Product[]>([])

const userSession = ref<any>(null)
const loadingAuth = ref(true)

// Shopping Cart State
const cartItems = ref<CartItem[]>([])
const isCartOpen = ref(false)
const toastMessage = ref('')

const totalCartCount = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.quantity, 0)
})

async function fetchAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      allProducts.value = data
    }
  } catch (err) {
    console.error('Error fetching inventory for App:', err)
  }
}

async function checkAuthSession() {
  loadingAuth.value = true
  try {
    const { data } = await supabase.auth.getSession()
    userSession.value = data.session?.user || null
  } catch (err) {
    console.error('Session check error:', err)
  } finally {
    loadingAuth.value = false
  }
}

function handleAuthenticated(user: any) {
  userSession.value = user
  currentView.value = 'admin'
}

async function handleLogout() {
  await supabase.auth.signOut()
  userSession.value = null
  currentView.value = 'landing'
}

function handleSelectProduct(product: Product) {
  selectedProduct.value = product
  currentView.value = 'detail'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleAddToCart(payload: { product: Product; quantity: number; selectedMaterial?: string }) {
  const existingIndex = cartItems.value.findIndex(item => item.product.id === payload.product.id)
  
  if (existingIndex > -1) {
    cartItems.value[existingIndex].quantity += payload.quantity
  } else {
    cartItems.value.push({
      product: payload.product,
      quantity: payload.quantity,
      selectedMaterial: payload.selectedMaterial
    })
  }

  showToast(`Added "${payload.product.name}" to cart!`)
}

function handleQuickAddToCart(product: Product) {
  handleAddToCart({ product, quantity: 1 })
}

function updateCartQuantity(payload: { index: number; quantity: number }) {
  if (payload.quantity <= 0) {
    cartItems.value.splice(payload.index, 1)
  } else {
    cartItems.value[payload.index].quantity = payload.quantity
  }
}

function removeCartItem(index: number) {
  cartItems.value.splice(index, 1)
}

function handleCheckout() {
  showToast('Checkout initialized! Thank you for choosing SAFS Furniture.')
  cartItems.value = []
  isCartOpen.value = false
}

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

onMounted(() => {
  fetchAllProducts()
  checkAuthSession()
  supabase.auth.onAuthStateChange((_event, session) => {
    userSession.value = session?.user || null
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
    
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo -->
        <div 
          @click="currentView = 'landing'"
          class="flex items-center space-x-3 cursor-pointer group"
        >
          <div class="w-10 h-10 bg-blue-700 group-hover:bg-blue-800 rounded-2xl flex items-center justify-center shadow-md shadow-blue-700/20 transition-all">
            <Building2 class="w-6 h-6 text-white" />
          </div>
          <div>
            <span class="text-xl font-black text-slate-900 tracking-tight block group-hover:text-blue-700 transition-colors">
              SAFS <span class="text-blue-700">FURNITURE</span>
            </span>
            <span class="text-[10px] text-blue-700 tracking-widest uppercase block -mt-1 font-bold">
              South African Hardwoods
            </span>
          </div>
        </div>

        <!-- Center View Switcher -->
        <nav class="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            @click="currentView = 'landing'"
            :class="[
              'px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer',
              currentView === 'landing'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            ]"
          >
            <Home class="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            @click="currentView = 'catalog'"
            :class="[
              'px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer',
              currentView === 'catalog' || currentView === 'detail'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            ]"
          >
            <Store class="w-4 h-4" />
            <span>Storefront Catalog</span>
          </button>

          <button
            @click="currentView = 'admin'"
            :class="[
              'px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer',
              currentView === 'admin' 
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            ]"
          >
            <ShieldCheck class="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </nav>

        <!-- Right Cart Trigger & Auth Indicator -->
        <div class="flex items-center space-x-3">
          <!-- Shopping Cart Drawer Button -->
          <button
            @click="isCartOpen = true"
            class="relative p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all cursor-pointer border border-blue-200 shadow-xs flex items-center space-x-2"
          >
            <ShoppingBag class="w-5 h-5" />
            <span class="hidden sm:inline text-xs font-extrabold uppercase">Cart</span>
            <span 
              v-if="totalCartCount > 0"
              class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-700 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce"
            >
              {{ totalCartCount }}
            </span>
          </button>

          <!-- Admin Session Badge -->
          <template v-if="userSession">
            <div class="hidden md:flex items-center space-x-2">
              <span class="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 font-bold">
                Admin Active
              </span>
              <button
                @click="handleLogout"
                class="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
                title="Sign Out Admin"
              >
                <LogOut class="w-4 h-4" />
              </button>
            </div>
          </template>
        </div>
      </div>
    </header>

    <!-- Floating Toast Notification -->
    <div 
      v-if="toastMessage"
      class="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-3 text-sm font-semibold animate-fade-in"
    >
      <CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Dynamic Shopping Cart Drawer -->
    <CartDrawer
      :is-open="isCartOpen"
      :cart-items="cartItems"
      @close="isCartOpen = false"
      @update-quantity="updateCartQuantity"
      @remove-item="removeCartItem"
      @checkout="handleCheckout"
    />

    <!-- Main View Routing -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- View 0: Landing Page -->
      <LandingPage
        v-if="currentView === 'landing'"
        :products="allProducts"
        @explore-catalog="currentView = 'catalog'"
        @select-product="handleSelectProduct"
        @quick-add-to-cart="handleQuickAddToCart"
        @products-updated="fetchAllProducts"
      />

      <!-- View 1: Main Catalog -->
      <Catalog 
        v-else-if="currentView === 'catalog'" 
        @select-product="handleSelectProduct"
        @quick-add-to-cart="handleQuickAddToCart"
      />

      <!-- View 2: E-Commerce Product Detail Page -->
      <ProductDetail 
        v-else-if="currentView === 'detail' && selectedProduct" 
        :product="selectedProduct"
        :all-products="allProducts"
        @back="currentView = 'catalog'"
        @add-to-cart="handleAddToCart"
        @select-product="handleSelectProduct"
      />

      <!-- View 3: Admin Portal -->
      <template v-else-if="currentView === 'admin'">
        <AdminUpload 
          v-if="userSession" 
          @logout="handleLogout" 
          @product-updated="fetchAllProducts"
        />
        <AdminLogin 
          v-else 
          @authenticated="handleAuthenticated" 
        />
      </template>
    </main>

    <!-- Royal White Footer -->
    <footer class="bg-white border-t border-slate-200 text-slate-500 py-8 text-xs text-center">
      <div class="max-w-7xl mx-auto px-4 space-y-2">
        <p class="font-bold text-slate-800">
          SAFS Furniture — Handcrafted South African Hardwood Collection
        </p>
        <p class="text-slate-400">
          Designed with Vue 3, Supabase PostgreSQL & Storage, hosted on Vercel Edge Serverless.
        </p>
      </div>
    </footer>
  </div>
</template>

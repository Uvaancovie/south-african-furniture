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
import { Store, ShieldCheck, LogOut, ShoppingBag, Building2, CheckCircle2, Home, Menu, X } from 'lucide-vue-next'

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

const mobileMenuOpen = ref(false)

function navigateTo(view: 'landing' | 'catalog' | 'detail' | 'admin') {
  currentView.value = view
  mobileMenuOpen.value = false
}

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
    <header
      v-if="currentView !== 'landing'"
      class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        <!-- Logo -->
        <div 
          @click="navigateTo('landing')"
          class="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink-0"
        >
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-stone-700 group-hover:bg-stone-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md shadow-stone-700/20 transition-all">
            <Building2 class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <span class="text-base sm:text-xl font-black text-slate-900 tracking-tight block group-hover:text-stone-700 transition-colors leading-tight">
              SAFS <span class="text-stone-700">FURNITURE</span>
            </span>
            <span class="hidden sm:block text-[10px] text-stone-700 tracking-widest uppercase -mt-1 font-bold leading-tight">
              South African Hardwoods
            </span>
          </div>
        </div>

        <!-- Desktop Nav (hidden on mobile) -->
        <nav class="hidden sm:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            @click="currentView = 'landing'"
            class="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold rounded-lg lg:rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          >
            <Home class="w-4 h-4" />
            <span class="hidden lg:inline">Home</span>
          </button>
          <button
            @click="currentView = 'catalog'"
            :class="[
              'px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold rounded-lg lg:rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap',
              currentView === 'catalog' || currentView === 'detail'
                ? 'bg-stone-700 text-white shadow-md shadow-stone-700/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            ]"
          >
            <Store class="w-4 h-4" />
            <span>Catalog</span>
          </button>
          <button
            @click="currentView = 'admin'"
            :class="[
              'px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold rounded-lg lg:rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap',
              currentView === 'admin' 
                ? 'bg-stone-700 text-white shadow-md shadow-stone-700/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            ]"
          >
            <ShieldCheck class="w-4 h-4" />
            <span class="hidden lg:inline">Admin</span>
            <span class="lg:hidden">Admin</span>
          </button>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Shopping Cart Drawer Button -->
          <button
            @click="isCartOpen = true"
            class="relative p-2 sm:p-2.5 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-lg sm:rounded-xl transition-all cursor-pointer border border-stone-200 shadow-xs flex items-center space-x-1.5"
          >
            <ShoppingBag class="w-4 h-4 sm:w-5 sm:h-5" />
            <span class="hidden sm:inline text-xs font-extrabold uppercase">Cart</span>
            <span 
              v-if="totalCartCount > 0"
              class="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-stone-700 text-white text-[10px] sm:text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce"
            >
              {{ totalCartCount }}
            </span>
          </button>

          <!-- Admin Session Badge (desktop) -->
          <template v-if="userSession">
            <div class="hidden md:flex items-center space-x-2">
              <span class="hidden lg:inline px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 font-bold">
                Admin Active
              </span>
              <button
                @click="handleLogout"
                class="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-colors"
                title="Sign Out Admin"
              >
                <LogOut class="w-4 h-4 sm:w-4 sm:h-4" />
              </button>
            </div>
          </template>

          <!-- Mobile Hamburger -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="sm:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            :title="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div
        v-if="mobileMenuOpen"
        class="sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-lg"
      >
        <div class="px-4 py-3 space-y-1">
          <button
            @click="navigateTo('landing')"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer text-slate-700 hover:bg-slate-100"
          >
            <Home class="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            @click="navigateTo('catalog')"
            :class="[
              'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer',
              currentView === 'catalog' || currentView === 'detail' ? 'bg-stone-700 text-white' : 'text-slate-700 hover:bg-slate-100'
            ]"
          >
            <Store class="w-5 h-5" />
            <span>Catalog</span>
          </button>
          <button
            @click="navigateTo('admin')"
            :class="[
              'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer',
              currentView === 'admin' ? 'bg-stone-700 text-white' : 'text-slate-700 hover:bg-slate-100'
            ]"
          >
            <ShieldCheck class="w-5 h-5" />
            <span>Admin Portal</span>
          </button>

          <!-- Mobile Admin badge -->
          <template v-if="userSession">
            <div class="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
              <span class="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 font-bold">
                Admin Active
              </span>
              <button
                @click="handleLogout"
                class="flex items-center space-x-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                <LogOut class="w-4 h-4" />
                <span>Sign Out</span>
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
    <main class="flex-1 w-full mx-auto">

      <!-- View 0: Landing Page (full-bleed, owns its own header/hero) -->
      <div
        v-if="currentView === 'landing'"
        class="w-full"
      >
        <LandingPage
          :products="allProducts"
          @explore-catalog="currentView = 'catalog'"
          @select-product="handleSelectProduct"
          @quick-add-to-cart="handleQuickAddToCart"
          @products-updated="fetchAllProducts"
          @open-cart="isCartOpen = true"
          @navigate-admin="currentView = 'admin'"
        />
      </div>

      <!-- Nested View Container -->
      <div v-else class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- View 1: Main Catalog -->
      <Catalog 
        v-if="currentView === 'catalog'" 
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
      </div>
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

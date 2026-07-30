<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../utils/supabase'
import type { Product } from '../types/database'
import { 
  Search, 
  Sparkles, 
  Box, 
  X, 
  ShoppingBag
} from 'lucide-vue-next'

const emit = defineEmits(['select-product', 'quick-add-to-cart'])

const products = ref<Product[]>([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = [
  'All',
  'Living Room',
  'Dining Room',
  'Bedroom',
  'Office',
  'Outdoor',
  'Storage'
]

// Fallback dataset if database is empty initially
const sampleProducts: Product[] = [
  {
    id: 'sample-1',
    name: 'Kariega Teak Dining Table',
    slug: 'kariega-teak-dining-table',
    category: 'Dining Room',
    price: 18450.00,
    stock_quantity: 5,
    material: 'Solid South African Teak',
    color: 'Warm Amber',
    width: 220, height: 76, depth: 100,
    is_active: true, is_featured: true,
    description: 'Handcrafted solid teak dining table featuring natural organic grain lines and architectural legs.',
    sku: 'TBL-TEAK-001',
    product_images: [
      { id: 'img-1', product_id: 'sample-1', image_url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80', is_primary: true }
    ]
  },
  {
    id: 'sample-2',
    name: 'Drakensberg Leather Sofa (3-Seater)',
    slug: 'drakensberg-leather-sofa',
    category: 'Living Room',
    price: 24900.00,
    stock_quantity: 3,
    material: 'Full-Grain Aniline Leather & Steel',
    color: 'Cognac Brown',
    width: 240, height: 85, depth: 95,
    is_active: true, is_featured: true,
    description: 'Luxurious 3-seater sofa wrapped in premium South African full-grain leather that ages beautifully.',
    sku: 'SOFA-DRK-002',
    product_images: [
      { id: 'img-2', product_id: 'sample-2', image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', is_primary: true }
    ]
  },
  {
    id: 'sample-3',
    name: 'Cape Winelands Oak Credenza',
    slug: 'cape-winelands-oak-credenza',
    category: 'Storage',
    price: 14200.00,
    stock_quantity: 8,
    material: 'French Oak & Brushed Brass',
    color: 'Natural Matte Oak',
    width: 180, height: 80, depth: 45,
    is_active: true, is_featured: false,
    description: 'Minimalist sideboard with soft-close slatted oak doors and soft velvet-lined drawers.',
    sku: 'STG-OAK-003',
    product_images: [
      { id: 'img-3', product_id: 'sample-3', image_url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80', is_primary: true }
    ]
  },
  {
    id: 'sample-4',
    name: 'Table Mountain Accent Chair',
    slug: 'table-mountain-accent-chair',
    category: 'Living Room',
    price: 8950.00,
    stock_quantity: 12,
    material: 'Bouclé Fabric & Ash Wood',
    color: 'Ivory White',
    width: 82, height: 78, depth: 80,
    is_active: true, is_featured: true,
    description: 'Sculptural accent armchair crafted from textured cream bouclé upholstery over a solid ash frame.',
    sku: 'CHR-BOU-004',
    product_images: [
      { id: 'img-4', product_id: 'sample-4', image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80', is_primary: true }
    ]
  },
  {
    id: 'sample-5',
    name: 'Stellenbosch Executive Desk',
    slug: 'stellenbosch-executive-desk',
    category: 'Office',
    price: 16800.00,
    stock_quantity: 4,
    material: 'Walnut Wood & Powder-Coated Steel',
    color: 'Dark Walnut',
    width: 160, height: 75, depth: 70,
    is_active: true, is_featured: false,
    description: 'Sophisticated executive desk with integrated wireless phone charging pad and cable management.',
    sku: 'DSK-WAL-005',
    product_images: [
      { id: 'img-5', product_id: 'sample-5', image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80', is_primary: true }
    ]
  },
  {
    id: 'sample-6',
    name: 'Clifton Rattan Queen Bed Frame',
    slug: 'clifton-rattan-queen-bed-frame',
    category: 'Bedroom',
    price: 19500.00,
    stock_quantity: 2,
    material: 'Solid Oak & Natural Cane Rattan',
    color: 'Light Oak',
    width: 168, height: 120, depth: 215,
    is_active: true, is_featured: true,
    description: 'Organic minimalist bed frame featuring a hand-woven rattan headboard framed in solid European oak.',
    sku: 'BED-RAT-006',
    product_images: [
      { id: 'img-6', product_id: 'sample-6', image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', is_primary: true }
    ]
  }
]

async function fetchProducts() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase query warning (using sample dataset):', error.message)
      products.value = sampleProducts
    } else if (data && data.length > 0) {
      products.value = data
    } else {
      products.value = sampleProducts
    }
  } catch (err: any) {
    console.error('Fetch error:', err)
    products.value = sampleProducts
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = selectedCategory.value === 'All' || product.category.toLowerCase() === selectedCategory.value.toLowerCase()
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query || 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.material && product.material.toLowerCase().includes(query)) ||
      (product.sku && product.sku.toLowerCase().includes(query))
    return matchesCategory && matchesSearch
  })
})

function formatPrice(val: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2
  }).format(val)
}

function getPrimaryImageUrl(product: Product): string {
  if (product.product_images && product.product_images.length > 0) {
    const primary = product.product_images.find(img => img.is_primary)
    return primary ? primary.image_url : product.product_images[0].image_url
  }
  return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Royal Blue Banner -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-8 md:p-12 text-white shadow-2xl">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl space-y-4">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          <Sparkles class="w-3.5 h-3.5" />
          <span>SAFS Furniture Collection</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Handcrafted South African <span class="text-blue-300">Hardwoods</span>
        </h1>
        <p class="text-blue-100 text-base md:text-lg leading-relaxed">
          Welcome to SAFS Furniture. Explore solid timber dining tables, top-grain leather sofas, and ergonomic accent chairs designed for luxury living.
        </p>
      </div>
    </section>

    <!-- Filter & Search Bar -->
    <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <!-- Category Pills -->
      <div class="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer',
            selectedCategory === cat 
              ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative min-w-[280px]">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title, material, SKU..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
        />
        <button 
          v-if="searchQuery" 
          @click="searchQuery = ''" 
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 animate-pulse">
        <div class="h-56 bg-slate-100 rounded-xl"></div>
        <div class="h-4 bg-slate-100 rounded w-3/4"></div>
        <div class="h-4 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
      <Box class="w-12 h-12 text-slate-400 mx-auto" />
      <h3 class="text-lg font-bold text-slate-900">No SAFS Furniture products found</h3>
      <p class="text-slate-500 text-sm max-w-md mx-auto">
        No items matched your current filter criteria.
      </p>
      <button 
        @click="selectedCategory = 'All'; searchQuery = ''" 
        class="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
      >
        Clear Filters
      </button>
    </div>

    <!-- Furniture Product Card Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="group bg-white border border-slate-200 hover:border-blue-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      >
        <!-- Card Image & Badges -->
        <div class="relative h-64 overflow-hidden bg-slate-100 cursor-pointer" @click="emit('select-product', product)">
          <img 
            :src="getPrimaryImageUrl(product)" 
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          <!-- Featured Badge -->
          <div v-if="product.is_featured" class="absolute top-3 left-3 px-3 py-1 bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md uppercase tracking-wider">
            Featured Piece
          </div>

          <!-- Category Chip -->
          <div class="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-blue-900 text-xs font-semibold rounded-lg shadow-sm border border-slate-200">
            {{ product.category }}
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2 cursor-pointer" @click="emit('select-product', product)">
            <h3 class="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
              {{ product.name }}
            </h3>
            <p class="text-slate-500 text-xs line-clamp-2 leading-relaxed">
              {{ product.description || 'Premium solid hardwood furniture piece crafted with modern ergonomics.' }}
            </p>
          </div>

          <!-- Price & Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-400 block font-medium">Price (ZAR)</span>
              <span class="text-xl font-black text-blue-700">{{ formatPrice(product.price) }}</span>
            </div>

            <div class="flex items-center space-x-2">
              <button 
                @click.stop="emit('select-product', product)"
                class="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                View Details
              </button>

              <button 
                @click.stop="emit('quick-add-to-cart', product)"
                class="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-sm transition-all cursor-pointer"
                title="Quick Add to Cart"
              >
                <ShoppingBag class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

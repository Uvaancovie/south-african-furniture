<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '../types/database'
import { 
  ShoppingBag, 
  ChevronLeft, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  Minus, 
  Plus, 
  Check, 
  Star,
  Maximize2,
  X
} from 'lucide-vue-next'

const props = defineProps<{
  product: Product;
  allProducts: Product[];
}>()

const emit = defineEmits(['back', 'add-to-cart', 'select-product'])

const quantity = ref(1)
const activeTab = ref<'description' | 'specs' | 'shipping' | 'care'>('description')
const activeImageIndex = ref(0)
const isZoomOpen = ref(false)
const isAdded = ref(false)

const currentImageUrl = computed(() => {
  if (props.product.product_images && props.product.product_images.length > activeImageIndex.value) {
    return props.product.product_images[activeImageIndex.value].image_url
  }
  return 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80'
})

const totalPrice = computed(() => {
  return props.product.price * quantity.value
})

const relatedProducts = computed(() => {
  return props.allProducts
    .filter(p => p.id !== props.product.id && (p.category === props.product.category || p.is_featured))
    .slice(0, 3)
})

function formatPrice(val: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2
  }).format(val)
}

function handleAddToCart() {
  emit('add-to-cart', {
    product: props.product,
    quantity: quantity.value,
    selectedMaterial: props.product.material || 'Solid Wood'
  })
  isAdded.value = true
  setTimeout(() => {
    isAdded.value = false
  }, 2000)
}
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Breadcrumb & Back Navigation -->
    <div class="flex items-center justify-between">
      <button 
        @click="emit('back')" 
        class="inline-flex items-center space-x-2 text-sm font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs border border-blue-200"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>Back to SAFS Furniture Catalog</span>
      </button>

      <div class="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <span>SAFS Furniture</span>
        <span>/</span>
        <span class="text-blue-700 font-semibold">{{ product.category }}</span>
        <span>/</span>
        <span class="text-slate-800 font-bold truncate max-w-[150px]">{{ product.name }}</span>
      </div>
    </div>

    <!-- Main E-Commerce Product Card Container -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 md:p-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Left 7 Columns: Interactive Image Gallery -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Main Hero Image Frame -->
          <div class="relative h-[420px] md:h-[500px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
            <img 
              :src="currentImageUrl" 
              :alt="product.name" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <!-- Badges -->
            <div class="absolute top-4 left-4 flex flex-col space-y-2">
              <span v-if="product.is_featured" class="px-3 py-1 bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md uppercase tracking-wider">
                Featured Piece
              </span>
              <span class="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-950 text-xs font-semibold rounded-lg shadow-sm border border-slate-200">
                {{ product.category }}
              </span>
            </div>

            <!-- Zoom Trigger Button -->
            <button 
              @click="isZoomOpen = true"
              class="absolute bottom-4 right-4 p-2.5 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-lg backdrop-blur-md transition-all cursor-pointer"
              title="Expand Image"
            >
              <Maximize2 class="w-5 h-5" />
            </button>
          </div>

          <!-- Thumbnail Carousel -->
          <div v-if="product.product_images && product.product_images.length > 1" class="flex space-x-3 overflow-x-auto pb-2">
            <button
              v-for="(img, idx) in product.product_images"
              :key="img.id"
              @click="activeImageIndex = idx"
              :class="[
                'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer shadow-xs',
                activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 opacity-60 hover:opacity-100'
              ]"
            >
              <img :src="img.image_url" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Right 5 Columns: Dynamic Product Purchase Panel -->
        <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <!-- Header & Rating -->
            <div>
              <div class="flex items-center space-x-2 text-amber-500 mb-1 text-xs font-semibold">
                <div class="flex">
                  <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span class="text-slate-600 font-bold ml-1">4.9 (48 reviews)</span>
              </div>

              <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {{ product.name }}
              </h1>

              <div class="flex items-center space-x-3 mt-2">
                <span class="text-3xl font-black text-blue-700">
                  {{ formatPrice(product.price) }}
                </span>
                <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Includes VAT
                </span>
              </div>
            </div>

            <!-- Stock Status & SKU -->
            <div class="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
              <div class="flex items-center space-x-2">
                <span :class="[
                  'w-2.5 h-2.5 rounded-full animate-pulse',
                  product.stock_quantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                ]"></span>
                <span class="font-bold text-slate-700">
                  {{ product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock (Made to Order)' }}
                </span>
              </div>
              <span v-if="product.sku" class="font-mono text-slate-500 font-semibold">SKU: {{ product.sku }}</span>
            </div>

            <!-- Material Badge if present -->
            <div v-if="product.material" class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span class="text-slate-500 block uppercase font-bold text-[10px] tracking-wider mb-0.5">Primary Craftsmanship Material</span>
              <span class="font-extrabold text-slate-800 text-sm">{{ product.material }}</span>
            </div>

            <!-- Interactive Quantity Counter -->
            <div class="space-y-2 pt-2">
              <div class="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
                <span>Select Quantity</span>
                <span class="text-blue-700">Subtotal: {{ formatPrice(totalPrice) }}</span>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button 
                    @click="quantity > 1 ? quantity-- : null"
                    class="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-40"
                    :disabled="quantity <= 1"
                  >
                    <Minus class="w-4 h-4" />
                  </button>
                  <span class="px-5 font-bold text-slate-900 text-base min-w-[40px] text-center">
                    {{ quantity }}
                  </span>
                  <button 
                    @click="quantity++"
                    class="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>

                <!-- Add to Cart CTA Button -->
                <button
                  @click="handleAddToCart"
                  :class="[
                    'flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer',
                    isAdded 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                      : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/30'
                  ]"
                >
                  <template v-if="isAdded">
                    <Check class="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </template>
                  <template v-else>
                    <ShoppingBag class="w-5 h-5" />
                    <span>Add to Shopping Cart</span>
                  </template>
                </button>
              </div>
            </div>

            <!-- Value Proposition Features -->
            <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div class="flex items-center space-x-2.5 text-slate-600">
                <Truck class="w-4 h-4 text-blue-600 shrink-0" />
                <span>Nationwide SA Delivery</span>
              </div>
              <div class="flex items-center space-x-2.5 text-slate-600">
                <ShieldCheck class="w-4 h-4 text-blue-600 shrink-0" />
                <span>10-Year Timber Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabbed Technical & Care Information -->
      <div class="mt-12 border-t border-slate-200 pt-8 space-y-6">
        <div class="flex items-center space-x-4 border-b border-slate-200 overflow-x-auto">
          <button
            v-for="tab in [
              { id: 'description', label: 'Product Description' },
              { id: 'specs', label: 'Specifications & Dimensions' },
              { id: 'shipping', label: 'Shipping & White-Glove Delivery' },
              { id: 'care', label: 'Care & Maintenance' }
            ]"
            :key="tab.id"
            @click="activeTab = tab.id as any"
            :class="[
              'pb-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap cursor-pointer',
              activeTab === tab.id 
                ? 'border-blue-700 text-blue-700 font-extrabold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content Views -->
        <div class="text-sm text-slate-600 leading-relaxed max-w-4xl">
          <div v-if="activeTab === 'description'" class="space-y-4">
            <p>{{ product.description || 'Crafted with precision engineering and organic timber grain, this furniture piece from SAFS Furniture combines structural durability with sophisticated modern contours.' }}</p>
            <p>Sustainably harvested from accredited South African forests, treated with non-toxic matte sealing wax for enhanced moisture resistance and longevity.</p>
          </div>

          <div v-else-if="activeTab === 'specs'" class="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <span class="text-xs text-slate-500 block uppercase font-semibold">Primary Material</span>
              <span class="font-bold text-slate-900 text-base">{{ product.material || 'Solid South African Hardwood' }}</span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase font-semibold">Dimensions (W x H x D)</span>
              <span class="font-bold text-slate-900 text-base">
                {{ product.width || '180' }} x {{ product.height || '75' }} x {{ product.depth || '90' }} cm
              </span>
            </div>
            <div>
              <span class="text-xs text-slate-500 block uppercase font-semibold">Origin</span>
              <span class="font-bold text-slate-900 text-base">Handcrafted in South Africa</span>
            </div>
          </div>

          <div v-else-if="activeTab === 'shipping'" class="space-y-3">
            <p class="font-semibold text-slate-800">White-Glove Furniture Delivery across South Africa:</p>
            <ul class="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Gauteng & Western Cape:</strong> Delivered within 3-5 business days.</li>
              <li><strong>KZN & Eastern Cape:</strong> Delivered within 5-7 business days.</li>
              <li>Includes unboxing, positioning in your room of choice, and packaging disposal.</li>
            </ul>
          </div>

          <div v-else-if="activeTab === 'care'" class="space-y-3">
            <p>Maintain the pristine lustre of your SAFS Furniture solid wood items with these easy steps:</p>
            <ul class="list-disc pl-5 space-y-1 text-slate-600">
              <li>Wipe surfaces clean with a soft microfibre cloth dampened with warm water.</li>
              <li>Avoid direct sunlight exposure to preserve natural oil tones.</li>
              <li>Apply natural beeswax conditioner once every 6 months.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products Section -->
    <div v-if="relatedProducts.length > 0" class="space-y-4 pt-6">
      <h3 class="text-2xl font-bold text-slate-900">Complementary SAFS Furniture Pieces</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div 
          v-for="item in relatedProducts" 
          :key="item.id"
          @click="emit('select-product', item)"
          class="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div class="h-44 rounded-xl overflow-hidden bg-slate-100 mb-3">
            <img 
              :src="item.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <span class="text-xs font-semibold text-blue-700 block">{{ item.category }}</span>
            <h4 class="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{{ item.name }}</h4>
            <p class="font-extrabold text-slate-900 mt-1">{{ formatPrice(item.price) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Fullscreen Modal -->
    <div v-if="isZoomOpen" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4" @click.self="isZoomOpen = false">
      <div class="relative max-w-5xl w-full max-h-[90vh]">
        <button @click="isZoomOpen = false" class="absolute -top-12 right-0 text-white hover:text-blue-400 p-2 cursor-pointer">
          <X class="w-8 h-8" />
        </button>
        <img :src="currentImageUrl" class="w-full h-full object-contain max-h-[85vh] rounded-2xl shadow-2xl" />
      </div>
    </div>
  </div>
</template>

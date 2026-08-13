<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Product } from '../types/database'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Minus,
  Plus,
  X,
} from 'lucide-vue-next'

const props = defineProps<{
  product: Product;
  allProducts: Product[];
  wishlist?: Product[];
}>()

const emit = defineEmits(['back', 'add-to-cart', 'select-product', 'toggle-wishlist'])

const quantity = ref(1)
const activeTab = ref<'description' | 'specs' | 'shipping' | 'care'>('description')
const activeImageIndex = ref(0)
const isZoomOpen = ref(false)
const isAdded = ref(false)

// Added color swatch options matching the screenshot's palette
const colors = ref([
  { name: 'Black', class: 'bg-black' },
  { name: 'White', class: 'bg-white border border-stone-300' },
  { name: 'Beige', class: 'bg-[#f4ebe1] border border-stone-300' },
  { name: 'Yellow', class: 'bg-[#fdf0a6] border border-stone-300' },
  { name: 'Cream', class: 'bg-[#f6f2ec] border border-stone-300' }
])
const selectedColorIndex = ref(0)

const currentImageUrl = computed(() => {
  if (props.product.product_images && props.product.product_images.length > activeImageIndex.value) {
    return props.product.product_images[activeImageIndex.value].image_url
  }
  return 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80'
})

const totalPrice = computed(() => {
  return props.product.price * quantity.value
})

const productImages = computed(() => props.product.product_images || [])

function goToImage(index: number) {
  activeImageIndex.value = (index + productImages.value.length) % productImages.value.length
}

function nextImage() {
  goToImage(activeImageIndex.value + 1)
}

function prevImage() {
  goToImage(activeImageIndex.value - 1)
}

function onKeydown(e: KeyboardEvent) {
  if (!isZoomOpen.value) return
  if (e.key === 'Escape') isZoomOpen.value = false
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

watch(isZoomOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const relatedProducts = computed(() => {
  return props.allProducts
    .filter(p => p.id !== props.product.id && (p.category === props.product.category || p.is_featured))
    .slice(0, 3)
})

function isWishlisted(productId: string): boolean {
  return (props.wishlist || []).some(item => item.id === productId)
}

function formatPrice(val: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0 // Removes decimals to match the "R3499" style
  }).format(val).replace(/\s/g, '') // Removes spaces for compact display
}

function handleAddToCart() {
  emit('add-to-cart', {
    product: props.product,
    quantity: quantity.value,
    selectedMaterial: props.product.material || 'Solid Wood',
    selectedColor: colors.value[selectedColorIndex.value].name
  })
  isAdded.value = true
  setTimeout(() => {
    isAdded.value = false
  }, 2000)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-16 max-w-7xl mx-auto px-4 md:px-8">

    <!-- Minimal Breadcrumb Navigation -->
    <div class="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-neutral-100">
      <div class="flex items-center space-x-1.5 text-xs md:text-sm text-neutral-500 font-normal">
        <span class="hover:underline cursor-pointer" @click="emit('back')">Home</span>
        <span>/</span>
        <span class="hover:underline cursor-pointer">Bedroom</span>
        <span>/</span>
        <span class="hover:underline cursor-pointer">Furniture</span>
        <span>/</span>
        <span class="text-neutral-900 font-medium">{{ product.name }}</span>
      </div>

      <!-- Compact Wishlist Button -->
      <button
        @click="emit('toggle-wishlist', product)"
        class="inline-flex items-center space-x-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <Heart class="w-4 h-4" :class="isWishlisted(product.id) ? 'fill-red-500 text-red-500' : ''" />
        <span>{{ isWishlisted(product.id) ? 'Saved' : 'Save Item' }}</span>
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-4">

      <!-- Left Column: Interactive Image Gallery -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Main Image Frame -->
        <div class="relative w-full h-[48vh] sm:h-[55vh] md:h-[60vh] lg:h-[66vh] overflow-hidden bg-neutral-100 rounded-sm group">
          <img
            :src="currentImageUrl"
            :alt="product.name"
            class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          />

          <!-- Carousel Prev / Next Buttons -->
          <button
            v-if="productImages.length > 1"
            @click="prevImage"
            class="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/85 hover:bg-white text-stone-700 rounded-full shadow-md backdrop-blur-sm transition-all cursor-pointer"
            title="Previous Image"
          >
            <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            v-if="productImages.length > 1"
            @click="nextImage"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/85 hover:bg-white text-stone-700 rounded-full shadow-md backdrop-blur-sm transition-all cursor-pointer"
            title="Next Image"
          >
            <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <!-- Image Counter -->
          <span
            v-if="productImages.length > 1"
            class="absolute bottom-4 left-4 px-2.5 py-1 text-xs font-medium text-stone-700 bg-white/85 backdrop-blur-sm rounded-full shadow-md"
          >
            {{ activeImageIndex + 1 }} / {{ productImages.length }}
          </span>

          <!-- Zoom Trigger Button -->
          <button
            @click="isZoomOpen = true"
            class="absolute bottom-4 right-4 p-2 bg-white/80 hover:bg-white text-stone-700 rounded-full shadow-xs backdrop-blur-sm transition-all cursor-pointer"
            title="Expand Image"
          >
            <Maximize2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Thumbnail Row (Supports up to 5 items like the design) -->
        <div v-if="product.product_images && product.product_images.length > 1" class="grid grid-cols-5 gap-2">
          <button
            v-for="(img, idx) in product.product_images.slice(0, 5)"
            :key="img.id"
            @click="activeImageIndex = idx"
            :class="[
              'aspect-[4/3] overflow-hidden transition-all shrink-0 cursor-pointer',
              activeImageIndex === idx ? 'opacity-100 ring-1 ring-neutral-900' : 'opacity-70 hover:opacity-100'
            ]"
          >
            <img :src="img.image_url" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Right Column: Clean Purchase Details Panel -->
      <div class="lg:col-span-5 flex flex-col justify-start">

        <!-- Product Name -->
        <h1 class="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight leading-tight mb-4">
          {{ product.name }}
        </h1>

        <!-- Product Description -->
        <p class="text-stone-600 text-sm md:text-base leading-relaxed mb-6">
          {{ product.description || 'A classic 3-piece genuine leather couch set with dual-density foam seats, removable seat cushions and a solid wood frame. A timeless leather lounge suite built for comfort and durability. Available in various custom colour options.' }}
        </p>

        <!-- Divider Line -->
        <hr class="border-stone-200 mb-5" />

        <!-- Price & Color Selectors -->
        <div class="flex items-center justify-between mb-5">
          <!-- Price Tag -->
          <span class="text-2xl md:text-3xl font-semibold text-red-500">
            {{ formatPrice(product.price) }}
          </span>

          <!-- Color Swatches -->
          <div class="flex items-center space-x-2">
            <button
              v-for="(color, index) in colors"
              :key="index"
              @click="selectedColorIndex = index"
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer border',
                selectedColorIndex === index ? 'border-neutral-900 ring-2 ring-neutral-400/20' : 'border-transparent'
              ]"
            >
              <span :class="['w-5 h-5 rounded-full', color.class]"></span>
            </button>
          </div>
        </div>

        <!-- Divider Line -->
        <hr class="border-stone-200 mb-5" />

        <!-- Delivery Status -->
        <div class="text-sm text-neutral-800 font-medium mb-6">
          Delivery 3 - 5 Days
        </div>

        <!-- Quantity & Stock Display -->
        <div class="flex flex-wrap items-center gap-6 mb-8">
          <!-- Quantity Control -->
          <div class="flex items-center border border-stone-400 rounded-sm bg-white">
            <button
              @click="quantity > 1 ? quantity-- : null"
              class="px-3 py-1.5 text-stone-600 hover:bg-stone-50 cursor-pointer disabled:opacity-45"
              :disabled="quantity <= 1"
            >
              <Minus class="w-3 h-3" />
            </button>
            <span class="px-3 font-medium text-stone-900 text-sm min-w-[28px] text-center">
              {{ quantity }}
            </span>
            <button
              @click="quantity++"
              class="px-3 py-1.5 text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              <Plus class="w-3 h-3" />
            </button>
          </div>

          <!-- Stock Indicator -->
          <div class="flex items-center space-x-2 text-sm text-stone-700 font-medium">
            <span>{{ product.stock_quantity > 0 ? 'Stock Available' : 'Out of Stock' }}</span>
          </div>
        </div>

        <!-- Action Call-To-Buttons -->
        <div class="flex items-center gap-4 mb-8">
          <!-- Add to Cart Pill Button -->
          <button
            @click="handleAddToCart"
            :class="[
              'flex-1 py-3 px-6 rounded-full font-medium text-sm border tracking-wide transition-all text-center cursor-pointer',
              isAdded
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'border-stone-500 text-stone-900 bg-white hover:bg-stone-50'
            ]"
          >
            <span v-if="isAdded">Added!</span>
            <span v-else>Add To Cart</span>
          </button>

          <!-- Buy Now Solid Pill Button -->
          <button
            @click="handleAddToCart"
            class="flex-1 py-3 px-6 rounded-full font-medium text-sm tracking-wide bg-black text-white hover:bg-neutral-900 transition-all text-center cursor-pointer"
          >
            Buy Now
          </button>
        </div>

      </div>
    </div>

    <!-- Tabbed Content Section (Maintained feature set with minimalist styling) -->
    <div class="mt-16 border-t border-stone-200 pt-10">
      <div class="flex items-center space-x-6 border-b border-stone-200 overflow-x-auto">
        <button
          v-for="tab in [
            { id: 'description', label: 'Product Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'shipping', label: 'Shipping' },
            { id: 'care', label: 'Care Instructions' }
          ]"
          :key="tab.id"
          @click="activeTab = tab.id as any"
          :class="[
            'pb-4 text-xs md:text-sm font-medium transition-all border-b-2 whitespace-nowrap cursor-pointer',
            activeTab === tab.id
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content Frame -->
      <div class="py-6 text-sm text-neutral-600 leading-relaxed max-w-4xl">
        <div v-if="activeTab === 'description'" class="space-y-4">
          <p>{{ product.description || 'This premium leather set marries mid-century proportions with modern convenience, featuring a deep seat profile and durable solid wood understructure.' }}</p>
        </div>

        <div v-else-if="activeTab === 'specs'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div class="flex justify-between border-b border-stone-100 py-1.5">
            <span class="text-stone-500">Material</span>
            <span class="font-medium text-stone-900">{{ product.material || 'Genuine Leather' }}</span>
          </div>
          <div class="flex justify-between border-b border-stone-100 py-1.5">
            <span class="text-stone-500">Dimensions</span>
            <span class="font-medium text-stone-900">
              {{ product.width || '180' }}w x {{ product.height || '75' }}h cm
            </span>
          </div>
        </div>

        <div v-else-if="activeTab === 'shipping'" class="space-y-2">
          <p>Orders ship complete with our delivery services. High-care packaging ensures the item arrives in prime condition.</p>
        </div>

        <div v-else-if="activeTab === 'care'" class="space-y-2">
          <p>Condition regularly with approved leather care products to preserve surface moisture and suppleness.</p>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0" class="space-y-6 pt-10 border-t border-stone-200">
      <h3 class="text-xl font-medium text-neutral-900">Related Pieces</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          v-for="item in relatedProducts"
          :key="item.id"
          @click="emit('select-product', item)"
          class="group cursor-pointer space-y-2"
        >
          <div class="aspect-[4/3] overflow-hidden bg-neutral-100">
            <img
              :src="item.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'"
              class="w-full h-full object-cover group-hover:scale-101 transition-transform"
            />
          </div>
          <div class="flex justify-between items-start text-sm">
            <div>
              <h4 class="font-medium text-neutral-900">{{ item.name }}</h4>
              <p class="text-neutral-500 text-xs">{{ item.category }}</p>
            </div>
            <span class="font-semibold text-neutral-900">{{ formatPrice(item.price) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Fullscreen Modal -->
    <Teleport to="body">
      <div
        v-if="isZoomOpen"
        class="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center"
        @click.self="isZoomOpen = false"
      >
        <button
          @click="isZoomOpen = false"
          class="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer"
          title="Close"
        >
          <X class="w-6 h-6" />
        </button>

        <button
          v-if="productImages.length > 1"
          @click="prevImage"
          class="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white p-2 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer"
          title="Previous Image"
        >
          <ChevronLeft class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <img
          :src="currentImageUrl"
          :alt="product.name"
          class="w-auto h-auto max-w-[92vw] sm:max-w-[85vw] max-h-[86vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />

        <button
          v-if="productImages.length > 1"
          @click="nextImage"
          class="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white p-2 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer"
          title="Next Image"
        >
          <ChevronRight class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <div
          v-if="productImages.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/85 text-xs sm:text-sm bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full"
        >
          {{ activeImageIndex + 1 }} / {{ productImages.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '../utils/supabase'
import type { Product } from '../types/database'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Hammer,
  Search,
  MapPin,
  User,
  Heart,
  Menu,
  X,
} from 'lucide-vue-next'

const props = defineProps<{
  products?: Product[];
  wishlist?: Product[];
}>()

const emit = defineEmits(['explore-catalog', 'select-product', 'quick-add-to-cart', 'products-updated', 'open-cart', 'open-wishlist', 'navigate-admin', 'toggle-wishlist'])

const liveProducts = ref<Product[]>([])
const loading = ref(false)
const activeFaq = ref<number | null>(0)
const searchQuery = ref('')
const mobileNavOpen = ref(false)
const heroIndex = ref(0)

const heroSlides = [
  {
    image: 'https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/a9411a86-b059-468b-9c03-c29e311bbb71/1787296485552-0.jpg',
    alt: '4-Piece Modern Circular Lounge Set - Espresso Round Table & 4 Grey Accent Chairs',
  },
  {
    image: 'https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/58d59cbc-43e5-4488-9068-8b0b4f45ffcb/1787293170209-1.jpg',
    alt: 'Luxury Contemporary Dining Set with Crescent Pedestal Table & High-Back Chairs',
  },
  {
    image: 'https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/c1a82d73-957f-4f99-a34e-0c6aeb82562d/1786968369398-0.jpg',
    alt: 'Luxor Geometric Upholstered Headboard with Gold Accents - Premium Grey',
  },
  {
    image: 'https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/abd82667-c642-4043-a57a-5fef2597dd23/1786602279649-0.jpg',
    alt: 'Modern Black Oval Pedestal Coffee Table',
  },
  {
    image: 'https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/977e3408-1ea6-4518-a7fd-745c19aba022/1786016998600-0.jpg',
    alt: 'Chair & Table Set',
  },
]

let heroTimer: ReturnType<typeof setInterval> | null = null

function nextHero() {
  heroIndex.value = (heroIndex.value + 1) % heroSlides.length
}

function prevHero() {
  heroIndex.value = (heroIndex.value - 1 + heroSlides.length) % heroSlides.length
}

function goToHero(idx: number) {
  heroIndex.value = idx
}

function restartHeroTimer() {
  if (heroTimer) clearInterval(heroTimer)
  heroTimer = setInterval(nextHero, 5000)
}

const navCategories = [
  'Inspiration',
  'Couch',
  'Made To Order',
  'Shop By Room',
  

  'Offers',
]

// Fallback real items if database has no records yet
const defaultRealInventory: Product[] = [
  {
    id: 'real-1',
    name: 'Kariega Teak Dining Table',
    slug: 'kariega-teak-dining-table',
    category: 'Dining Room',
    price: 18450.00,
    stock_quantity: 5,
    material: 'Solid South African Teak',
    width: 220, height: 76, depth: 100,
    is_active: true, is_featured: true,
    description: 'Handcrafted solid teak dining table featuring natural organic grain lines.',
    sku: 'TBL-TEAK-001',
    product_images: [{ id: 'img-1', product_id: 'real-1', image_url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80', is_primary: true }]
  },
  {
    id: 'real-2',
    name: 'Drakensberg Leather Sofa',
    slug: 'drakensberg-leather-sofa',
    category: 'Living Room',
    price: 24900.00,
    stock_quantity: 3,
    material: 'Full-Grain Aniline Leather',
    width: 240, height: 85, depth: 95,
    is_active: true, is_featured: true,
    description: 'Luxurious 3-seater sofa wrapped in premium South African full-grain leather.',
    sku: 'SOFA-DRK-002',
    product_images: [{ id: 'img-2', product_id: 'real-2', image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', is_primary: true }]
  },
  {
    id: 'real-3',
    name: 'Cape Winelands Oak Credenza',
    slug: 'cape-winelands-oak-credenza',
    category: 'Storage',
    price: 14200.00,
    stock_quantity: 8,
    material: 'French Oak & Brushed Brass',
    width: 180, height: 80, depth: 45,
    is_active: true, is_featured: true,
    description: 'Minimalist sideboard with soft-close slatted oak doors.',
    sku: 'STG-OAK-003',
    product_images: [{ id: 'img-3', product_id: 'real-3', image_url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80', is_primary: true }]
  }
]

async function fetchLiveInventory() {
  if (props.products && props.products.length > 0) {
    liveProducts.value = props.products
    return
  }

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      liveProducts.value = (data as any[]).map(p => ({
        ...p,
        product_images: [...(p.product_images || [])].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      }))
    } else {
      liveProducts.value = defaultRealInventory
    }
  } catch (err) {
    console.error('Fetch live inventory error:', err)
    liveProducts.value = defaultRealInventory
  } finally {
    loading.value = false
  }
}

const displayBestsellers = computed(() => {
  const source = (props.products && props.products.length > 0) ? props.products : liveProducts.value
  const featured = source.filter(p => p.is_featured)
  return (featured.length > 0 ? featured : source).slice(0, 3)
})

const craftsmanshipImageUrl = computed(() => {
  const source = (props.products && props.products.length > 0) ? props.products : liveProducts.value
  if (source.length > 0 && source[0].product_images && source[0].product_images.length > 0) {
    return source[0].product_images[0].image_url
  }
  return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
})

function getPrimaryImageUrl(product: Product): string {
  if (product.product_images && product.product_images.length > 0) {
    const primary = product.product_images.find(img => img.is_primary)
    return primary ? primary.image_url : product.product_images[0].image_url
  }
  return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
}

function isWishlisted(productId: string): boolean {
  return (props.wishlist || []).some(item => item.id === productId)
}

const faqs = [
  {
    question: 'How is SAFS Furniture delivered across South Africa?',
    answer: 'We provide nationwide White-Glove furniture delivery across Gauteng, Western Cape, KZN, and all major provinces. Delivery includes room placement, unboxing, assembly, and packaging disposal.'
  },
  {
    question: 'Can I order custom dimensions for dining tables or credenzas?',
    answer: 'Yes! All SAFS Furniture pieces are handcrafted in our South African workshop. We can adjust width, length, height, and timber finishes to match your interior design project.'
  },
  {
    question: 'What wood materials do you use?',
    answer: 'We craft exclusively with 100% solid, sustainably harvested South African Teak, European & French Oak, Ash, and Walnut. We never use cheap particleboard or veneers.'
  },
  {
    question: 'What warranty is included?',
    answer: 'Every piece of SAFS Furniture is backed by our 10-Year Structural Timber Warranty against warping, joint separation, and structural defects.'
  }
]

function toggleFaq(idx: number) {
  activeFaq.value = activeFaq.value === idx ? null : idx
}

onMounted(() => {
  fetchLiveInventory()
  restartHeroTimer()
})

onBeforeUnmount(() => {
  if (heroTimer) clearInterval(heroTimer)
})
</script>

<template>
  <div class="space-y-16 pb-16 bg-stone-50/50">

    <!-- 1. HERO & TOP HEADER SECTION -->
    <header class="w-full bg-white shadow-xs border-b border-stone-200">

      <!-- Top Announcement Bar -->
      <div class="bg-[#f2ebd9] text-stone-800 text-xs py-2 px-4 md:px-8 font-medium">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex-1 text-center font-semibold">
            Enjoy up to 15% discount on first time buyers
          </div>
          <div class="hidden md:block text-right text-stone-700">
            Welcome to South African Furniture
          </div>
        </div>
      </div>

      <!-- Main Navigation Header -->
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        <!-- Search Box (Left) -->
        <div class="w-full md:w-80 flex items-center">
          <div class="relative w-full flex items-center border border-stone-900 rounded-none overflow-hidden">
            <input
              v-model="searchQuery"
              type="text"
              placeholder=""
              class="w-full px-3 py-1.5 text-sm bg-transparent focus:outline-none"
            />
            <button class="bg-black text-white p-2 flex items-center justify-center hover:bg-stone-800 transition-colors">
              <Search class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Brand Title (Center) -->
        <div class="text-center">
          <h1 class="text-xl md:text-2xl font-semibold text-stone-950 tracking-wide uppercase">
            Furniture
          </h1>
        </div>

        <!-- Quick Utility Icons (Right) -->
        <div class="flex items-center space-x-6 text-stone-800 text-[10px] uppercase font-bold tracking-wider">
          <button class="flex flex-col items-center space-y-1 hover:text-black transition-colors">
            <MapPin class="w-4 h-4 stroke-[1.5]" />
            <span>Find A Store</span>
          </button>

          <button @click="emit('navigate-admin')" class="flex flex-col items-center space-y-1 hover:text-black transition-colors">
            <User class="w-4 h-4 stroke-[1.5]" />
            <span>Sign In</span>
          </button>

          <button class="flex flex-col items-center space-y-1 hover:text-black transition-colors">
            <Truck class="w-4 h-4 stroke-[1.5]" />
            <span>Track Order</span>
          </button>

          <button
    @click="emit('open-wishlist')"
    class="group relative flex flex-col items-center space-y-1 transition-colors"
  >
    <span class="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full shadow-sm transition-all border border-rose-200">
      <Heart class="w-4 h-4 stroke-[1.5]" />
    </span>
    <span class="text-stone-800 group-hover:text-black">Wishlist</span>
    <span
      v-if="(props.wishlist?.length || 0) > 0"
      class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md"
    >
      {{ props.wishlist?.length }}
    </span>
  </button>

          <button @click="emit('open-cart')" class="group relative flex flex-col items-center space-y-1 transition-colors">
            <span class="p-2.5 bg-white/90 hover:bg-black hover:text-white text-stone-900 backdrop-blur-xs rounded-full shadow-md transition-all border border-stone-200">
              <ShoppingBag class="w-4 h-4 stroke-[1.5]" />
            </span>
            <span class="text-stone-800 group-hover:text-black">Cart</span>
          </button>
        </div>
      </div>

      <!-- Black Sub-Navigation Bar -->
      <nav class="bg-black text-white text-xs md:text-sm font-semibold tracking-wide">
        <div class="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <!-- Desktop links -->
          <div class="hidden md:flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              v-for="item in navCategories"
              :key="item"
              @click="emit('explore-catalog')"
              class="px-3 py-1.5 hover:text-stone-300 transition-colors cursor-pointer"
            >
              {{ item }}
            </button>
          </div>

          <!-- Mobile toggle -->
          <div class="md:hidden flex items-center justify-between">
            <button
              @click="mobileNavOpen = !mobileNavOpen"
              class="flex items-center space-x-2 hover:text-stone-300 transition-colors cursor-pointer"
            >
              <Menu v-if="!mobileNavOpen" class="w-5 h-5" />
              <X v-else class="w-5 h-5" />
              <span>Shop Categories</span>
            </button>
            <button @click="emit('explore-catalog')" class="hover:text-stone-300 transition-colors cursor-pointer">
              View All
            </button>
          </div>
        </div>

        <!-- Mobile dropdown menu -->
        <div
          v-if="mobileNavOpen"
          class="md:hidden border-t border-white/10 bg-stone-900"
        >
          <div class="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-1">
            <button
              v-for="item in navCategories"
              :key="item"
              @click="emit('explore-catalog')"
              class="px-3 py-3 text-left hover:bg-white/5 hover:text-stone-300 rounded-lg transition-colors cursor-pointer"
            >
              {{ item }}
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Hero Visual Showcase Banner -->
      <section class="relative w-full overflow-hidden bg-stone-100">
        <div class="relative w-full h-[400px] sm:h-[500px] md:h-[650px]">
          <Transition name="hero-fade">
            <img
              :key="heroIndex"
              :src="heroSlides[heroIndex].image"
              :alt="heroSlides[heroIndex].alt"
              class="w-full h-full object-cover object-center"
            />
          </Transition>

          <!-- Subtle vignette for realistic room depth -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

          <!-- Prev / Next Arrows -->
          <button
            @click="prevHero(); restartHeroTimer()"
            class="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 hover:bg-white text-stone-900 rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            @click="nextHero(); restartHeroTimer()"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 hover:bg-white text-stone-900 rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight class="w-5 h-5" />
          </button>

          <!-- Dots Indicator -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            <button
              v-for="(slide, idx) in heroSlides"
              :key="idx"
              @click="goToHero(idx); restartHeroTimer()"
              class="h-2 rounded-full transition-all duration-300 cursor-pointer"
              :class="idx === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'"
              :aria-label="`Go to slide ${idx + 1}`"
            ></button>
          </div>
        </div>
      </section>

      <!-- Value Props Ticker Below Hero -->
      <div class="bg-stone-900 text-stone-200 py-3.5 px-4 text-xs font-bold border-t border-stone-800">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="flex items-center justify-center space-x-2">
            <Award class="w-4 h-4 text-stone-400 shrink-0" />
            <span>100% Solid Hardwood</span>
          </div>
          <div class="flex items-center justify-center space-x-2">
            <ShieldCheck class="w-4 h-4 text-stone-400 shrink-0" />
            <span>10-Year Warranty</span>
          </div>
          <div class="flex items-center justify-center space-x-2">
            <Truck class="w-4 h-4 text-stone-400 shrink-0" />
            <span>White-Glove SA Delivery</span>
          </div>
          <div class="flex items-center justify-center space-x-2">
            <Hammer class="w-4 h-4 text-stone-400 shrink-0" />
            <span>Custom Made to Order</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 md:px-8 space-y-20">

      <!-- 2. FEATURED CATEGORIES GRID -->
      <section class="space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="text-xs font-extrabold text-stone-700 uppercase tracking-widest block">Curated Collections</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">Designed for Every Room</h2>
          <p class="text-slate-600 text-sm">Explore our specialized furniture categories tailored for luxury interiors.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card 1: Living Room -->
          <div
            @click="emit('explore-catalog')"
            class="group relative h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 cursor-pointer"
          >
            <img src="https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/a9411a86-b059-468b-9c03-c29e311bbb71/1787296485552-0.jpg" alt="Living Room" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span class="text-xs text-stone-300 font-bold uppercase tracking-wider">Seating & Lounging</span>
              <h3 class="text-xl font-extrabold">Living Room</h3>
              <p class="text-xs text-slate-300 line-clamp-1">Full-grain leather sofas & bouclé armchairs.</p>
            </div>
          </div>

          <!-- Card 2: Dining Room -->
          <div
            @click="emit('explore-catalog')"
            class="group relative h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 cursor-pointer"
          >
            <img src="https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/58d59cbc-43e5-4488-9068-8b0b4f45ffcb/1787293170209-1.jpg" alt="Dining Room" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span class="text-xs text-stone-300 font-bold uppercase tracking-wider">Dining & Gathering</span>
              <h3 class="text-xl font-extrabold">Dining Room</h3>
              <p class="text-xs text-slate-300 line-clamp-1">Solid teak & oak dining tables.</p>
            </div>
          </div>

          <!-- Card 3: Storage & Credenzas -->
          <div
            @click="emit('explore-catalog')"
            class="group relative h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 cursor-pointer"
          >
            <img src="https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/c1a82d73-957f-4f99-a34e-0c6aeb82562d/1786968369398-0.jpg" alt="Storage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span class="text-xs text-stone-300 font-bold uppercase tracking-wider">Sideboards & Cabinets</span>
              <h3 class="text-xl font-extrabold">Storage Credenzas</h3>
              <p class="text-xs text-slate-300 line-clamp-1">Slatted oak sideboards & media consoles.</p>
            </div>
          </div>

          <!-- Card 4: Accent Seating -->
          <div
            @click="emit('explore-catalog')"
            class="group relative h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 cursor-pointer"
          >
            <img src="https://vydleiyxfqrhxoddbcpi.supabase.co/storage/v1/object/public/product-images/abd82667-c642-4043-a57a-5fef2597dd23/1786602279649-0.jpg" alt="Accent Armchairs" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span class="text-xs text-stone-300 font-bold uppercase tracking-wider">Statement Pieces</span>
              <h3 class="text-xl font-extrabold">Accent Chairs</h3>
              <p class="text-xs text-slate-300 line-clamp-1">Sculptural bouclé & ash wood armchairs.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. CRAFTSMANSHIP & STORY SECTION -->
      <section id="craftsmanship" class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 md:p-14">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Image Left -->
          <div class="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group">
            <img
              :src="craftsmanshipImageUrl"
              alt="SAFS Furniture Authentic Timber Craftsmanship"
              class="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-900 border border-slate-200 shadow-md">
              📍 Real Timber Inventory — Supabase Storage
            </div>
          </div>

          <!-- Text Right -->
          <div class="lg:col-span-6 space-y-6">
            <div class="space-y-2">
              <span class="text-xs font-extrabold text-stone-700 uppercase tracking-widest block">The SAFS Furniture Guarantee</span>
              <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                Uncompromising Quality & Authentic Timber
              </h2>
              <p class="text-slate-600 text-sm leading-relaxed">
                We reject mass-produced veneers and synthetic boards. Every SAFS Furniture item is sculpted from solid hardwoods, hand-finished with organic wax sealants that highlight natural grain patterns.
              </p>
            </div>

            <div class="space-y-3 pt-2">
              <div class="flex items-start space-x-3">
                <CheckCircle2 class="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-bold text-slate-900 text-sm">Sustainably Harvested Hardwoods</h4>
                  <p class="text-xs text-slate-500">Certified solid teak, French oak, and ash wood sourced responsibly.</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <CheckCircle2 class="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-bold text-slate-900 text-sm">Mortise & Tenon Joinery</h4>
                  <p class="text-xs text-slate-500">Traditional wood joinery methods providing structural stability that lasts decades.</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <CheckCircle2 class="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-bold text-slate-900 text-sm">Non-Toxic Natural Wax Sealants</h4>
                  <p class="text-xs text-slate-500">Eco-friendly protective finishes safe for indoor environments and family living.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. REAL INVENTORY BESTSELLERS SHOWCASE -->
      <section class="space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span class="text-xs font-extrabold text-stone-700 uppercase tracking-widest block">Real Inventory</span>
            <h2 class="text-3xl font-extrabold text-slate-900">Featured Best Sellers</h2>
          </div>

          <button
            @click="emit('explore-catalog')"
            class="inline-flex items-center space-x-2 text-sm font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>View Entire Collection</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Inventory Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="product in displayBestsellers"
            :key="product.id"
            class="bg-white border border-slate-200 hover:border-stone-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div class="relative h-64 overflow-hidden bg-slate-100 cursor-pointer" @click="emit('select-product', product)">
              <img
                :src="getPrimaryImageUrl(product)"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute top-3 left-3 px-3 py-1 bg-stone-700 text-white text-xs font-bold rounded-lg shadow-md uppercase tracking-wider">
                Best Seller
              </div>
              <div class="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-semibold rounded-lg shadow-sm border border-slate-200">
                {{ product.category }}
              </div>

              <!-- Wishlist Toggle -->
              <button
                @click.stop="emit('toggle-wishlist', product)"
                class="absolute top-3 right-3 p-2 rounded-full shadow-md transition-all cursor-pointer"
                :class="isWishlisted(product.id) ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-600 hover:bg-white border border-slate-200'"
                :title="isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
              >
                <Heart class="w-4 h-4" :class="isWishlisted(product.id) ? 'fill-current' : ''" />
              </button>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-1 cursor-pointer" @click="emit('select-product', product)">
                <h3 class="text-lg font-extrabold text-slate-900 group-hover:text-stone-700 transition-colors">
                  {{ product.name }}
                </h3>
                <p class="text-slate-500 text-xs line-clamp-2">{{ product.description || 'Solid hardwood furniture piece from SAFS Furniture.' }}</p>
              </div>

              <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
                <div class="flex items-center space-x-2">
                  <button
                    @click.stop="emit('select-product', product)"
                    class="px-3.5 py-2 bg-stone-50 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    @click.stop="emit('quick-add-to-cart', product)"
                    class="p-2 bg-stone-700 hover:bg-stone-800 text-white rounded-xl shadow-sm cursor-pointer"
                    title="Quick Add to Cart"
                  >
                    <ShoppingBag class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) -->
      <section class="max-w-4xl mx-auto space-y-6">
        <div class="text-center space-y-2">
          <span class="text-xs font-extrabold text-stone-700 uppercase tracking-widest block">Got Questions?</span>
          <h2 class="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <span class="text-base">{{ faq.question }}</span>
              <ChevronUp v-if="activeFaq === idx" class="w-5 h-5 text-stone-700" />
              <ChevronDown v-else class="w-5 h-5 text-slate-400" />
            </button>

            <div v-if="activeFaq === idx" class="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.8s ease;
}

.hero-fade-leave-active {
  position: absolute;
  inset: 0;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../utils/supabase'
import { Lock, Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-vue-next'

const emit = defineEmits(['authenticated'])

const isSignUpMode = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

async function handleSubmit() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isSignUpMode.value) {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      if (data.session) {
        successMessage.value = 'Admin account created successfully!'
        emit('authenticated', data.user)
      } else {
        successMessage.value = 'Account registration initiated. Check email or sign in.'
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      if (data.user) {
        successMessage.value = 'Welcome back, Admin!'
        emit('authenticated', data.user)
      }
    }
  } catch (err: any) {
    console.error('Auth error:', err)
    errorMessage.value = err.message || 'Authentication failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
    <div class="text-center space-y-2">
      <div class="w-12 h-12 bg-blue-100 border border-blue-200 text-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
        <Lock class="w-6 h-6" />
      </div>
      <h2 class="text-2xl font-black text-slate-900">
        {{ isSignUpMode ? 'Create Admin Account' : 'Admin Portal Sign In' }}
      </h2>
      <p class="text-xs text-slate-500">
        Sign in to manage catalog items, upload image assets, and control inventory.
      </p>
    </div>

    <!-- Alert Messages -->
    <div v-if="errorMessage" class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2 font-medium">
      <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
      <span>{{ errorMessage }}</span>
    </div>

    <div v-if="successMessage" class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center space-x-2 font-medium">
      <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
      <span>{{ successMessage }}</span>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-700 block">Admin Email</label>
        <div class="relative">
          <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@furniturehaven.co.za"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-xs font-bold text-slate-700 block">Password</label>
        <div class="relative">
          <KeyRound class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••••••"
            class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            :title="showPassword ? 'Hide password' : 'Show password'"
          >
            <Eye v-if="!showPassword" class="w-4 h-4" />
            <EyeOff v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-700/20 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
      >
        <span v-if="loading">Signing In...</span>
        <template v-else>
          <span>{{ isSignUpMode ? 'Register Admin Account' : 'Sign In to Portal' }}</span>
          <ArrowRight class="w-4 h-4" />
        </template>
      </button>
    </form>

    <!-- Toggle Mode -->
    <div class="text-center pt-3 border-t border-slate-100">
      <button
        @click="isSignUpMode = !isSignUpMode; errorMessage = ''; successMessage = ''"
        class="text-xs text-slate-500 hover:text-blue-700 transition-colors font-medium cursor-pointer"
      >
        {{ isSignUpMode ? 'Already have an account? Sign In' : 'Need to register a new admin account? Click here' }}
      </button>
    </div>
  </div>
</template>

<!-- src/views/Collection.vue -->
<template>
  <div class="container mx-auto px-4">
    <main>
      <!-- Pesan error -->
      <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>

      <!-- Search input -->
      <div class="mb-4">
        <div class="relative inline-block mb-10">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="🔍 Cari Pokémon di Koleksi..."
            class="w-full p-3 pl-4 pr-12 border-2 border-gray-300 focus:outline-none focus:border-yellow-400 rounded-full transition-all duration-300 text-sm shadow-sm"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-400 text-white text-xs px-2 py-1 rounded-full hover:bg-red-500 transition-all"
          >
            Clear
          </button>
          <div v-if="isSearchLoading" class="loader2 absolute right-10 top-1/2 transform -translate-y-1/2"></div>
        </div>
      </div>

      <!-- Koleksi kosong -->
      <div v-if="!isLoading && displayedCollection.length === 0" class="text-center my-8">
        <img src="../assets/img/logo-catch.png" alt="Empty Collection" class="mx-auto mb-4" />
        <p class="font-extra text-xl mb-4">You haven't caught any Pokémon yet</p>
        <router-link to="/">
          <button class="bg-yellow-400 px-4 py-2 rounded-lg">Catch Pokémon</button>
        </router-link>
      </div>

      <!-- Grid Koleksi -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-14 mb-8">
        <div
          v-for="poke in displayedCollection"
          :key="poke.captureTime"
          class="p-8 lg:p-10 relative flex items-center justify-between bg-white transform hover:-translate-y-2 rounded-xl group shadow-md"
        >
          <!-- Tombol Release -->
          <button
            @click.stop="openDeleteModal(poke)"
            class="absolute top-2 left-2 text-red-500 text-2xl font-bold cursor-pointer"
            aria-label="Release Pokémon"
          >&times;</button>

          <router-link :to="`/pokemon/${poke.name.toLowerCase()}`">
            <div><p class="font-semi group-hover:text-yellow-500">#{{ poke.idString }}</p>
            <p class="font-extra font-bold text-2xl text-black-0">{{ poke.name }}</p></div>
            <img :src="poke.image" :alt="poke.name" class="w-40 xl:w-44 h-auto absolute -top-8 lg:-top-14 -right-1 lg:-right-5 z-10" />
          </router-link>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="!searchQuery && !noMoreData && displayedCollection.length" class="flex justify-center mb-12">
        <button @click="fetchMore" :disabled="isLoading" class="px-6 py-2 text-sm rounded-full bg-yellow-400 hover:bg-yellow-500 transition font-semibold shadow-md">
          <span v-if="isLoading" class="loader mr-2"></span>{{ isLoading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </main>

    <!-- Modal Konfirmasi Release -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-2xl w-80">
        <p class="font-semi mb-4 text-center">
          Release {{ pokemonToDelete?.name }}?
        </p>
        <div class="flex justify-around">
          <button @click="confirmDelete" class="px-4 py-2 bg-red-500 rounded-lg text-white">Yes</button>
          <button @click="cancelDelete" class="px-4 py-2 bg-gray-300 rounded-lg">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

type Caught = {
  captureTime: number
  id: number
  name: string
  image: string
}

// state
const router = useRouter()
const collection = ref<Caught[]>([])
const searchQuery = ref('')
const filtered = ref<Caught[]>([])
const displayedCollection = ref<Caught[]>([])
const isSearchLoading = ref(false)
const isLoading = ref(false)
const noMoreData = ref(false)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)
const pokemonToDelete = ref<Caught | null>(null)
const limit = 21
let offset = 0

// helper untuk format ID
function pad4(n: number) { return String(n).padStart(4, '0') }

// load dari API per‐user
async function loadCollection() {
  try {
    error.value = null
    isLoading.value = true
    const userId = localStorage.getItem('device-id')!
    const res = await fetch('https://pokemon-backend-production-655f.up.railway.app/pokemon/caught', {
      headers: { 'x-user-id': userId }
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data: Caught[] = await res.json()
    // tambahkan idString dan sort
    collection.value = data.map(c => ({ ...c, idString: pad4(c.pokemonId) } as any))
      .sort((a,b)=>b.captureTime - a.captureTime)
  } catch (e: any) {
    error.value = e.message
  } finally {
    isLoading.value = false
    updateDisplayed()
  }
}

// search debounce
watch(searchQuery, (q) => {
  isSearchLoading.value = !!q
  if (!q) {
    filtered.value = []
    isSearchLoading.value = false
  } else {
    filtered.value = collection.value
      .filter(c=>c.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 50)
    setTimeout(()=> isSearchLoading.value = false, 300)
  }
})

// pagination / display logic
function updateDisplayed() {
  if (searchQuery.value) {
    displayedCollection.value = filtered.value
  } else {
    const end = offset + limit
    displayedCollection.value = collection.value.slice(0, end)
    noMoreData.value = end >= collection.value.length
  }
}
function fetchMore() {
  isLoading.value = true
  setTimeout(()=>{
    offset += limit
    isLoading.value = false
    updateDisplayed()
  }, 300)
}
function clearSearch() {
  searchQuery.value = ''
}

// delete
function openDeleteModal(p: Caught) {
  pokemonToDelete.value = p
  showDeleteModal.value = true
}
async function confirmDelete() {
  // panggil API delete (jika Anda punya),  
  // atau localStorage jika belum:
  collection.value = collection.value.filter(c=>c.captureTime!==pokemonToDelete.value!.captureTime)
  showDeleteModal.value = false
  updateDisplayed()
}
function cancelDelete() {
  showDeleteModal.value = false
}

// on mount
onMounted(loadCollection)
</script>

<style scoped>
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px; height: 16px;
  animation: spin 1s linear infinite;
}
.loader2 {
  border: 2px solid rgba(0,0,0,0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 16px; height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>

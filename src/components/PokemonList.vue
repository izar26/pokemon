<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import footer from './footer.vue'

const pokemons = ref([])
const allPokemonList = ref([]) // Menyimpan daftar lengkap (nama dan url)
const searchResults = ref([])
const isLoading = ref(false)
const isSearchLoading = ref(false) // Loading khusus untuk pencarian
const error = ref(null)
const limit = 21
let offset = 0
const noMoreData = ref(false)
const searchQuery = ref('')

// Fungsi fetch paginated (untuk browsing)
const fetchPokemons = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    if (data.results.length < limit) {
      noMoreData.value = true
    }
    // Dapatkan detail tiap Pokémon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        const details = await res.json()
        // Jangan ubah URL gambar
        const image =
          details.sprites?.other?.['official-artwork']?.front_default ||
          details.sprites?.front_default
        return {
          id: details.id.toString().padStart(4, '0'),
          name: details.name.charAt(0).toUpperCase() + details.name.slice(1),
          image,
        }
      }),
    )
    pokemons.value = [...pokemons.value, ...pokemonDetails]
    offset += limit
  } catch (err) {
    error.value = `Error fetching Pokémon: ${err.message}`
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Fetch daftar lengkap untuk pencarian (hanya nama dan url)
const fetchAllPokemonList = async () => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    allPokemonList.value = data.results
  } catch (err) {
    console.error('Error fetching full Pokemon list:', err)
  }
}

onMounted(() => {
  fetchPokemons()
  fetchAllPokemonList()
})

// Jika ada pencarian, cari dari allPokemonList dan ambil detail (maksimal 50 hasil)
watch(searchQuery, async (newQuery) => {
  // Mulai loading pencarian
  isSearchLoading.value = true
  if (!newQuery.trim()) {
    searchResults.value = []
    isSearchLoading.value = false
    return
  }
  const filtered = allPokemonList.value
    .filter((item) => item.name.toLowerCase().includes(newQuery.toLowerCase()))
    .slice(0, 50)
  const results = []
  for (const item of filtered) {
    let detail = pokemons.value.find((p) => p.name.toLowerCase() === item.name.toLowerCase())
    if (!detail) {
      // Cek cache searchResults
      detail = searchResults.value.find((p) => p.name.toLowerCase() === item.name.toLowerCase())
    }
    if (!detail) {
      try {
        const res = await fetch(item.url)
        if (res.ok) {
          const data = await res.json()
          const image =
            data.sprites?.other?.['official-artwork']?.front_default ||
            data.sprites?.front_default
          detail = {
            id: data.id.toString().padStart(4, '0'),
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            image,
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (detail) {
      results.push(detail)
    }
  }
  searchResults.value = results
  isSearchLoading.value = false
})

// Jika search aktif, tampilkan searchResults, jika tidak, tampilkan data paginated
const displayedPokemons = computed(() => {
  return searchQuery.value.trim() ? searchResults.value : pokemons.value
})
</script>

<template>
  <div class="container mx-auto px-4">
    <main>
      <!-- Pesan error -->
      <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>

      <!-- Search input -->
      <div class="mb-4">
        <div class="relative inline-block ml-105 mb-10">
          <!-- Menggunakan w-100 sesuai permintaan -->
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search Pokémon"
            class="w-101 p-2 border rounded-lg text-sm"
          />
          <!-- Loader kecil di dalam search jika isSearchLoading -->
          <div v-if="isSearchLoading" class="loader2 absolute right-2 top-2"></div>
        </div>
      </div>

      <!-- Notifikasi jika tidak ada hasil pencarian -->
      <div
        v-if="!isLoading && searchQuery.trim() && displayedPokemons.length === 0"
        class="text-center mb-8"
      >
        <p class="font-extra text-xl">No results found.</p>
      </div>

      <!-- Animasi loading berputar sebelum ada data -->
      <div
        v-if="isLoading && pokemons.length === 0"
        class="flex justify-center items-center h-screen"
      >
        <div class="loader"></div>
      </div>

      <!-- Grid kartu Pokémon -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-14 mb-8">
        <div
          v-for="pokemon in displayedPokemons"
          :key="pokemon.id"
          class="p-8 lg:p-10 relative flex items-center justify-between bg-white transform transition-transform duration-300 hover:-translate-y-2 rounded-xl group"
        >
          <router-link :to="`/pokemon/${pokemon.name}`">
            <div>
              <p class="font-semi group-hover:text-yellow-500">#{{ pokemon.id }}</p>
              <p class="font-extra font-bold text-2xl text-black-0">{{ pokemon.name }}</p>
            </div>
            <div class="absolute z-10 -top-5 lg:-top-12 right-0 lg:right-5">
              <img src="@/assets/img/logo-bg.png" alt="pokeball" class="w-24" />
            </div>
            <div class="absolute z-10 top-12 -left-0">
              <img src="https://pokedex-power.vercel.app/assets/dots.svg" alt="dots" class="w-24" />
            </div>
            <div class="absolute z-10 -top-8 lg:-top-14 -right-1 lg:-right-5">
              <img :src="pokemon.image" :alt="pokemon.name" class="w-40 xl:w-44 h-auto" />
            </div>
          </router-link>
        </div>

        <!-- Skeleton tambahan saat load more (jika sedang loading dan data sudah ada) -->
        <div
          v-if="isLoading && pokemons.length > 0"
          class="p-8 lg:p-10 relative flex flex-col items-center bg-white rounded-xl group animate-pulse"
        >
          <div class="w-12 h-6 bg-gray-300 mb-2"></div>
          <div class="w-32 h-8 bg-gray-300 mb-4"></div>
          <div class="w-40 h-40 bg-gray-300"></div>
        </div>
      </div>

      <!-- Tombol Load More hanya jika pencarian kosong dan masih ada data -->
      <div
        v-if="!isLoading && !searchQuery.trim() && !noMoreData"
        class="flex items-center justify-center mb-5"
      >
        <button
          @click="fetchPokemons"
          :disabled="isLoading"
          class="bg-white px-4 py-2 rounded-full flex items-center"
        >
          <span v-if="isLoading" class="loader mr-2"></span>
          <p>{{ isLoading ? 'Loading...' : 'Load More' }}</p>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Loader utama untuk menampilkan loading berputar */
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

/* Loader kecil di dalam search input */
.loader2 {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

/* Definisi w-100 (jika belum ada) untuk lebar 100% */
.w-100 {
  width: 100%;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

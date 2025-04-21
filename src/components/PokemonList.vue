        <script setup>
        import { ref, onMounted, computed } from 'vue'
        
        const pokemons     = ref([])
        const isLoading    = ref(false)
        const error        = ref(null)
        const searchQuery  = ref('')
        const limit        = ref(9)
        const showAll      = ref(false)
        const userId       = ref(localStorage.getItem('device-id') || '')
        
        // Pastikan device-id tersedia
        function ensureDeviceId() {
          if (!userId.value) {
            const newId = crypto.randomUUID()
            localStorage.setItem('device-id', newId)
            userId.value = newId
          }
        }
        
        // Fetch dari DB
        async function fetchPokemonsFromDatabase() {
          isLoading.value = true
          error.value     = null
          try {
            ensureDeviceId()
            const res = await fetch('https://pokemon-backend-production-655f.up.railway.app/pokemon', {
              headers: { 'x-user-id': userId.value }
            })
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
            const data = await res.json()
            pokemons.value = data.map(p => ({
              id:   String(p.id).padStart(4, '0'),
              name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
              image: p.image
            }))
          } catch (err) {
            error.value = `Error fetching Pokémon from DB: ${err.message}`
            console.error(err)
          } finally {
            isLoading.value = false
          }
        }
        
        const filteredPokemons = computed(() => {
          const arr = searchQuery.value.trim()
            ? pokemons.value.filter(p =>
                p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
              )
            : pokemons.value
        
          return showAll.value ? arr : arr.slice(0, limit.value)
        })
        
        function loadMore() {
          if (filteredPokemons.value.length >= pokemons.value.length) {
            showAll.value = true
          } else {
            limit.value += 9
          }
        }
        
        function resetPagination() {
          limit.value   = 9
          showAll.value = false
        }
        
        function clearSearch() {
          searchQuery.value = ''
          resetPagination()
        }
        
        onMounted(fetchPokemonsFromDatabase)
        </script>
<!-- src/views/PokemonList.vue -->
<template>
  <div class="container mx-auto px-4">
    <main>
      <!-- Error Message -->
      <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>

      <!-- Tampilkan User ID -->
      <p class="text-sm text-gray-500 text-center mb-4">
        User ID: {{ userId }}
      </p>

      <!-- Search Bar -->
      <div class="mb-6 relative">
        <input
          type="text"
          v-model="searchQuery"
          @keydown.enter="resetPagination"
          placeholder="🔍 Cari Pokémon..."
          class="w-full p-3 pl-4 pr-12 border-2 border-gray-300 focus:outline-none focus:border-yellow-400 rounded-full transition-all duration-300 text-sm shadow-sm"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-400 text-white text-xs px-2 py-1 rounded-full hover:bg-red-500 transition-all"
        >
          Clear
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isLoading && pokemons.length === 0" class="flex justify-center items-center h-screen">
        <div class="loader"></div>
      </div>

      <!-- No Pokémon Found -->
      <div
        v-else-if="!isLoading && filteredPokemons.length === 0"
        class="text-center font-extra text-xl"
      >
        Tidak ada Pokémon ditemukan.
      </div>

      <!-- Pokémon Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-14 mb-8 transition-all duration-300"
      >
        <div
          v-for="poke in filteredPokemons"
          :key="poke.id"
          class="p-8 lg:p-10 relative flex items-center justify-between bg-white transform hover:-translate-y-2 rounded-xl group shadow-md"
        >
          <router-link :to="`/pokemon/${poke.name.toLowerCase()}`">
            <div>
              <p class="font-semi group-hover:text-yellow-500">#{{ poke.id }}</p>
              <p class="font-extra font-bold text-2xl text-black-0">{{ poke.name }}</p>
            </div>
            <div class="absolute z-10 -top-5 lg:-top-12 right-0 lg:right-5">
              <img src="@/assets/img/logo-bg.png" alt="pokeball" class="w-24" />
            </div>
            <div class="absolute z-10 top-12 -left-0">
              <img src="https://pokedex-power.vercel.app/assets/dots.svg" alt="dots" class="w-24" />
            </div>
            <div class="absolute z-10 -top-8 lg:-top-14 -right-1 lg:-right-5">
              <img :src="poke.image" :alt="poke.name" class="w-40 xl:w-44 h-auto" />
            </div>
          </router-link>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="!showAll && filteredPokemons.length >= limit" class="flex justify-center mb-12">
        <button
          @click="loadMore"
          class="px-6 py-2 text-sm rounded-full bg-yellow-400 hover:bg-yellow-500 transition font-semibold shadow-md"
        >
          Load More
        </button>
      </div>
    </main>
  </div>
</template>


<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'

const pokemons = ref([])
const isLoading = ref(false)
const error = ref(null)
const limit = 21
let offset = 0

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

    // Dapatkan detail tiap Pokémon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        const details = await res.json()
        // Gunakan optional chaining agar aman jika artwork tidak ada, fallback ke sprite default
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

onMounted(() => {
  fetchPokemons()
})
</script>

<template>
  <div class="container mx-auto px-4">
    <main>
      <!-- Tampilkan pesan error jika ada -->
      <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>

      <!-- Animasi loading berputar sebelum kartu muncul -->
      <div v-if="isLoading && pokemons.length === 0" class="flex justify-center items-center h-screen">
        <div class="loader"></div>
      </div>

      <!-- Grid untuk menampilkan kartu Pokémon -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-14 mb-8">
        <div
          v-for="pokemon in pokemons"
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
      </div>

      <!-- Tombol "Load More" dengan indikator loading -->
      <div class="flex items-center justify-center mb-5">
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
/* Gaya untuk loader berputar */
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

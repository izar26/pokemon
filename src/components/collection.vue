<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const collection = ref([])

function loadCollection() {
  const saved = localStorage.getItem('collection')
  if (saved) {
    collection.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadCollection()
})

// Computed untuk mengurutkan koleksi berdasarkan waktu penangkapan (terbaru di atas)
const collectionSorted = computed(() => {
  return collection.value.sort((a, b) => b.captureTime - a.captureTime)
})

// Dummy variable dan function untuk "Load More" (load more hanya muncul jika koleksi > 21)
const isLoading = ref(false)
const error = ref(null)
const fetchMore = () => {
  // Implementasikan pagination atau load lebih lanjut jika diinginkan
}

// --- Fitur Release (Hapus) dengan Modal ---
const showDeleteModal = ref(false)
const pokemonToDelete = ref(null)

function openDeleteModal(pokemonItem, event) {
  // Mencegah router-link terpanggil
  event.stopPropagation()
  showDeleteModal.value = true
  pokemonToDelete.value = pokemonItem
}

function confirmDelete() {
  const index = collection.value.findIndex(
    (item) => item.captureTime === pokemonToDelete.value.captureTime
  )
  if (index !== -1) {
    collection.value.splice(index, 1)
    localStorage.setItem('collection', JSON.stringify(collection.value))
  }
  showDeleteModal.value = false
  pokemonToDelete.value = null
}

function cancelDelete() {
  showDeleteModal.value = false
  pokemonToDelete.value = null
}
</script>

<template>
  <div class="container mx-auto px-4">
    <main>
      <!-- Tampilkan pesan error jika ada -->
      <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>

      <!-- Jika koleksi kosong, tampilkan pesan empty state -->
      <div v-if="collectionSorted.length === 0" class="text-center my-8">
        <img src="../assets/img/logo-catch.png" alt="Empty Collection" class="mx-auto mb-4" />
        <p class="font-extra text-xl mb-4">You haven't caught any Pokémon yet</p>
        <router-link :to="'/'">
          <button class="bg-yellow-400 px-4 py-2 rounded-lg">
            Catch Pokémon
          </button>
        </router-link>
      </div>

      <!-- Jika koleksi tidak kosong, tampilkan grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-14 mb-8">
          <div
            v-for="pokemon in collectionSorted"
            :key="pokemon.captureTime"
            class="p-8 lg:p-10 relative flex items-center justify-between bg-white transform transition-transform duration-300 hover:-translate-y-2 rounded-xl group"
          >
            <!-- Tombol Release (icon x) di pojok kiri atas -->
            <button
              @click.stop="openDeleteModal(pokemon, $event)"
              class="absolute top-2 left-2 text-red-500 text-2xl font-bold cursor-pointer"
              aria-label="Release Pokémon"
            >
              &times;
            </button>
            <router-link :to="`/pokemon/${pokemon.name}`">
              <div>
                <p class="font-semi group-hover:text-yellow-500">#{{ pokemon.id }}</p>
                <p class="font-extra font-bold text-2xl text-black-0">{{ pokemon.name }}</p>
              </div>
              <div class="absolute z-10 -top-5 lg:-top-12 right-0 lg:right-5">
                <img src="../assets/img/logo-catch.png" alt="pokeball" class="w-24" />
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

        <!-- Tombol Load More muncul jika koleksi lebih dari 21 item -->
        <div v-if="collectionSorted.length > 21" class="flex items-center justify-center mb-5">
          <button
            @click="fetchMore"
            :disabled="isLoading"
            class="bg-white px-4 py-2 rounded-full flex items-center"
          >
            <span v-if="isLoading" class="loader mr-2"></span>
            <p>{{ isLoading ? 'Loading...' : 'Load More' }}</p>
          </button>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal Konfirmasi Release -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-2xl w-80">
      <p class="font-semi mb-4 text-center">
        Are you sure you want to release {{ pokemonToDelete?.name }}?
      </p>
      <div class="flex justify-around">
        <button @click="confirmDelete" class="px-4 py-2 bg-green-400 rounded-lg text-white">
          Yes
        </button>
        <button @click="cancelDelete" class="px-4 py-2 bg-red-400 rounded-lg text-white">
          No
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Gaya untuk loader sederhana */
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const classLogo = 'w-32 lg:w-36 h-auto -mt-4 cursor-pointer'
const classCatch = 'w-5 h-auto ml-3 cursor-pointer'

// Ambil koleksi dari localStorage dan hitung jumlahnya
const collection = ref([])

function loadCollection() {
  const saved = localStorage.getItem('collection')
  if (saved) {
    try {
      collection.value = JSON.parse(saved)
    } catch (error) {
      collection.value = []
    }
  } else {
    collection.value = []
  }
}

onMounted(() => {
  loadCollection()
  // Event listener untuk mendeteksi perubahan di localStorage (dari tab lain)
  window.addEventListener('storage', loadCollection)
  // Opsional: Polling setiap 1 detik untuk memastikan update (jika perubahan terjadi di tab yang sama)
  pollingInterval = setInterval(loadCollection, 1000)
})

let pollingInterval = null
onBeforeUnmount(() => {
  window.removeEventListener('storage', loadCollection)
  if (pollingInterval) clearInterval(pollingInterval)
})

const catchCount = computed(() => collection.value.length)
</script>

<template>
  <main>
    <div class="mx-auto px-4">
      <header class="flex items-center justify-between mt-5 mb-12 lg:mb-24">
        <div>
          <img src="../assets/img/logo-pokemon.png" alt="pokemon-logo" :class="classLogo" />
        </div>
        <!-- Bungkus tombol Catch dan Collection dalam satu flex container -->
        <div class="flex items-center space-x-4">
          <div
            class="card-catch px-5 py-2 bg-sky-200 rounded-full hover:bg-yellow-400 flex items-center justify-between"
          >
            <router-link :to="'/'" class="flex items-center">
              <p class="font-semi">catch</p>
              <img src="../assets/img/logo-catch.png" alt="catch" :class="classCatch" />
            </router-link>
          </div>
          <div
            class="card-catch px-5 py-2 bg-sky-200 rounded-full hover:bg-yellow-400 flex items-center justify-between"
          >
            <!-- Tombol tambahan untuk menuju halaman Collection -->
            <router-link to="/collection" class="flex items-center">
              <p class="font-semi">Collection</p>
              <img src="../assets/img/logo-catch.png" alt="collection" :class="classCatch" />
            </router-link>
          </div>
        </div>
      </header>
    </div>
  </main>
</template>

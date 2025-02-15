<template>
  <div :style="{ backgroundColor: backgroundColor }" class="min-h-screen rounded-2xl">
    <div class="container mx-5 lg:mx-24">
      <div v-if="errorMessage" class="text-red-500 text-center my-4">{{ errorMessage }}</div>
      <main v-if="pokemon" class="mb-8 -mt-8 lg:-mt-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Bagian Detail Pokémon -->
          <div class="my-5">
            <div class="flex items-center justify-center">
              <div class="relative w-full">
                <div class="absolute right-10 lg:right-52 inset-y-24">
                  <img src="../assets/img/logo-bg.png" alt="pokeball" />
                </div>
                <div class="absolute bottom-0 left-24">
                  <img src="https://pokedex-power.vercel.app/assets/dots.svg" alt="dots" class="w-24" />
                </div>
                <div class="text-center">
                  <p class="font-semi">#{{ pokemon.id.toString().padStart(4, '0') }}</p>
                  <div class="flex items-center justify-center">
                    <img src="../assets/img/pokeSmall.png" alt="pokesmall" class="mr-2" />
                    <p class="font-extra text-3xl tracking-widest text-black-0">{{ pokemon.name }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-center">
                  <img :src="pokemon.image" :alt="pokemon.name" class="w-72" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-6 lg:mt-4">
              <!-- Tombol Catch: klik akan memicu attemptCatch -->
              <div
                class="card-catch px-5 py-2 rounded-2xl bg-sky-100 hover:bg-yellow-400 flex items-center justify-between cursor-pointer"
                @click="attemptCatch"
              >
                <img
                  src="../assets/img/logo-catch.png"
                  alt="logo-pokemon"
                  class="w-8 h-auto mr-2 cursor-pointer animate-bounce"
                />
                <p class="font-semi">Catch {{ pokemon.name }}</p>
              </div>
            </div>
          </div>

          <!-- Bagian Tab Detail -->
          <div class="bg-white rounded-2xl my-5 card w-full lg:w-9/12 px-6 py-3">
            <div class="mb-8 bg-white rounded-2xl shadow-2xl">
              <div class="home-switch flex justify-around items-center px-1 py-2">
                <div
                  @click="activeTab = 'about'"
                  :class="[
                    'cursor-pointer',
                    'py-1',
                    'px-5',
                    'rounded-2xl',
                    { 'home-switch-active bg-yellow-400': activeTab === 'about' },
                  ]"
                >
                  About
                </div>
                <div
                  @click="activeTab = 'status'"
                  :class="[
                    'cursor-pointer',
                    'py-1',
                    'px-5',
                    'rounded-2xl',
                    { 'home-switch-active bg-yellow-400': activeTab === 'status' },
                  ]"
                >
                  Status
                </div>
                <div
                  @click="activeTab = 'moves'"
                  :class="[
                    'cursor-pointer',
                    'py-1',
                    'px-5',
                    'rounded-2xl',
                    { 'home-switch-active bg-yellow-400': activeTab === 'moves' },
                  ]"
                >
                  Moves
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'about'" class="tab-content">
              <!-- Konten About (tetap sama dengan style Anda) -->
              <div class="grid grid-cols-3 gap-3 mb-5 lg:mb-3">
                <p class="font-semi">Types</p>
                <div class="col-span-2 flex items-center">
                  <div
                    v-for="(type, index) in pokemon.types"
                    :key="index"
                    :class="`type-${type}`"
                    class="bg-gray-300 px-3 text-base text-black-0 rounded-md mr-2"
                  >
                    {{ type }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-5 lg:mb-3">
                <p class="font-semi">Height</p>
                <p class="col-span-2">{{ pokemon.height }}</p>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-5 lg:mb-3">
                <p class="font-semi">Weight</p>
                <p class="col-span-2">{{ pokemon.weight }}</p>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-1">
                <p class="font-semi">Abilities</p>
                <div class="col-span-2">
                  <div class="flex flex-wrap">
                    <div
                      v-for="(ability, index) in pokemon.abilities"
                      :key="index"
                      class="bg-yellow-200 px-3 text-base text-black-0 rounded-md mr-2 mb-2"
                    >
                      {{ ability }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-5 lg:mb-3">
                <p class="font-semi">Experience</p>
                <p class="col-span-2">{{ pokemon.experience }} (Exp)</p>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-5 lg:mb-3">
                <p class="font-semi">Average Stats</p>
                <p class="col-span-2">{{ pokemon.averageStats }}</p>
              </div>
            </div>

            <div v-if="activeTab === 'status'" class="tab-content">
              <div class="w-full lg:px-10">
                <div class="mb-5 lg:mb-3" v-for="(stat, index) in orderedStats" :key="index">
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center">
                      <img :src="getStatIcon(stat.stat.name)" alt="stat-icon" class="mr-2" />
                      <p class="font-semi">{{ capitalize(stat.stat.name) }}</p>
                    </div>
                    <p class="font-semi">{{ stat.base_stat }}</p>
                  </div>
                  <div class="relative w-full h-2 bg-red-100 rounded-lg">
                    <div
                      class="h-2 bg-yellow-400 rounded-lg"
                      :style="{ width: calculateWidth(stat.base_stat) }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'moves'" class="tab-content">
              <div class="overflow-y-scroll moves-scroll h-80 -mr-3">
                <div class="grid grid-rows-1 grid-cols-2 lg:grid-cols-3 gap-5 mb-3 pr-3">
                  <div
                    v-for="(move, index) in pokemon.moves"
                    :key="index"
                    class="border border-dashed py-2 hover:border-yellow-400"
                  >
                    <p class="text-center text-sm">{{ move.move.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Bagian Tab -->
        </div>
      </main>
    </div>

    <!-- Modal Catch -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-2xl w-80">
        <div v-if="catchInProgress" class="text-center">
          <p class="font-semi mb-4">Sedang menangkap Pokémon...</p>
          <!-- Gambar animasi menangkap, misalnya gambar yang berputar atau melompat -->
          <img src="../assets/img/logo-catch.png" alt="catching" class="w-20 mx-auto animate-spin" />
        </div>
        <div v-else>
          <div v-if="modalPokemon">
            <div class="text-center mb-4">
              <img :src="modalPokemon.image" :alt="modalPokemon.name" class="w-40 mx-auto" />
              <p class="font-extra text-xl mt-2">{{ modalPokemon.name }}</p>
              <p class="text-sm">Tipe: {{ modalPokemon.types.join(', ') }}</p>
            </div>
            <div class="flex justify-around">
              <button
                @click="capturePokemon"
                class="px-4 py-2 bg-green-400 rounded-lg text-white"
              >
                Tangkap
              </button>
              <button
                @click="closeModal"
                class="px-4 py-2 bg-red-400 rounded-lg text-white"
              >
                Lepaskan
              </button>
            </div>
          </div>
          <div v-else class="text-center">
            <p class="font-semi mb-4">Gagal menangkap! Pokémon lolos.</p>
            <button
              @click="closeModal"
              class="px-4 py-2 bg-red-400 rounded-lg text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Import icon gambar untuk masing-masing stat
import hpIcon from './../assets/img/hp.png'
import attackIcon from './../assets/img/attack.png'
import defenseIcon from './../assets/img/defense.png'
import specialAttackIcon from './../assets/img/special-attack.png'
import specialDefenseIcon from './../assets/img/special-defense.png'
import speedIcon from './../assets/img/speed.png'

const route = useRoute()
const router = useRouter()
const pokemon = ref(null)
const errorMessage = ref('')
const activeTab = ref('about') // default adalah About
// currentPage tidak lagi digunakan karena kita akan pindah route ke koleksi

// Modal catch & collection
const showModal = ref(false)
const catchInProgress = ref(false)
const modalPokemon = ref(null)

// Fungsi untuk menghitung lebar progress bar, asumsikan max stat = 200
const calculateWidth = (base_stat) => {
  return (base_stat / 200) * 100 + '%'
}

// Fungsi untuk mengkapitalkan huruf pertama dari stat name
const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Fungsi untuk mendapatkan icon untuk setiap stat
const getStatIcon = (statName) => {
  switch (statName) {
    case 'hp':
      return hpIcon
    case 'attack':
      return attackIcon
    case 'defense':
      return defenseIcon
    case 'special-attack':
      return specialAttackIcon
    case 'special-defense':
      return specialDefenseIcon
    case 'speed':
      return speedIcon
    default:
      return ''
  }
}

async function fetchPokemonByName(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!response.ok) throw new Error('Gagal mengambil data Pokémon!')
    const data = await response.json()
    const totalStats = data.stats.reduce((acc, stat) => acc + stat.base_stat, 0)
    const averageStats = totalStats / data.stats.length
    pokemon.value = {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.other['official-artwork'].front_default || '/default.png',
      types: data.types.map((t) => t.type.name),
      height: `${data.height / 10} (M)`,
      weight: `${data.weight / 10} (KG)`,
      abilities: data.abilities.map((a) => a.ability.name),
      experience: data.base_experience,
      moves: data.moves,
      stats: data.stats,
      averageStats: averageStats.toFixed(2),
    }
  } catch (error) {
    errorMessage.value = 'Error fetching Pokémon data.'
    console.error(error)
  }
}

onMounted(() => {
  // Pastikan parameter rute sesuai, misalnya "name"
  fetchPokemonByName(route.params.name)
})

// Computed untuk background halaman berdasarkan tipe pertama Pokémon
const backgroundColor = computed(() => {
  if (!pokemon.value) return '#ffffff'
  const type = pokemon.value.types[0]
  switch (type) {
    case 'grass':
      return '#78C850'
    case 'fire':
      return '#F08030'
    case 'water':
      return '#6890F0'
    case 'electric':
      return '#F8D030'
    case 'psychic':
      return '#F85888'
    case 'ice':
      return '#98D8D8'
    case 'dragon':
      return '#7038F8'
    case 'dark':
      return '#705848'
    case 'fairy':
      return '#EE99AC'
    default:
      return '#A8A878'
  }
})

// Computed untuk mengurutkan stats agar tampil sesuai urutan: hp, attack, defense, special-attack, special-defense, speed
const orderedStats = computed(() => {
  if (!pokemon.value) return []
  const order = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
  return order
    .map((statName) => pokemon.value.stats.find((s) => s.stat.name === statName))
    .filter(Boolean)
})

// --- Fitur Catch ---

async function attemptCatch() {
  showModal.value = true
  catchInProgress.value = true
  // Tampilkan animasi catch selama 3 detik
  setTimeout(async () => {
    catchInProgress.value = false
    // Kesempatan menangkap dinaikkan menjadi 90%
    const success = Math.random() < 0.9
    if (success) {
      modalPokemon.value = await fetchRandomPokemon()
    } else {
      modalPokemon.value = null
    }
    // Jika gagal, modal tetap terbuka (user harus klik tombol "Tutup")
  }, 3000)
}

async function fetchRandomPokemon() {
  const randomId = Math.floor(Math.random() * 898) + 1
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    if (!response.ok) throw new Error('Gagal mengambil data Pokémon acak')
    const data = await response.json()
    const totalStats = data.stats.reduce((acc, stat) => acc + stat.base_stat, 0)
    const averageStats = totalStats / data.stats.length
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.other['official-artwork'].front_default || '/default.png',
      types: data.types.map((t) => t.type.name),
      height: `${data.height / 10} (M)`,
      weight: `${data.weight / 10} (KG)`,
      abilities: data.abilities.map((a) => a.ability.name),
      experience: data.base_experience,
      moves: data.moves,
      stats: data.stats,
      averageStats: averageStats.toFixed(2),
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

function capturePokemon() {
  if (modalPokemon.value) {
    addToCollection(modalPokemon.value)
    closeModal()
    // Setelah berhasil, pindah ke halaman koleksi
    router.push({ name: 'Collection' })
  }
}

function closeModal() {
  showModal.value = false
  modalPokemon.value = null
}

// --- Fitur Koleksi ---
const collection = ref([])

function addToCollection(pokemonData) {
  const captureTime = new Date().getTime()
  const caughtPokemon = { ...pokemonData, captureTime }
  // Masukkan di awal array agar yang terbaru tampil di atas
  collection.value.unshift(caughtPokemon)
  localStorage.setItem('collection', JSON.stringify(collection.value))
}

function loadCollection() {
  const saved = localStorage.getItem('collection')
  if (saved) {
    collection.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadCollection()
})
</script>

<style scoped>
/* Jangan ubah style Anda */
.home-switch > div {
  transition: background-color 1s ease;
}
.home-switch-active {
  font-weight: bold;
}

.type-grass {
  background-color: #78c850;
}
.type-fire {
  background-color: #f08030;
}
.type-water {
  background-color: #6890f0;
}
.type-electric {
  background-color: #f8d030;
}
.type-psychic {
  background-color: #f85888;
}
.type-ice {
  background-color: #98d8d8;
}
.type-dragon {
  background-color: #7038f8;
}
.type-dark {
  background-color: #705848;
}
.type-fairy {
  background-color: #ee99ac;
}
</style>

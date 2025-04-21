<!-- src/views/ProfilPokemon.vue -->
<template>
  <div :style="{ backgroundColor: backgroundColor }" class="h-full rounded-2xl mb-10">
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
                  <img
                    src="https://pokedex-power.vercel.app/assets/dots.svg"
                    alt="dots"
                    class="w-24"
                  />
                </div>
                <div class="text-center">
                  <p class="font-semi">#{{ pokemon.id.toString().padStart(4, '0') }}</p>
                  <div class="flex items-center justify-center">
                    <img src="../assets/img/pokeSmall.png" alt="pokesmall" class="mr-2" />
                    <p class="font-extra text-3xl tracking-widest text-black-0">
                      {{ pokemon.name }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-center">
                  <img :src="pokemon.image" :alt="pokemon.name" class="w-72" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-6 lg:mt-4">
              <!-- Tombol Catch -->
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
            <!-- Switch Tabs -->
            <div class="mb-8 bg-white rounded-2xl shadow-2xl">
              <div class="home-switch flex justify-around items-center px-1 py-2">
                <div
                  @click="activeTab = 'about'"
                  :class="['cursor-pointer','py-1','px-5','rounded-2xl',{ 'home-switch-active bg-yellow-400': activeTab==='about' }]"
                >About</div>
                <div
                  @click="activeTab = 'status'"
                  :class="['cursor-pointer','py-1','px-5','rounded-2xl',{ 'home-switch-active bg-yellow-400': activeTab==='status' }]"
                >Status</div>
                <div
                  @click="activeTab = 'moves'"
                  :class="['cursor-pointer','py-1','px-5','rounded-2xl',{ 'home-switch-active bg-yellow-400': activeTab==='moves' }]"
                >Moves</div>
              </div>
            </div>

            <!-- About Tab -->
            <div v-if="activeTab==='about'" class="tab-content">
              <div class="grid grid-cols-3 gap-3 mb-5 lg:mb-3">
                <p class="font-semi">Types</p>
                <div class="col-span-2 flex items-center">
                  <div
                    v-for="(type, i) in pokemon.types" :key="i"
                    :class="`type-${type}`"
                    class="bg-gray-300 px-3 text-base text-black-0 rounded-md mr-2"
                  >{{ type }}</div>
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
                <div class="col-span-2 flex flex-wrap">
                  <div
                    v-for="(ab, i) in pokemon.abilities" :key="i"
                    class="bg-yellow-200 px-3 text-base text-black-0 rounded-md mr-2 mb-2"
                  >{{ ab }}</div>
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

            <!-- Status Tab -->
            <div v-if="activeTab==='status'" class="tab-content">
              <div class="w-full lg:px-10">
                <div
                  v-for="(stat, i) in orderedStats" :key="i"
                  class="mb-5 lg:mb-3"
                >
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

            <!-- Moves Tab -->
            <div v-if="activeTab==='moves'" class="tab-content">
              <div class="overflow-y-scroll moves-scroll h-80 -mr-3">
                <div class="grid grid-rows-1 grid-cols-2 lg:grid-cols-3 gap-5 mb-3 pr-3">
                  <div
                    v-for="(mv, i) in pokemon.moves" :key="i"
                    class="border border-dashed py-2 hover:border-yellow-400"
                  >
                    <p class="text-center text-sm">{{ mv.move.name }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <!-- End Tab Detail -->
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
          <img
            src="../assets/img/logo-catch.png"
            alt="catching"
            class="w-20 mx-auto animate-spin"
          />
        </div>
        <div v-else>
          <div v-if="modalPokemon">
            <div class="text-center mb-4">
              <img :src="modalPokemon.image" :alt="modalPokemon.name" class="w-40 mx-auto" />
              <p class="font-extra text-xl mt-2">{{ modalPokemon.name }}</p>
              <p class="text-sm">Tipe: {{ modalPokemon.types.join(', ') }}</p>
            </div>
            <div class="flex justify-around">
              <button @click="capturePokemon" class="px-4 py-2 bg-green-400 rounded-lg text-white">
                Tangkap
              </button>
              <button @click="closeModal" class="px-4 py-2 bg-red-400 rounded-lg text-white">
                Lepaskan
              </button>
            </div>
          </div>
          <div v-else class="text-center">
            <p class="font-semi mb-4">Gagal menangkap! Pokémon lolos.</p>
            <button @click="closeModal" class="px-4 py-2 bg-red-400 rounded-lg text-white">
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

// icon stat
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
const activeTab = ref('about')

// modal & catch
const showModal = ref(false)
const catchInProgress = ref(false)
const modalPokemon = ref(null)

// ** fungsi progress bar **
const calculateWidth = (base) => {
  return ((base / 200) * 100) + '%'
}

// kapitalisasi
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

// icon stat
const getStatIcon = (name) => {
  switch(name) {
    case 'hp': return hpIcon
    case 'attack': return attackIcon
    case 'defense': return defenseIcon
    case 'special-attack': return specialAttackIcon
    case 'special-defense': return specialDefenseIcon
    case 'speed': return speedIcon
    default: return ''
  }
}

// ambil detail
async function fetchPokemonByName(name) {
  try {
    const res = await fetch(`https://pokemon-backend-production-655f.up.railway.app/pokemon/name/${name}`, {
      headers:{ 'x-user-id': localStorage.getItem('device-id')||'' }
    })
    if(!res.ok) throw new Error('Gagal ambil data')
    const d = await res.json()
    const total = d.stats.reduce((a,s)=>a+s.base_stat,0)
    pokemon.value = {
      ...d,
      name: capitalize(d.name),
      averageStats: (total/d.stats.length).toFixed(2)
    }
  } catch(e) {
    errorMessage.value = e.message
  }
}

// gacha
async function attemptCatch() {
  showModal.value = true
  catchInProgress.value = true
  setTimeout(async ()=>{
    catchInProgress.value = false
    const ok = Math.random()<0.9
    modalPokemon.value = ok
      ? await fetchRandomPokemon()
      : null
  }, 3000)
}

async function fetchRandomPokemon() {
  const id = Math.floor(Math.random()*898)+1
  const res = await fetch(`https://pokemon-backend-production-655f.up.railway.app/pokemon/${id}`, {
    headers:{ 'x-user-id': localStorage.getItem('device-id')||'' }
  })
  return res.ok ? await res.json() : null
}

async function capturePokemon() {
  if(!modalPokemon.value) return
  // simpan ke DB
  await fetch('https://pokemon-backend-production-655f.up.railway.app/pokemon/caught',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'x-user-id': localStorage.getItem('device-id')||''
    },
    body: JSON.stringify({
      pokemonId: modalPokemon.value.id,
      name: modalPokemon.value.name,
      image: modalPokemon.value.image,
      types: modalPokemon.value.types,
      height: modalPokemon.value.height,
      weight: modalPokemon.value.weight,
      abilities: modalPokemon.value.abilities,
      experience: modalPokemon.value.experience
    })
  })
  closeModal()
  router.push({ name:'Collection' })
}

function closeModal(){
  showModal.value=false
  modalPokemon.value=null
}

// background berdasarkan tipe
const backgroundColor = computed(()=>{
  const t = pokemon.value?.types[0]
  const map={
    grass:'#78C850', fire:'#F08030', water:'#6890F0',
    electric:'#F8D030', psychic:'#F85888', ice:'#98D8D8',
    dragon:'#7038F8', dark:'#705848', fairy:'#EE99AC'
  }
  return map[t]||'#A8A878'
})

// urut stats
const orderedStats = computed(()=>{
  if(!pokemon.value) return []
  const ord=['hp','attack','defense','special-attack','special-defense','speed']
  return ord
    .map(n=>pokemon.value.stats.find(s=>s.stat.name===n))
    .filter(Boolean)
})

// on mount
onMounted(()=>{
  if(route.params.name) fetchPokemonByName(route.params.name)
  else errorMessage.value='Nama Pokémon tidak ada'
})
</script>

<style scoped>
/* jangan ubah styling */
.home-switch>div{transition:background-color 1s ease}
.home-switch-active{font-weight:bold}
.type-grass{background-color:#78c850}
.type-fire{background-color:#f08030}
.type-water{background-color:#6890f0}
.type-electric{background-color:#f8d030}
.type-psychic{background-color:#f85888}
.type-ice{background-color:#98d8d8}
.type-dragon{background-color:#7038f8}
.type-dark{background-color:#705848}
.type-fairy{background-color:#ee99ac}
</style>

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

import HomeView from './views/home.vue'
import ProfilPokemon from './views/ProfilPokemon.vue'
import Collection from './components/collection.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/pokemon/:name',
    component: ProfilPokemon,
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')

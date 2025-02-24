import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Juego from '../views/Juego.vue';
import Reglas from '../views/Reglas.vue';
import Servidores from '../views/ServerBrowser.vue'

const routes = [
  { path: '/', component: Servidores } // Esto hace que '/' cargue Home automáticamente
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

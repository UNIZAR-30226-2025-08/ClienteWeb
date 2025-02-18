import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Juego from '../views/Juego.vue';
import Reglas from '../views/Reglas.vue';

const routes = [
  { path: '/', component: Home } // Esto hace que '/' cargue Home automáticamente
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

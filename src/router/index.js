import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import CrearSala from '../views/CrearSala.vue';
import Juego from '../views/Juego.vue';
import Reglas from '../views/Reglas.vue';
import Servidores from '../views/ServerBrowser.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/crearSala', component: CrearSala },
  { path: '/register', component: Register },
  { path: '/juego', component: Juego },
  { path: '/reglas', component: Reglas },
  { path: '/servidores', component: Servidores },
  // Otras rutas que necesites como Juego, Reglas, etc.
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import CrearSala from '../views/CrearSala.vue';
import Juego from '../views/Juego.vue';
import Reglas from '../views/Reglas.vue';
import Servidores from '../views/ServerBrowser.vue';
import Roles from '../views/Roles.vue';
import Sala from '../views/Sala.vue';
import Amigos from '../views/Amigos.vue'
import ranking from '../views/ranking.vue';

const routes = [
  { path: '/', component: Home }, // Página principal
  { path: '/Roles', component: Roles }, // Página principal
  { path: '/register', component: Register },
  { path: '/crear-sala', component: CrearSala },
  { path: '/juego', component: Juego },
  { path: '/reglas', component: Reglas },
  { path: '/servidores', component: Servidores },
  { path: '/sala', component: Sala },
  { path: '/amigos', component: Amigos},
  { path: '/ranking', component: ranking}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

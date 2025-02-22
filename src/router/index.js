import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/register.vue'; // Asegúrate de que la primera letra sea mayúscula
import Juego from '../views/Juego.vue';
import Reglas from '../views/Reglas.vue';

const routes = [
  { path: '/', component: Home }, // Esto hace que '/' cargue Home automáticamente
  { path: '/register', component: Register }, // Agrega esta línea
  // También puedes agregar más rutas aquí como Juego, Reglas, etc.
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

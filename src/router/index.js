import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
<<<<<<< HEAD
import Register from '../views/Register.vue';
import CrearSala from '../views/CrearSala.vue';
=======
>>>>>>> 648a6189688cfde5c1b65123a197893ae68208de
import Juego from '../views/Juego.vue';
import Reglas from '../views/Reglas.vue';
import Servidores from '../views/ServerBrowser.vue'

const routes = [
<<<<<<< HEAD
  { path: '/', component: CrearSala }, // Cambié la ruta principal a CrearSala
  // Otras rutas que necesites como Juego, Reglas, etc.
=======
  { path: '/', component: Servidores } // Esto hace que '/' cargue Home automáticamente
>>>>>>> 648a6189688cfde5c1b65123a197893ae68208de
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

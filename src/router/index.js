// src/router/index.js (o la ruta correspondiente)
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import CrearSala from "../views/CrearSala.vue";
import Juego from "../views/Juego.vue";
import Reglas from "../views/Reglas.vue";
import Servidores from "../views/ServerBrowser.vue";
import Roles from "../views/Roles.vue";
import Sala from "../views/Sala.vue";
import Amigos from "../views/Amigos.vue";
import ranking from "../views/ranking.vue";
import Partida from "../views/partida/partida.vue";
import Perfil from "../views/Perfil.vue";
import Sugerencias from "../views/Sugerencias.vue";
import SugerenciasAdmin from "../views/SugerenciasAdmin.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/Roles", component: Roles },
  { path: "/register", component: Register },
  { path: "/crear-sala", component: CrearSala },
  { path: "/juego", component: Juego },
  { path: "/reglas", component: Reglas },
  { path: "/servidores", component: Servidores },
  { path: "/sala/:idSala", component: Sala }, // Ruta dinámica para la sala
  { path: "/amigos", component: Amigos },
  { path: "/ranking", component: ranking },
  { path: "/partida/:idSala", component: Partida },
  // Modificamos la ruta del perfil para aceptar un parámetro opcional (idUsuario)
  { path: "/perfil/:idUsuario?", name: "perfil", component: Perfil },
  { path: "/sugerencias", name: "sugerencias", component: Sugerencias },
  {
    path: "/sugerenciasadmin",
    name: "sugerenciasadmin",
    component: SugerenciasAdmin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Variable global para almacenar la última ruta (desde la que venimos)
let lastRoute = null;

router.beforeEach((to, from, next) => {
  // Almacena la ruta "from" para usarla en el botón de volver
  lastRoute = from;
  next();
});

// Exportamos tanto router como lastRoute para poder usarlo en otros componentes
export { router, lastRoute };
export default router;

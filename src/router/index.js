// src/router/index.js
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
  { path: "/amigos", name: "amigos", component: Amigos },
  { path: "/ranking", component: ranking },
  { path: "/partida/:idSala", component: Partida },
  // La ruta de perfil acepta un parámetro opcional
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

// Arreglo global para almacenar el historial de rutas visitadas
const navigationHistory = [];

// En cada navegación agregamos la ruta "from" al historial
router.beforeEach((to, from, next) => {
  if (from.fullPath) {
    navigationHistory.push(from.fullPath);
  }
  next();
});

export { router, navigationHistory };
export default router;

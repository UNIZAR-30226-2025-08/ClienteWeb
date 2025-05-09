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
  { path: "/register", component: Register },
  { path: "/Roles", component: Roles, meta: { requiresAuth: true } },
  { path: "/crear-sala", component: CrearSala, meta: { requiresAuth: true } },
  { path: "/juego", component: Juego, meta: { requiresAuth: true } },
  { path: "/reglas", component: Reglas, meta: { requiresAuth: true } },
  { path: "/servidores", component: Servidores, meta: { requiresAuth: true } },
  { path: "/sala/:idSala", component: Sala, meta: { requiresAuth: true } }, // Ruta dinámica para la sala
  {
    path: "/amigos",
    name: "amigos",
    component: Amigos,
    meta: { requiresAuth: true },
  },
  { path: "/ranking", component: ranking, meta: { requiresAuth: true } },
  {
    path: "/partida/:idSala",
    component: Partida,
    meta: { requiresAuth: true },
  },
  // La ruta de perfil acepta un parámetro opcional
  {
    path: "/perfil/:idUsuario?",
    name: "perfil",
    component: Perfil,
    meta: { requiresAuth: true },
  },
  {
    path: "/sugerencias",
    name: "sugerencias",
    component: Sugerencias,
    meta: { requiresAuth: true },
  },
  {
    path: "/sugerenciasadmin",
    name: "sugerenciasadmin",
    component: SugerenciasAdmin,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Mantén todo igual excepto la parte del historial:
const navigationHistory = [];

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("usuario")) {
    return next("/");
  }

  // Registrar ruta anterior solo si es diferente a la actual
  if (from.fullPath && from.fullPath !== to.fullPath) {
    navigationHistory.push(from.fullPath);
  }

  next();
});

router.afterEach((to) => {
  // Registrar ruta actual evitando duplicados consecutivos
  if (navigationHistory[navigationHistory.length - 1] !== to.fullPath) {
    navigationHistory.push(to.fullPath);
  }
});

export { router, navigationHistory };
export default router;

<template>
  <div class="partida-container">
    <!-- Overlay 1: Intro "AMANECE..." -->
    <div v-if="introActive" class="intro-overlay fadeInOut">
      <h1 class="intro-text">
        AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS
      </h1>
    </div>

    <!-- Overlay 2: Mostrar el rol aleatorio -->
    <div v-if="roleActive" class="role-overlay fadeInOut">
      <h1 class="role-title">TU ROL ES</h1>
      <img :src="chosenRole.src" class="role-image" :alt="chosenRole.nombre" />
      <h2 class="role-name">{{ chosenRole.nombre?.toUpperCase() }}</h2>
    </div>

    <!-- Overlay 3: Mensaje "Empieza la partida" -->
    <div v-if="empiezaOverlayActive" class="empieza-overlay fadeInOut">
      <h1 class="empieza-text">EMPIEZA LA PARTIDA</h1>
    </div>

    <!-- Cabecera / Secciones de la partida (cuando partidaActive = true) -->
    <div v-if="partidaActive" class="top-sections">
      <div class="section">
        <img src="../assets/aldeanosVivos.png" alt="Aldeanos Vivos" class="icon" />
        <div class="text">
          <strong>PUEBLO</strong>
          <span>5/6 Vivos</span>
        </div>
      </div>

      <div class="section center">
        <strong>JORNADA 2</strong>
        <span>DÍA</span>
      </div>

      <div class="section">
        <img src="../assets/lobosVivos.png" alt="Lobos Vivos" class="icon" />
        <div class="text">
          <strong>LOBOS</strong>
          <span>2/2 Vivos</span>
        </div>
      </div>
    </div>

    <!-- Recuadro inferior izquierdo con la información del rol -->
    <div v-if="partidaActive" class="bottom-left-info">
      <!-- Fila superior: imagen pequeña + "HABILIDAD" al lado -->
      <div class="top-row">
        <img :src="chosenRole.src" alt="Imagen del Rol" class="role-info-image" />
        <h3 class="role-info-title">HABILIDAD</h3>
      </div>
      <!-- Descripción del rol -->
      <p class="role-description">
        {{ chosenRole.descripcion }}
      </p>
    </div>

    <!-- Ocho jugadores alrededor de la hoguera -->
    <div v-if="partidaActive" class="players-container">
      <!-- Cada jugador con su icono y etiqueta -->
      <div class="player-icon player-1">
        <span class="player-label">JUGADOR 1</span>
        <img src="../assets/player.png" alt="Jugador 1" />
      </div>
      <div class="player-icon player-2">
        <span class="player-label">JUGADOR 2</span>
        <img src="../assets/player.png" alt="Jugador 2" />
      </div>
      <div class="player-icon player-3">
        <span class="player-label">JUGADOR 3</span>
        <img src="../assets/player.png" alt="Jugador 3" />
      </div>
      <div class="player-icon player-4">
        <span class="player-label">JUGADOR 4</span>
        <img src="../assets/player.png" alt="Jugador 4" />
      </div>
      <div class="player-icon player-5">
        <span class="player-label">JUGADOR 5</span>
        <img src="../assets/player.png" alt="Jugador 5" />
      </div>
      <div class="player-icon player-6">
        <span class="player-label">JUGADOR 6</span>
        <img src="../assets/player.png" alt="Jugador 6" />
      </div>
      <div class="player-icon player-7">
        <span class="player-label">JUGADOR 7</span>
        <img src="../assets/player.png" alt="Jugador 7" />
      </div>
      <div class="player-icon player-8">
        <span class="player-label">JUGADOR 8</span>
        <img src="../assets/player.png" alt="Jugador 8" />
      </div>
    </div>
  </div>
</template>

<script>
import { roles } from "../assets/data/roles.js";

export default {
  name: "Partida",
  data() {
    return {
      // Control de pantallas
      introActive: true,
      roleActive: false,
      empiezaOverlayActive: false,
      partidaActive: false,

      // Rol aleatorio elegido
      chosenRole: {}
    };
  },
  mounted() {
    // 1) Esperamos 6s para terminar la intro "AMANECE..."
    setTimeout(() => {
      this.introActive = false;

      // Filtramos para excluir el rol "Aguacil"
      const validRoles = roles.filter(role => role.nombre.toLowerCase() !== "aguacil");
      const randomIndex = Math.floor(Math.random() * validRoles.length);
      this.chosenRole = validRoles[randomIndex];
      this.roleActive = true;

      // 2) Tras otros 6s, ocultamos el rol y mostramos "Empieza la partida"
      setTimeout(() => {
        this.roleActive = false;
        this.empiezaOverlayActive = true;

        // 3) Después de 6s, ocultamos "Empieza la partida" y arrancamos la partida
        setTimeout(() => {
          this.empiezaOverlayActive = false;
          this.partidaActive = true;
        }, 6000);
      }, 6000);
    }, 6000);
  }
};
</script>

<style scoped>
@import "./partida.css";
</style>

<template>
    <div class="partida-container">
      <!-- Overlay 1: Intro "AMANECE..." -->
      <div v-if="introActive" class="intro-overlay fadeInOut">
        <h1 class="intro-text">
          AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS
        </h1>
      </div>
  
      <!-- Overlay 2: Mostrar el rol aleatorio (solo se ve cuando roleActive es true) -->
      <div v-if="roleActive" class="role-overlay fadeInOut">
        <h1 class="role-title">TU ROL ES</h1>
        <!-- Usamos chosenRole.src y chosenRole.nombre -->
        <img :src="chosenRole.src" class="role-image" :alt="chosenRole.nombre" />
        <h2 class="role-name">{{ chosenRole.nombre?.toUpperCase() }}</h2>
      </div>
  
      <!-- Cabecera / Secciones de la partida (solo se muestran cuando partidaActive es true) -->
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
    </div>
  </template>
  
  <script>
  import { roles } from "../assets/data/roles.js"; // Ajusta la ruta según tu estructura
  
  export default {
    name: "Partida",
    data() {
      return {
        // Control de pantallas
        introActive: true,
        roleActive: false,
        partidaActive: false,
  
        // Aquí guardaremos el rol aleatorio elegido
        chosenRole: {}
      };
    },
    mounted() {
      // 1) Esperamos 6s para terminar la intro "AMANECE..."
      setTimeout(() => {
        // Quitamos la intro
        this.introActive = false;
  
        // 2) Elegimos un rol aleatorio y mostramos el overlay del rol
        const randomIndex = Math.floor(Math.random() * roles.length);
        this.chosenRole = roles[randomIndex];
        this.roleActive = true;
  
        // 3) Tras otros 6s, arrancamos la partida
        setTimeout(() => {
          this.roleActive = false;
          this.partidaActive = true;
        }, 6000);
      }, 6000);
    }
  };
  </script>
  
  <style scoped>
  @import "./partida.css";
  </style>
  
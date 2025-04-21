<template>
    <!-- Otro código aquí -->
  
    <!-- Overlay de la víctima elegida por los lobos (solo para la bruja) -->
    <div v-if="isBruja() && victimaElegidaLobos" class="result-overlay fadeInOut">
      <h1 class="result-text">
        {{ victimaNombre }} ha sido asesinado por los hombres lobo
      </h1>
    </div>
  
    <!-- Otro código aquí -->
  </template>
  
  <script>
  // Aquí agregamos el código necesario para manejar el mensaje de la víctima
  export default {
    data() {
      return {
        victimaElegidaLobos: null,  // Variable para almacenar la víctima elegida
        victimaNombre: "",  // Nombre de la víctima
      };
    },
    computed: {
      // Método para verificar si el jugador es la bruja
      isBruja() {
        return this.chosenRole && this.chosenRole.nombre === "Bruja";
      }
    },
    mounted() {
      // Escuchar el evento que notificará a la bruja sobre la víctima elegida
      socket.on("mensajeBruja", (data) => {
        if (this.isBruja()) {
          this.victimaElegidaLobos = data.victima;
          const victima = this.players.find(player => player.id === this.victimaElegidaLobos);
          if (victima) {
            this.victimaNombre = victima.nombre;
          }
        }
      });
    },
    beforeDestroy() {
      // Limpiar el socket al destruir el componente
      socket.off("mensajeBruja");
    }
  };
  </script>
  
  <style scoped>
  .result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .result-text {
    color: #8b0000;
    font-size: 4rem;
    font-family: "Times New Roman", serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  
  .fadeInOut {
    animation: fadeInOut 6s forwards;
  }
  
  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  </style>
  
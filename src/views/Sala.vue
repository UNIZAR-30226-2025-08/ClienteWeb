<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
import { toast } from "vue3-toastify"; // Importar toast
import "vue3-toastify/dist/index.css"; // Importar estilos de toastify
import Cabecera from "../components/Cabecera.vue";

const route = useRoute();
const router = useRouter();
const socket = io("http://localhost:5000");

// Variables reactivas
const idSala = ref(null);
const jugadores = ref([]);
const usuario = ref(null);
const lider = ref(null);
const maxJugadores = ref(null);
const nombresala = ref(null);
const cargando = ref(true); // Estado de carga
const slotsCargando = ref({});

// Función para unirse a la sala
const unirseSala = () => {
  cargando.value = true; // Activar pantalla de carga

  // Solicitar información de la sala
  socket.emit("obtenerSala", idSala.value, (sala) => {
    if (sala) {
      const estaEnSala = sala.jugadores.some(j => j.id === usuario.value.id);
      if (!estaEnSala) {
        socket.emit("unirseSala", { idSala: idSala.value, usuario: usuario.value });
      }
      actualizarSala(sala);
    } else {
      alert("La sala no existe o fue eliminada.");
      router.push("/");
    }

    // Desactivar pantalla de carga después de 1 segundo
    setTimeout(() => {
      cargando.value = false;
      // Mostrar toast de que el usuario se ha conectado
      toast.success(`Te has conectado 🎉`);
    }, 1000); // 1 segundo de carga
  });
};

onMounted(() => {
  const usuarioGuardado = localStorage.getItem("usuario");
  if (!usuarioGuardado) {
    alert("Debes iniciar sesión para unirte a una sala.");
    router.push("/");
    return;
  }

  usuario.value = JSON.parse(usuarioGuardado);
  idSala.value = route.params.idSala;

  if (!idSala.value) {
    alert("No se encontró el ID de la sala.");
    router.push("/");
    return;
  }

  // Unirse a la sala cuando el componente se monta
  unirseSala();

  // Notificaciones
  socket.on("jugadorUnido", ({ nombre, id }) => {
    slotsCargando.value[id] = true;
    setTimeout(() => {
      slotsCargando.value[id] = false;
    }, 1000); // Duración de la animación de carga
  });

  socket.on("jugadorSalido", ({ nombre, id }) => {
    delete slotsCargando.value[id];
  });

  // Actualizar la sala
  socket.on("actualizarSala", (sala) => {
    if (sala.id === idSala.value) {
      actualizarSala(sala);
    }
  });

  // Cambios de estado (Listo/No Listo)
  socket.on("estadoCambiado", ({ idUsuario, estado }) => {
    const jugador = jugadores.value.find(j => j.id === idUsuario);
    if (jugador) jugador.listo = estado;
  });

  // Expulsión de la sala
  socket.on("expulsadoDeSala", ({ idExpulsado }) => {
    if (usuario.value.id === idExpulsado) {
      alert("Has sido expulsado de la sala.");
      salirSala();
    }
  });
});

onUnmounted(() => {
  socket.off("jugadorUnido");
  socket.off("jugadorSalido");
  socket.off("actualizarSala");
  socket.off("estadoCambiado");
  socket.off("expulsadoDeSala");
});

const actualizarSala = (sala) => {
  localStorage.setItem("salaActual", JSON.stringify(sala));
  jugadores.value = [...sala.jugadores];
  lider.value = sala.lider;
  maxJugadores.value = sala.maxJugadores;
  nombresala.value = sala.nombre;
};

// Cambiar estado (Listo/No Listo)
const cambiarEstado = () => {
  const jugador = jugadores.value.find(j => j.id === usuario.value.id);
  if (jugador) {
    socket.emit("marcarEstado", { idSala: idSala.value, idUsuario: usuario.value.id, estado: !jugador.listo });
  }
};

// Expulsar jugador
const expulsarJugador = (idExpulsado) => {
  if (usuario.value.id === lider.value) {
    socket.emit("expulsarJugador", { idSala: idSala.value, idLider: usuario.value.id, idExpulsado });
  }
};

// Salir de la sala
const salirSala = () => {
  socket.emit("salirSala", { idSala: idSala.value, idUsuario: usuario.value.id });
  localStorage.removeItem("salaActual");

  // Mostrar toast de que el usuario se ha desconectado
  toast.info(`${usuario.value.nombre} ha salido de la sala 👋`);

  router.push("/juego");
};

// Computar espacios vacíos
const espaciosJugadores = computed(() => {
  let espacios = [...jugadores.value];
  while (espacios.length < maxJugadores.value) {
    espacios.push(null);
  }
  return espacios;
});
</script>

<template>
  <div class="sala-wrapper">
    <Cabecera :titulo="`Sala: ${nombresala}`" :compacto="true" />

    <div v-if="cargando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Entrando a la sala...</p>
    </div>

    <div v-else class="sala-content">
      <transition-group name="jugadores" tag="div" class="slots-container">
        <div v-for="(jugador, index) in espaciosJugadores" :key="index" class="slot-item" :class="{ 'slot-vacio': !jugador, 'slot-cargando': slotsCargando[jugador?.id] }">
          <div class="slot-avatar">
            <img v-if="jugador && !slotsCargando[jugador.id]" src="../assets/player.png" alt="Avatar Jugador" />
            <img v-else-if="!jugador" src="../assets/empty_slot.png" alt="Espacio vacío" />
            <div v-else class="loading-avatar"></div>
          </div>
          <div class="slot-nombre">
            {{ jugador && !slotsCargando[jugador.id] ? jugador.nombre : "Cargando..." }}
            <span v-if="jugador && jugador.id === lider">👑</span>
          </div>
          <div v-if="jugador && !slotsCargando[jugador.id]" class="estado-jugador">
            {{ jugador.listo ? "✅ Listo" : "⏳ No Listo" }}
          </div>
          <button v-if="jugador && jugador.id === usuario?.id && !slotsCargando[jugador.id]" @click="cambiarEstado" class="btn-estado" :class="{ listo: jugador.listo, 'no-listo': !jugador.listo }">
            {{ jugador.listo ? "Cancelar Listo" : "Estoy Listo" }}
          </button>
          <button v-if="jugador && usuario?.id === lider && jugador.id !== lider && !slotsCargando[jugador.id]" @click="expulsarJugador(jugador.id)">Expulsar</button>
        </div>
      </transition-group>
    </div>

    <div class="bottom-bar">
      <button class="btn-invite">Invitar Amigos</button>
      <button class="btn-start" :disabled="jugadores.length < 2">Iniciar Partida</button>
      <button @click="salirSala">Salir</button>
    </div>
  </div>
</template>

<style scoped>
/* ---- CONTENEDOR PRINCIPAL ---- */
.sala-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #262522;
  color: #ffffff;
}

.sala-content {
  flex: 1;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---- CONTENEDOR DE SLOTS ---- */
.slots-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
  max-width: 800px;
  margin-top: 1rem;
}

/* ---- SLOT DE JUGADOR ---- */
.slot-item {
  background-color: #302E2B;
  border: 2px solid #000;
  border-radius: 8px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
  transition: transform 0.2s ease-in-out;
}

.slot-item:hover {
  transform: scale(1.05);
}

/* Si el slot está vacío */
.slot-vacio {
  opacity: 0.4;
}

/* Avatar dentro del slot */
.slot-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* Nombre dentro del slot */
.slot-nombre {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}

/* Estado del jugador (Listo/No Listo) */
.estado-jugador {
  font-size: 0.9rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 6px;
}

/* ---- BOTÓN CAMBIAR ESTADO (Listo / No Listo) ---- */
.btn-estado {
  background-color: #1e1e1e;
  color: #ffffff;
  border: 2px solid #444;
  padding: 4px 6px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.btn-estado:hover {
  background-color: #292929;
  transform: scale(0.95);
}

.listo {
  background-color: #008000 !important;
  border-color: #006400;
}

.no-listo {
  background-color: #800000 !important;
  border-color: #640000;
}

/* ---- ANIMACIÓN DE ENTRADA Y SALIDA DE JUGADORES ---- */
.jugadores-enter-active,
.jugadores-leave-active {
  transition: all 0.5s ease;
}

.jugadores-enter-from,
.jugadores-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* ---- BARRA INFERIOR ---- */
.bottom-bar {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #302E2B;
}

.btn-invite,
.btn-start {
  background-color: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-invite:hover,
.btn-start:hover {
  background-color: #ffffff;
  color: #262522;
}

/* ---- BOTÓN EXPULSAR ---- */
button.expulsar {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

button.expulsar:hover {
  background-color: #cc0000;
}

/* Contenedor de carga */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #262522;
  color: white;
  font-size: 1.2rem;
}

.loading-spinner {
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid #ffffff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Animación de carga para el avatar */
.loading-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

/* Estilo para el slot en estado de carga */
.slot-cargando {
  opacity: 0.7;
  pointer-events: none;
}
</style>
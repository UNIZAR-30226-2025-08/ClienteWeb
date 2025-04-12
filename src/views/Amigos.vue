<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue3-toastify";
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";
import axios from "axios";
import socket from "../utils/socket"; // Ajusta la ruta según tu proyecto
import { useRouter } from "vue-router";

onBeforeUnmount(() => {
  socket.off("estadoAmigo");
  socket.off("estadoAmigos");
  socket.off("listaSalas");
  socket.off("actualizarSala");
});

const router = useRouter();

// Función para obtener el ID del usuario logueado desde localStorage
const getUserId = () => {
  return JSON.parse(localStorage.getItem("usuario")).id;
};

const friends = ref([]);
const loading = ref(true);
const error = ref(null);

// Variables para el modal de confirmación de eliminación
const showDeleteModal = ref(false);
const friendToDelete = ref(null);
const deleteError = ref(null);

// Variables para la búsqueda de amigos
const searchName = ref("");
const searchError = ref(null);
const searchSuccess = ref("");
const loadingSearch = ref(false);

// Variable reactiva para la lista de salas (en tiempo real)
const salas = ref([]);

// Función para actualizar el estado de tus amigos según las salas
// Recorre cada amigo y, si alguno aparece en el listado de jugadores de alguna sala,
// se marca como que está en sala (y se almacena el id de la sala en friend.sala)
const actualizarEstadoDeAmigos = () => {
  friends.value.forEach((friend) => {
    // Se reinicia el estado a false y sala a null
    friend.enSala = false;
    friend.sala = null;
    salas.value.forEach((sala) => {
      if (
        sala.jugadores &&
        sala.jugadores.some((jugador) => jugador.id === friend.idUsuario)
      ) {
        friend.enSala = true;
        friend.sala = sala.id;
      }
    });
  });
};

// Función para obtener la lista de amigos (la información de estadísticas viene desde el endpoint)
const fetchFriends = async () => {
  try {
    const userId = getUserId();
    const response = await axios.get(
      `/api/amistad/listarConEstadisticas/${userId}`
    );
    friends.value = response.data.amigos;
  } catch (err) {
    console.error("Error al obtener la lista de amigos:", err);
    error.value = "Error al obtener la lista de amigos.";
  } finally {
    loading.value = false;
    actualizarEstadoDeAmigos();
  }
};

const openDeleteModal = (friendId) => {
  friendToDelete.value = friendId;
  deleteError.value = null;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  friendToDelete.value = null;
};

const confirmDelete = async () => {
  try {
    const userId = getUserId();
    await axios.delete("/api/amistad/eliminar", {
      data: { idUsuario1: userId, idUsuario2: friendToDelete.value },
    });
    friends.value = friends.value.filter(
      (friend) => friend.idUsuario !== friendToDelete.value
    );
    showDeleteModal.value = false;
    friendToDelete.value = null;
  } catch (err) {
    console.error("Error al eliminar amigo:", err);
    deleteError.value =
      "Error al eliminar amigo. Por favor, inténtalo nuevamente.";
  }
};

const getSalaActual = () => {
  const sala = localStorage.getItem("salaActual");
  return sala ? JSON.parse(sala) : null;
};

const invitarASala = (friendId) => {
  const salaActual = getSalaActual();
  if (!salaActual) {
    toast.error(
      "No estás en ninguna sala. Únete a una sala para invitar a amigos.",
      { autoClose: 3000 }
    );
    return;
  }
  const invitadorId = getUserId();
  socket.emit("invitarASala", {
    idAmigo: friendId,
    idSala: salaActual.id,
    idInvitador: invitadorId,
  });
  toast.success("Invitación enviada correctamente", { autoClose: 3000 });
};

// Función para agregar un amigo (solicitud de amistad)
const addFriend = async () => {
  if (!searchName.value.trim()) {
    searchError.value = "Por favor, ingresa un nombre.";
    return;
  }
  loadingSearch.value = true;
  searchError.value = null;
  searchSuccess.value = "";
  try {
    const response = await axios.post("/api/usuario/obtener_por_nombre", {
      nombre: searchName.value,
    });
    if (!response.data.usuario) {
      searchError.value = "Usuario no encontrado.";
      return;
    }
    const foundUser = response.data.usuario;
    const userId = getUserId();
    const sendResponse = await axios.post("/api/solicitud/enviar", {
      idEmisor: userId,
      idReceptor: foundUser.idUsuario,
    });
    socket.emit("solicitudAmistad", {
      idEmisor: userId,
      idReceptor: foundUser.idUsuario,
    });
    await fetchFriends();
    searchName.value = "";
    if (sendResponse.data && sendResponse.data.mensaje) {
      toast.info(sendResponse.data.mensaje, { autoClose: 3000 });
      searchSuccess.value = sendResponse.data.mensaje;
    } else {
      toast.success(
        `Solicitud de amistad enviada correctamente a ${foundUser.nombre}`,
        { autoClose: 3000 }
      );
      searchSuccess.value = `Solicitud de amistad enviada correctamente a ${foundUser.nombre}`;
    }
  } catch (err) {
    console.error("Error al agregar amigo:", err.response);
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.mensaje ||
      err.message ||
      "Error al agregar amigo. Inténtalo nuevamente.";
    searchError.value = errorMessage;
    toast.error(errorMessage, { autoClose: 3000 });
  } finally {
    loadingSearch.value = false;
  }
};

// Función para unirse a la sala en la que se encuentra el amigo
const unirseASala = (friendId) => {
  const friend = friends.value.find((f) => f.idUsuario === friendId);
  if (!friend) return;
  if (!friend.enSala) {
    toast.error("El amigo no se encuentra en una sala.", { autoClose: 3000 });
    return;
  }
  if (!friend.sala) {
    toast.error("No se pudo obtener la sala del amigo.", { autoClose: 3000 });
    return;
  }
  // Redirigimos a la sala donde se encuentra el amigo
  router.push(`/sala/${friend.sala}`);
};

onMounted(async () => {
  const idUsuario = getUserId();
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit("registrarUsuario", { idUsuario });
  await fetchFriends();

  // Desde aquí solicitamos la lista de salas activas para actualizar el estado
  socket.emit("obtenerSalas");
  socket.emit("solicitarEstadoAmigos", { idUsuario });

  // Listen para actualizaciones de estado de amigos
  socket.on("estadoAmigo", ({ idUsuario, en_linea }) => {
    const amigo = friends.value.find((f) => f.idUsuario === idUsuario);
    if (amigo) {
      amigo.enLinea = en_linea;
    }
  });
  socket.on("estadoAmigos", (estadoAmigos) => {
    estadoAmigos.forEach(({ idUsuario, en_linea }) => {
      const amigo = friends.value.find((f) => f.idUsuario === idUsuario);
      if (amigo) {
        amigo.enLinea = en_linea;
      }
    });
  });

  // Listener para la lista de salas
  socket.on("listaSalas", (salasRecibidas) => {
    salas.value = salasRecibidas;
    actualizarEstadoDeAmigos();
  });
  // Listener para actualizaciones de sala en tiempo real
  socket.on("actualizarSala", (salaActualizada) => {
    const index = salas.value.findIndex((s) => s.id === salaActualizada.id);
    if (index !== -1) {
      salas.value[index] = salaActualizada;
    } else {
      salas.value.push(salaActualizada);
    }
    actualizarEstadoDeAmigos();
  });
});
</script>

<template>
  <div class="amigos-page">
    <!-- Cabecera reutilizable -->
    <Cabecera titulo="Juega Con Amigos" :compacto="true" />

    <!-- Sección de búsqueda para agregar amigos -->
    <div class="friend-search">
      <input
        type="text"
        v-model="searchName"
        placeholder="Buscar usuario por nombre..."
      />
      <button class="blue-button" @click="addFriend" :disabled="loadingSearch">
        Agregar
      </button>
    </div>

    <!-- Contenedor principal para la lista de amigos -->
    <div class="amigos-container">
      <div v-if="loading">Cargando amigos...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div
          v-for="friend in friends"
          :key="friend.idUsuario"
          class="friend-row"
        >
          <div class="friend-info">
            <img
              :src="friend.avatar || '../assets/profile_icon.jpg'"
              alt="Icono Amigo"
              class="friend-icon"
            />
            <div class="friend-text">
              <p class="friend-name">{{ friend.nombre }}</p>
              <p class="friend-status">
                <!-- Se muestra "En sala" si está conectado y marcado en una sala -->
                {{
                  friend.enLinea
                    ? friend.enSala
                      ? "🟢 En sala"
                      : friend.estadisticas
                      ? "🟢 Conectado / " +
                        friend.estadisticas.partidasTotales +
                        " partidas jugadas"
                      : "🟢 En línea"
                    : "⚫ Desconectado"
                }}
              </p>
            </div>
          </div>
          <div class="friend-buttons">
            <!-- Botón "Unirse" habilitado solo si el amigo está en una sala -->
            <button
              class="green-button"
              @click="unirseASala(friend.idUsuario)"
              :disabled="!friend.enSala"
            >
              Unirse
            </button>
            <button
              class="green-button"
              @click="invitarASala(friend.idUsuario)"
            >
              Invitar
            </button>
            <button
              class="red-button"
              @click="openDeleteModal(friend.idUsuario)"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar amigo -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de eliminar a este amigo?</p>
        <div class="modal-buttons">
          <button class="red-button" @click="confirmDelete">Eliminar</button>
          <button class="green-button" @click="cancelDelete">Cancelar</button>
        </div>
        <div v-if="deleteError" class="modal-error">{{ deleteError }}</div>
      </div>
    </div>

    <!-- Barra inferior con botón Volver -->
    <div class="bottom-bar">
      <Volver />
    </div>
  </div>
</template>

<style src="./Amigos.css"></style>

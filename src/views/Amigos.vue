<script setup>
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";
import axios from "axios";
import socket from "../utils/socket"; // Usa la ruta real según tu estructura
import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
  socket.off("estadoAmigo");
  socket.off("estadoAmigos");
});

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

const fetchFriends = async () => {
  try {
    const userId = getUserId();
    // Llamamos al endpoint: GET /api/amistad/listarConEstadisticas/:idUsuario (No sé porqué ponemos el usuario en la URL, preguntar ÓSCAR si o ha hecho el)
    const response = await axios.get(
      `/api/amistad/listarConEstadisticas/${userId}`
    );
    friends.value = response.data.amigos;
  } catch (err) {
    console.error("Error al obtener la lista de amigos:", err);
    error.value = "Error al obtener la lista de amigos.";
  } finally {
    loading.value = false;
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
      data: {
        idUsuario1: userId,
        idUsuario2: friendToDelete.value,
      },
    });
    // Actualizar la lista de amigos eliminando el amigo borrado
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

const addFriend = async () => {
  if (!searchName.value.trim()) {
    searchError.value = "Por favor, ingresa un nombre.";
    return;
  }
  loadingSearch.value = true;
  searchError.value = null;
  searchSuccess.value = "";
  try {
    // Buscamos el usuario por nombre
    const response = await axios.post("/api/usuario/obtener_por_nombre", {
      nombre: searchName.value,
    });
    if (!response.data.usuario) {
      searchError.value = "Usuario no encontrado.";
      return;
    }
    const foundUser = response.data.usuario;
    const userId = getUserId();
    // Enviamos la solicitud de amistad y almacenamos la respuesta del backend
    const sendResponse = await axios.post("/api/solicitud/enviar", {
      idEmisor: userId,
      idReceptor: foundUser.idUsuario,
    });
    // Actualizamos la lista de amigos
    await fetchFriends();
    // Limpiamos el campo de búsqueda
    searchName.value = "";
    // Si el backend responde con un mensaje, lo mostramos
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

onMounted(async () => {
  const idUsuario = getUserId();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("registrarUsuario", { idUsuario });

  await fetchFriends();

  socket.emit("solicitarEstadoAmigos", { idUsuario });

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
                {{
                  friend.enLinea
                    ? friend.estadisticas
                      ? "🟢 En sala / " +
                        friend.estadisticas.partidasTotales +
                        " partidas"
                      : "🟢 En línea"
                    : "⚫ Desconectado"
                }}
              </p>
            </div>
          </div>
          <div class="friend-buttons">
            <button class="green-button">Unirse</button>
            <button class="green-button">Invitar</button>
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

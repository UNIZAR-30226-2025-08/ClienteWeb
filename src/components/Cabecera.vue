<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
import socket from "../utils/socket";

import avatar1 from "../assets/avatares/imagenPerfil.webp";
import avatar2 from "../assets/avatares/imagenPerfil2.webp";
import avatar3 from "../assets/avatares/imagenPerfil3.webp";
import avatar4 from "../assets/avatares/imagenPerfil4.webp";
import avatar5 from "../assets/avatares/imagenPerfil5.webp";
import avatar6 from "../assets/avatares/imagenPerfil6.webp";
import avatar7 from "../assets/avatares/imagenPerfil7.webp";
import avatar8 from "../assets/avatares/imagenPerfil8.webp";
import defaultAvatar from "../assets/profile_icon.jpg";

// Define las props con defineProps
const props = defineProps({
  titulo: { type: String, default: "Mi Aplicación" },
  compacto: { type: Boolean, default: false },
  esAdmin: { type: Boolean, default: false },
});

// Variables reactivas
const avatarMap = {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
};
const user = ref({});
const showNotifications = ref(false);
const friendRequests = ref([]);
const loadingRequests = ref(false);
const errorRequests = ref(null);
const showFeedbackModal = ref(false);
const feedbackMessage = ref("");
const feedbackType = ref("");
const showInvitationModal = ref(false);
const invitationData = ref(null);
const nombreInvitador = ref("");

// Para poder usar las rutas dentro del setup()
const route = useRoute();
const router = useRouter();

// Bandera para evitar actualizaciones tras desmontaje
const isMounted = ref(true);

// Funciones/métodos
const fetchFriendRequests = async () => {
  loadingRequests.value = true;
  errorRequests.value = null;
  try {
    const response = await axios.get(`/api/solicitud/listar/${user.value.id}`);
    friendRequests.value = response.data.solicitudes || [];
  } catch (err) {
    console.error("Error al obtener solicitudes de amistad:", err);
    errorRequests.value = "Error al obtener solicitudes de amistad.";
  } finally {
    loadingRequests.value = false;
  }
};

const acceptInvitation = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  socket.emit("unirseSala", {
    idSala: invitationData.value.idSala,
    usuario,
    contrasena: null,
    codigoInvitacion: invitationData.value.codigoInvitacion,
  });
  showInvitationModal.value = false;
  toast.success("Te has unido a la sala");
  window.location.href = `/sala/${invitationData.value.idSala}`;
};

const rejectInvitation = () => {
  socket.emit("invitacionRechazada", { idAmigo: user.value.id });
  showInvitationModal.value = false;
  toast.info("Invitación rechazada");
};

const irAlPerfil = () => {
  router.push({
    name: "perfil",
    query: {
      nombre: user.value.nombre,
      avatar: user.value.avatar || "",
      rolFavorito: user.value.rolFavorito || "Sin rol favorito",
    },
  });
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    fetchFriendRequests();
  }
};

const acceptRequest = async (solicitud) => {
  try {
    await axios.post("/api/solicitud/aceptar", {
      idEmisor: solicitud.idUsuarioEmisor,
      idReceptor: user.value.id,
    });
    socket.emit("solicitudAceptada", { idUsuario: solicitud.idUsuarioEmisor });
    friendRequests.value = friendRequests.value.filter(
      (req) => req.idSolicitud !== solicitud.idSolicitud
    );
    feedbackMessage.value = "¡Solicitud aceptada! Tienes un nuevo amigo.";
    feedbackType.value = "success";
    showFeedbackModal.value = true;
  } catch (err) {
    console.error("Error al aceptar solicitud:", err);
    feedbackMessage.value =
      "Error al aceptar la solicitud. Inténtalo nuevamente.";
    feedbackType.value = "error";
    showFeedbackModal.value = true;
  }
};

const rejectRequest = async (solicitud) => {
  try {
    await axios.post("/api/solicitud/rechazar", {
      idEmisor: solicitud.idUsuarioEmisor,
      idReceptor: user.value.id,
    });
    friendRequests.value = friendRequests.value.filter(
      (req) => req.idSolicitud !== solicitud.idSolicitud
    );
    feedbackMessage.value = "Solicitud rechazada.";
    feedbackType.value = "success";
    showFeedbackModal.value = true;
  } catch (err) {
    console.error("Error al rechazar solicitud:", err);
    feedbackMessage.value =
      "Error al rechazar la solicitud. Inténtalo nuevamente.";
    feedbackType.value = "error";
    showFeedbackModal.value = true;
  }
};

const closeFeedbackModal = () => {
  showFeedbackModal.value = false;
  feedbackMessage.value = "";
  feedbackType.value = "";
  // Opcional: recargar o actualizar lo que necesites
  window.location.reload();
};

// Inicialización de usuario a partir de localStorage
const initUser = () => {
  const storedUser = localStorage.getItem("usuario");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    if (!user.value.avatar) {
      user.value.avatar = "avatar1";
    }
  } else {
    user.value = {
      nombre: "NombreCuenta",
      avatar: "avatar1",
      rolFavorito: "Sin rol favorito",
    };
  }
};

initUser();

// Función para obtener el nombre del invitador
const obtenerNombreInvitador = async (idInvitador) => {
  try {
    const response = await axios.post("/api/usuario/obtener_nombre_por_id", {
      idUsuario: idInvitador,
    });
    if (response.data?.nombre) {
      nombreInvitador.value = response.data.nombre;
    }
  } catch (error) {
    console.error("Error al obtener el nombre del invitador:", error);
    nombreInvitador.value = "Usuario desconocido";
  }
};

onMounted(() => {
  toggleNotifications(); // Cargar solicitudes al montar el componente
  // Socket events
  socket.on("invitacionSala", (data) => {
    if (isMounted.value) {
      console.log("Invitación recibida:", data);
      invitationData.value = data;
      showInvitationModal.value = true;
      // Obtener el nombre del invitador cuando se recibe la invitación
      obtenerNombreInvitador(data.idInvitador);
    }
  });

  if (!socket.connected) {
    socket.connect();
  }

  socket.on("nuevaSolicitud", (data) => {
    if (isMounted.value) {
      console.log("Nueva solicitud de amistad:", data);
      fetchFriendRequests();
      toast.info("Nueva solicitud de amistad recibida", { autoClose: 3000 });
    }
  });
});

onUnmounted(() => {
  isMounted.value = false;
  socket.off("invitacionSala");
  socket.off("nuevaSolicitud");
  // Otros off según sea necesario
});
</script>

<template>
  <header class="cabecera">
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    />
    <div class="contenido">
      <!-- Título a la izquierda -->
      <h1 class="titulo-medieval" contenteditable>{{ titulo }}</h1>

      <!-- Perfil + notificaciones a la derecha -->
      <div class="perfil-notificaciones">
        <span v-if="esAdmin" class="admin-label">Admin</span>
        <div class="profile" :class="{ compacto }" @click="irAlPerfil">
          <img
            :src="avatarMap[user.avatar] || defaultAvatar"
            alt="User Icon"
            class="user-icon"
          />
          <div class="profile-info">
            <span class="user-name">{{ user.nombre || "NombreCuenta" }}</span>
            <span class="Rol">
              Rol favorito: {{ user.rolFavorito || "Sin rol favorito" }}
            </span>
          </div>
        </div>
        <div class="notifications">
          <button class="notification-button" @click="toggleNotifications">
            <img
              src="../assets/noti_icon.png"
              alt="Notificaciones"
              class="notification-icon"
            />
            <span class="badge" v-if="friendRequests.length > 0">
              {{ friendRequests.length }}
            </span>
          </button>
          <!-- Desplegable de notificaciones -->
          <div class="notifications-dropdown" v-if="showNotifications">
            <div v-if="loadingRequests">Cargando solicitudes...</div>
            <div v-else-if="errorRequests" class="error">
              {{ errorRequests }}
            </div>
            <div v-else>
              <template v-if="friendRequests.length > 0">
                <div
                  v-for="solicitud in friendRequests"
                  :key="solicitud.idSolicitud"
                  class="notification-item"
                >
                  <p>
                    Solicitud de amistad de
                    <strong>{{ solicitud.nombreEmisor }}</strong>
                  </p>
                  <div class="request-buttons">
                    <button
                      class="green-button"
                      @click="acceptRequest(solicitud)"
                    >
                      Aceptar
                    </button>
                    <button
                      class="red-button"
                      @click="rejectRequest(solicitud)"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </template>
              <template v-else>
                <p>No hay solicitudes de amistad.</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de feedback -->
    <div v-if="showFeedbackModal" class="feedback-modal-overlay">
      <div class="feedback-modal">
        <p :class="feedbackType">{{ feedbackMessage }}</p>
        <button class="blue-button" @click="closeFeedbackModal">Cerrar</button>
      </div>
    </div>

    <!-- Modal de invitación a sala -->
    <div v-if="showInvitationModal" class="invitation-modal">
      <div class="modal-content">
        <h2>Invitación a Sala</h2>
        <p>
          Has sido invitado a unirte a la sala
          <strong>{{ invitationData?.idSala }}</strong
          >.
        </p>
        <p>Invitación del usuario: {{ nombreInvitador }}</p>
        <div class="modal-buttons">
          <button class="green-button" @click="acceptInvitation">
            Aceptar
          </button>
          <button class="red-button" @click="rejectInvitation">Rechazar</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap");
/* Estilo para el título editable con MedievalSharp */
.titulo-medieval {
  margin: 0;
  padding: 0;
  white-space: nowrap;
  flex-grow: 1;
  font-family: "MedievalSharp", cursive;
  font-size: 1.8rem;
}
/* CABECERA */
.cabecera {
  width: 100%;
  background-color: #262522;
  color: #fff;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  margin-bottom: 2rem;
}
.contenido {
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 98%;
}
.contenido h1 {
  margin: 0;
  padding: 0;
  white-space: nowrap;
  flex-grow: 1;
}

/* PERFIL Y NOTIFICACIONES */
.perfil-notificaciones {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}
.profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  padding: 5px;
  border-radius: 8px;
}
.profile:hover {
  background-color: #333;
  transform: scale(1.03);
}
.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.user-name {
  font-weight: 700;
  font-size: 1rem;
}
.Rol {
  font-size: 0.9rem;
  color: #ccc;
}
.admin-label {
  background-color: #e74c3c;
  color: #fff;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}
/* NOTIFICACIONES */
.notifications {
  position: relative;
}
.notification-button {
  background-color: #262522;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notification-button:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}
.notification-icon {
  width: 40px;
  height: 40px;
}
.badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 0.7rem;
}
/* DESPLEGABLE */
.notifications-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: #262522;
  border: 1px solid #1f1e1c;
  border-radius: 8px;
  padding: 10px;
  width: 250px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
.notifications-dropdown p {
  margin: 0;
  font-size: 0.9rem;
  color: #fff;
}
.notification-item {
  padding: 8px;
  border-bottom: 1px solid #1f1e1c;
  margin-bottom: 5px;
}
.notification-item:last-child {
  border-bottom: none;
}
.request-buttons {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}
.green-button {
  background-color: #a2d060;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.green-button:hover {
  transform: scale(1.05);
}
.red-button {
  background-color: #e74c3c;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.red-button:hover {
  transform: scale(1.05);
}
/* MODAL DE FEEDBACK */
.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.feedback-modal {
  background-color: #262522;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
.feedback-modal p {
  margin-bottom: 20px;
  font-size: 1rem;
}
.feedback-modal p.success {
  color: #a2d060;
}
.feedback-modal p.error {
  color: #e74c3c;
}
.feedback-modal button {
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.feedback-modal button:hover {
  transform: scale(1.05);
}
/* MODAL DE INVITACIÓN */
.invitation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: #262522;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 90%;
  max-width: 400px;
}
.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.green-button {
  background-color: #a2d060;
  border: none;
  padding: 10px 20px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.red-button {
  background-color: #e74c3c;
  border: none;
  padding: 10px 20px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>

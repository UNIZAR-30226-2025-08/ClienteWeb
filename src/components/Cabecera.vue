<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Propiedades recibidas
const props = defineProps({
  titulo: {
    type: String,
    default: "Mi Aplicación",
  },
  compacto: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const user = ref({});

// Variables para el desplegable de notificaciones y solicitudes
const showNotifications = ref(false);
const friendRequests = ref([]);
const loadingRequests = ref(false);
const errorRequests = ref(null);

// Variables para el modal de feedback
const showFeedbackModal = ref(false);
const feedbackMessage = ref("");
const feedbackType = ref(""); // "success" o "error"

// Al montar, obtenemos el usuario del localStorage
onMounted(() => {
  const storedUser = localStorage.getItem("usuario");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    // Opcional: cargar solicitudes de inmediato
    // fetchFriendRequests();
  } else {
    user.value = {
      nombre: "NombreCuenta",
      avatar: "src/assets/profile_icon.jpg",
      rolFavorito: "Sin rol favorito",
    };
  }
});

// Función para redirigir a Perfil.vue
const irAlPerfil = () => {
  if (user.value) {
    router.push({
      name: "perfil",
      query: {
        nombre: user.value.nombre,
        avatar: user.value.avatar || "",
        rolFavorito: user.value.rolFavorito || "Sin rol favorito",
      },
    });
  }
};

// Alterna la visibilidad del desplegable y carga solicitudes al abrirlo
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    fetchFriendRequests();
  }
};

// Función para obtener las solicitudes de amistad (se espera que el endpoint use user.value.id como receptor)
const fetchFriendRequests = async () => {
  loadingRequests.value = true;
  errorRequests.value = null;
  try {
    // Se asume que el endpoint GET /api/solicitud/listar/:idUsuario devuelve { solicitudes: [...] }
    const response = await axios.get(`/api/solicitud/listar/${user.value.id}`);
    friendRequests.value = response.data.solicitudes || [];
  } catch (err) {
    console.error("Error al obtener solicitudes de amistad:", err);
    errorRequests.value = "Error al obtener solicitudes de amistad.";
  } finally {
    loadingRequests.value = false;
  }
};

// Función para cerrar el modal de feedback
const closeFeedbackModal = () => {
  showFeedbackModal.value = false;
  feedbackMessage.value = "";
  feedbackType.value = "";
};

// Función para aceptar una solicitud de amistad y mostrar retroalimentación en modal
const acceptRequest = async (solicitud) => {
  try {
    await axios.post("/api/solicitud/aceptar", {
      idEmisor: solicitud.idUsuarioEmisor,
      idReceptor: user.value.id,
    });
    // Elimina la solicitud aceptada de la lista
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

// Función para rechazar una solicitud de amistad y mostrar retroalimentación en modal
const rejectRequest = async (solicitud) => {
  try {
    await axios.post("/api/solicitud/rechazar", {
      idEmisor: solicitud.idUsuarioEmisor,
      idReceptor: user.value.id,
    });
    // Elimina la solicitud rechazada de la lista
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
</script>

<template>
  <header class="cabecera">
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    />
    <div class="contenido">
      <!-- Título a la izquierda -->
      <h1>{{ titulo }}</h1>

      <!-- Perfil + notificaciones a la derecha -->
      <div class="perfil-notificaciones">
        <div
          class="profile"
          :class="{ compacto: compacto }"
          @click="irAlPerfil"
        >
          <img
            :src="user.avatar || 'src/assets/profile_icon.jpg'"
            alt="User Icon"
            class="user-icon"
          />
          <div class="profile-info">
            <span class="user-name">{{ user.nombre || "NombreCuenta" }}</span>
            <span class="Rol">{{
              user.rolFavorito || "Sin rol favorito"
            }}</span>
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
  </header>
</template>

<style scoped>
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
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.contenido h1 {
  margin: 0;
  padding: 0;
  white-space: nowrap;
  margin-right: auto;
}

/* PERFIL + NOTIFICACIONES */
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
}
.profile.compacto {
  margin-left: 5rem;
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
</style>

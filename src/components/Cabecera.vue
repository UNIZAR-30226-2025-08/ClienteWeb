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
            <span class="Rol">
              {{ user.rolFavorito || "Sin rol favorito" }}
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
  </header>
</template>

<script>
import axios from "axios";

export default {
  name: "Cabecera",
  props: {
    titulo: {
      type: String,
      default: "Mi Aplicación",
    },
    compacto: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user: {},
      showNotifications: false,
      friendRequests: [],
      loadingRequests: false,
      errorRequests: null,
      showFeedbackModal: false,
      feedbackMessage: "",
      feedbackType: "",
    };
  },
  created() {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.user = {
        nombre: "NombreCuenta",
        avatar: "src/assets/profile_icon.jpg",
        rolFavorito: "Sin rol favorito",
      };
    }
  },
  methods: {
    irAlPerfil() {
      this.$router.push({
        name: "perfil",
        query: {
          nombre: this.user.nombre,
          avatar: this.user.avatar || "",
          rolFavorito: this.user.rolFavorito || "Sin rol favorito",
        },
      });
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.fetchFriendRequests();
      }
    },
    async fetchFriendRequests() {
      this.loadingRequests = true;
      this.errorRequests = null;
      try {
        // Se asume que el endpoint GET /api/solicitud/listar/:idUsuario devuelve { solicitudes: [...] }
        const response = await axios.get(
          `/api/solicitud/listar/${this.user.id}`
        );
        this.friendRequests = response.data.solicitudes || [];
      } catch (err) {
        console.error("Error al obtener solicitudes de amistad:", err);
        this.errorRequests = "Error al obtener solicitudes de amistad.";
      } finally {
        this.loadingRequests = false;
      }
    },
    async acceptRequest(solicitud) {
      try {
        await axios.post("/api/solicitud/aceptar", {
          idEmisor: solicitud.idUsuarioEmisor,
          idReceptor: this.user.id,
        });
        // Elimina la solicitud aceptada de la lista
        this.friendRequests = this.friendRequests.filter(
          (req) => req.idSolicitud !== solicitud.idSolicitud
        );
        this.feedbackMessage = "¡Solicitud aceptada! Tienes un nuevo amigo.";
        this.feedbackType = "success";
        this.showFeedbackModal = true;
      } catch (err) {
        console.error("Error al aceptar solicitud:", err);
        this.feedbackMessage =
          "Error al aceptar la solicitud. Inténtalo nuevamente.";
        this.feedbackType = "error";
        this.showFeedbackModal = true;
      }
    },
    async rejectRequest(solicitud) {
      try {
        await axios.post("/api/solicitud/rechazar", {
          idEmisor: solicitud.idUsuarioEmisor,
          idReceptor: this.user.id,
        });
        // Elimina la solicitud rechazada de la lista
        this.friendRequests = this.friendRequests.filter(
          (req) => req.idSolicitud !== solicitud.idSolicitud
        );
        this.feedbackMessage = "Solicitud rechazada.";
        this.feedbackType = "success";
        this.showFeedbackModal = true;
      } catch (err) {
        console.error("Error al rechazar solicitud:", err);
        this.feedbackMessage =
          "Error al rechazar la solicitud. Inténtalo nuevamente.";
        this.feedbackType = "error";
        this.showFeedbackModal = true;
      }
    },
    closeFeedbackModal() {
      this.showFeedbackModal = false;
      this.feedbackMessage = "";
      this.feedbackType = "";
    },
  },
};
</script>

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

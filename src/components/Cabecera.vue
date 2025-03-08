<template>
  <header class="cabecera">
    <div class="contenido">
      <!-- Título a la izquierda -->
      <h1>{{ titulo }}</h1>

      <!-- Perfil + notificaciones a la derecha -->
      <div class="perfil-notificaciones">
        <div class="profile" :class="{ compacto: compacto }">
          <!-- Se muestra el avatar obtenido o se usa un valor por defecto -->
          <img :src="user?.avatar || 'src\assets\profile_icon.jpg'" alt="User Icon" class="user-icon" />

          <div class="profile-info">
            <!-- Se muestra el nombre del usuario -->
            <span class="user-name">{{ user?.nombre || 'NombreCuenta' }}</span>
            <!-- En vez del nivel de experiencia se muestra el rol favorito -->
            <span class="Rol">{{ user?.rolFavorito || 'Sin rol favorito' }}</span>
          </div>
        </div>
        <div class="notifications">
          <button class="notification-button">
            <img src="../assets/noti_icon.png" alt="Notificaciones" class="notification-icon" />
            <span class="badge">1</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
// Recibir propiedades desde el componente padre (por ejemplo, título y si es compacto)
const props = defineProps({
  titulo: {
    type: String,
    default: 'Mi Aplicación'
  },
  compacto: {
    type: Boolean,
    default: false // Ajusta margenes si es "compacto"
  }
});
// Variable para almacenar los datos del usuario
const user = ref(null);

// Al montar el componente, se carga la información del usuario desde Local Storage
onMounted(() => {
  const storedUser = localStorage.getItem('usuario');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});
</script>
  
<style scoped>
/* --------------------- */
/* CABECERA              */
/* --------------------- */
.cabecera {
  width: 100%;
  background-color: #262522; /* Fondo oscuro */
  color: #fff;
  padding: 0.5rem 1rem;      /* Reducimos padding para ver fondo */
  box-sizing: border-box;
  margin-bottom: 2rem;       /* Más espacio debajo de la cabecera */
}

.contenido {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

/* Mantener en una sola línea "Server Browser" */
.contenido h1 {
  margin: 0;
  padding: 0;
  white-space: nowrap; /* Evita salto de línea en el título */
  margin-right: auto;  /* Lo empuja a la izquierda */
}

/* PERFIL + NOTIFICACIONES a la derecha */
.perfil-notificaciones {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto; /* Empuja este bloque a la derecha */
}

/* Info de perfil */
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

.rol {
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
</style>

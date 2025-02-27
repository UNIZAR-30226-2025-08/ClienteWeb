<template>
  <header class="cabecera">
    <div class="contenido">
      <!-- Título -->
      <h1>{{ titulo }}</h1>

      <!-- Contenedor flexible para perfil y notificaciones -->
      <div class="perfil-notificaciones">
        <!-- Perfil (Imagen + Nombre + Nivel + Barra XP) -->
        <div class="profile" :class="{ compacto: compacto }">
          <img src="../assets/profile_icon.jpg" alt="User Icon" class="user-icon" />
          
          <!-- Info del usuario en columna -->
          <div class="profile-info">
            <span class="user-name">NombreCuenta</span>
            <span class="level">Nivel 10</span>
            <progress class="xp-bar" value="2000" max="3000"></progress>
          </div>
        </div>

        <!-- Notificaciones alineadas a la derecha -->
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
const props = defineProps({
  titulo: {
    type: String,
    default: 'Mi Aplicación'
  },
  compacto: {
    type: Boolean,
    default: false // Por defecto usa el margen grande
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
  padding: 1rem;
  box-sizing: border-box;
}

.contenido {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distribuye los elementos */
}

/* --------------------- */
/* PERFIL Y NOTIFICACIONES */
/* --------------------- */
.perfil-notificaciones {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between; /* Asegura que las notificaciones vayan a la derecha */
}

/* PERFIL */
.profile {
  display: flex;
  align-items: center;
  gap: 1rem; /* Espaciado entre la imagen y la info del usuario */
}

/* Clase para compactar el margen */
.profile.compacto {
  margin-left: 5rem; /* Margen más pequeño si es compacto */
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

/* Info del usuario en columna */
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 700;
  font-size: 1rem;
}

.level {
  font-size: 0.9rem;
  color: #ccc;
}

.xp-bar {
  width: 160px;
  height: 10px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 4px;
}

.xp-bar::-webkit-progress-bar {
  background-color: #333;
  border-radius: 4px;
}

.xp-bar::-webkit-progress-value {
  background-color: #999;
  border-radius: 4px;
}

/* --------------------- */
/* NOTIFICACIONES        */
/* --------------------- */
.notifications {
  position: relative;
  margin-left: auto; /* Empuja las notificaciones a la derecha */
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

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mostrarConfirmacion = ref(false); // Estado para el pop-up

function irACrearSala() {
  router.push('/crear-sala');
}

function irARoles() {
  router.push('/roles');
}

function irAReglas() {
  router.push('/reglas');
}

function irAConfiguracion() {
  router.push('/configuracion');
}

function irAHome() {
  mostrarConfirmacion.value = true; // Solo muestra el pop-up
}

function confirmarSalida() {
  mostrarConfirmacion.value = false; // Cierra el pop-up
  router.push('/'); // Redirige al home
}

function cancelarSalida() {
  mostrarConfirmacion.value = false; // Cierra el pop-up sin redirigir
}

function irABuscarSalas() {
  router.push('/servidores');
}
</script>

<template>
  <div class="juego-container">
    <!-- Barra lateral -->
    <div class="sidebar">
      <button class="action-button-sidebar" @click="irARoles">Roles</button>
      <button class="action-button-sidebar" @click="irAReglas">Reglas</button>
      <button class="action-button-sidebar" @click="irAConfiguracion">Configuración</button>
      <button class="action-button salir-button" @click="irAHome">Salir</button>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Header: Perfil + Notificaciones -->
      <div class="header">
        <div class="user-profile">
          <img src="../assets/profile_icon.jpg" alt="User Icon" class="user-icon" />
          <div class="user-info">
            <span class="user-name">NombreCuenta</span>
            <div class="level-bar">
              <span class="level">Nivel 10</span>
              <progress class="xp-bar" value="2000" max="3000"></progress>
            </div>
          </div>
        </div>

        <div class="notifications">
          <button class="notification-button">
            <img src="../assets/noti_icon.png" alt="Notificaciones" class="notification-icon" />
            <span class="badge">1</span>
          </button>
        </div>
      </div>

      <!-- Contenido principal: Tabla -->
      <div class="content">
        <div class="history">
          <table class="history-table">
            <thead>
              <tr>
                <th colspan="3" class="main-title">Historial de Partidas</th>
              </tr>
            </thead>

            <tbody>
              <tr class="dark-row">
                <td>Fecha</td>
                <td>Modo</td>
                <td>Resultado</td>
              </tr>
              <tr class="light-row">
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="actions">
        <button class="action-button" @click="irACrearSala">Crear Sala</button>
        <button class="action-button">Partida Rápida</button>
        <button class="action-button" @click="irABuscarSalas">Buscar Salas</button>
      </div>
    </div>
  </div>

  <!-- Pop-up de confirmación -->
  <div v-if="mostrarConfirmacion" class="modal-overlay">
    <div class="modal">
      <p>¿Seguro que quieres salir?</p>
      <div class="modal-buttons">
        <button class="confirm-button" @click="confirmarSalida">Sí</button>
        <button class="cancel-button" @click="cancelarSalida">No</button>
      </div>
    </div>
  </div>
</template>


<style src="./juego.css"></style>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify'; // Asegúrate de que está importado en tu archivo
import 'vue3-toastify/dist/index.css'; // Asegúrate de que los estilos estén importados
import Cabecera from "../components/Cabecera.vue";
const router = useRouter();
const loginSuccess = localStorage.getItem('loginSuccess'); // Verificar si ya hubo un login exitoso

onMounted(() => {
  // Mostrar la alerta solo si la variable de loginSuccess está almacenada en el localStorage
  if (loginSuccess === 'true') {
    toast.success('Conexión exitosa, bienvenido!', { autoClose: 3000 }); // Mostrar alerta de éxito durante 5 segundos
    localStorage.removeItem('loginSuccess'); // Eliminar la variable del localStorage después de mostrarla
  }
});

// Lógica de navegación (por ejemplo, para navegar a otras páginas)
function irAHome() {
  router.push('/'); // Redirigir al home
}

function irACrearSala() {
  router.push('/crear-sala');
}

function irARoles() {
  router.push('/roles');
}

function irAReglas() {
  router.push('/reglas');
}

function irARanking() {
  router.push('/ranking');
}

function irAConfiguracion() {
  router.push('/configuracion');
}

function irABuscarSalas() {
  router.push('/servidores');
}
</script>

<template>
  <div class="Principalcontent">
    <div class="juego-container">
      <!-- Barra lateral -->
      <div class="sidebar">
        <button class="action-button-sidebar" @click="irARanking">Ranking</button>
        <button class="action-button-sidebar" @click="irARoles">Roles</button>
        <button class="action-button-sidebar" @click="irAReglas">Reglas</button>
        <button class="action-button-sidebar" @click="irAConfiguracion">Configuración</button>
        <button class="action-button salir-button" @click="irAHome">Salir</button>
      </div>

      <!-- Contenido principal -->
      <div class="main-content">
        <!-- Cabecera: Se utiliza el componente Cabecera -->
        <Cabecera :titulo="'Mi Juego'" :compacto="false" />

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
  </div>  
</template>



<style scoped>
/* 
   Colores (por referencia):
   - Fondo principal: #262522
   - Sidebar: #1F1E1C
   - Elementos más claros (botones, fila clara): #302E2B
   - Líneas de tabla en negro (#000)
*/

/* Contenedor principal */
.juego-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #302E2B;
  color: #fff;
  font-family: sans-serif;
  margin: 0;
}

/* Barra lateral */
.sidebar {
  width: 220px;
  background-color: #262522;
}

/* Contenido principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #302E2B;
  padding: 20px;
  position: relative;
}

/* Header: Perfil + Notificaciones */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Perfil de usuario */
.user-profile {
  display: flex;
  align-items: center;
}

/* Ícono cuadrado con esquinas redondeadas */
.user-icon {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Barra de nivel y experiencia */
.level-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level {
  font-size: 0.9rem;
}

.xp-bar {
  width: 250px;
  height: 14px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 5px;
}

.xp-bar::-webkit-progress-bar {
  background-color: #333;
  border-radius: 5px;
}

.xp-bar::-webkit-progress-value {
  background-color: #999;
  border-radius: 5px;
}

/* Notificaciones */
.notifications {
  position: relative;
}

.notification-button {
  background-color: #262522;
  border: none;
  border-radius: 8px;
  padding: 10px;
  position: relative;
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

/* Contenido principal */
.content {
  flex: 1;
}

/* --------------------- */
/* TABLA PERSONALIZADA   */
/* --------------------- */
.history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  color: #fff;
  margin-bottom: 20px;
}

/* Fila principal del thead */
.main-title {
  background-color: #262522; 
  text-align: left;
  font-size: 1rem;
  padding: 12px;
  border-bottom: 1px solid #302E2B; /* línea negra */
}

/* Fila oscura (Fecha/Modo/Resultado) */
.dark-row {
  background-color: #1F1E1C; /* Más oscura */
}

/* Fila clara (ejemplo --) */
.light-row {
  background-color: #262522; /* Más clara */
}

.history-table tbody td {
  padding: 12px;
  border-bottom: 1px solid #302E2B; /* línea negra */
  font-size: 0.95rem;
}

/* Quitar la línea inferior de la última fila si lo deseas */
.history-table tbody tr:last-child td {
  border-bottom: none;
}

/* ----------------------- */
/* BOTONES DE ACCIÓN ABAJO */
/* ----------------------- */
.actions {
  position: absolute;
  bottom: 120px; /* Ajusta para subir/bajar los botones */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 60px;     /* Separación entre botones */
}

.action-button {
  background-color: #262522;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.action-button:hover {
  background-color: #444;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.action-button-sidebar {
  width: 100%;
  margin: 15px 0;
  padding: 10px;
  background-color: #262522;
  color: white;
  border: none;
  cursor: pointer;
  text-align: center;
}

.action-button-sidebar:hover {
  background-color: #444;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}
/* Asegura que el botón "Salir" esté centrado abajo */
.salir-button {
  position: absolute;
  bottom: 20px;
  left: 6.7rem;
  transform: translateX(-50%);
  width: 10%;
  background-color: red;
  color: white;
  font-weight: bold;
}

/* Fondo oscuro semitransparente para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilo del modal */
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

/* Botones del modal */
.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.confirm-button {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: gray;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

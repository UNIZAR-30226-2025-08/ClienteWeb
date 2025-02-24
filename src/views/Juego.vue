<template>
  <div class="juego-container">
    <!-- Barra lateral -->
    <div class="sidebar"></div>

    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Header: Perfil + Notificaciones -->
      <div class="header">
        <div class="user-profile">
          <!-- Ícono cuadrado con esquinas redondeadas -->
          <img
            src="../assets/profile_icon.jpg"
            alt="User Icon"
            class="user-icon"
          />
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
            <img
              src="../assets/noti_icon.png"
              alt="Notificaciones"
              class="notification-icon"
            />
            <span class="badge">1</span>
          </button>
        </div>
      </div>

      <!-- Contenido principal: Tabla -->
      <div class="content">
        <div class="history">
          <table class="history-table">
            <!-- Encabezado que abarca las 3 columnas -->
            <thead>
              <tr>
                <th colspan="3" class="main-title">
                  Historial de Partidas
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- Fila oscura con Fecha / Modo / Resultado -->
              <tr class="dark-row">
                <td>Fecha</td>
                <td>Modo</td>
                <td>Resultado</td>
              </tr>
              <!-- Fila clara con los datos (--) -->
              <tr class="light-row">
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr>

              <!-- Si deseas más filas de datos, puedes duplicar la fila "light-row" -->
              <!-- <tr class="light-row">
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr> -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="actions">
        <button class="action-button">Crear Sala</button>
        <button class="action-button">Buscar Partida</button>
        <button class="action-button">Buscar Salas</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Juego'
}
</script>

<style src="./juego.css"></style>

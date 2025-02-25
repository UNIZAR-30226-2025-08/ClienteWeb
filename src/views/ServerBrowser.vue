<template>
  <div class="server-browser">
    <!-- Barra superior (color intermedio) -->
    <div class="top-bar">
      <h2 class="title">Server Browser</h2>
      <div class="profile">
        <img
          src="../assets/profile_icon.jpg"
          alt="User Icon"
          class="user-icon"
        />
        <div class="profile-info">
          <span class="user-name">NombreCuenta</span>
          <div class="level-container">
            <span class="level">Nivel 10</span>
            <!-- Barra de XP más larga -->
            <progress class="xp-bar" value="2000" max="3000"></progress>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenedor de la tabla -->
    <div class="table-container">
      <table class="server-table">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Pass</th>
            <th>Nombre Del Servidor</th>
            <th>Número Jugadores</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas de ejemplo -->
          <tr>
            <td>Sola</td>
            <td>
              <img
                src="../assets/candado.png"
                alt="Candado"
                class="lock-icon"
              />
            </td>
            <td>Servidor 1</td>
            <td>7/8</td>
          </tr>
          <tr>
            <td>Sala</td>
            <td></td>
            <td>Servidor 2</td>
            <td>4/8</td>
          </tr>
          <tr>
            <td>En Partida</td>
            <td>
              <img
                src="../assets/candado.png"
                alt="Candado"
                class="lock-icon"
              />
            </td>
            <td>Servidor 3</td>
            <td>12/12</td>
          </tr>
          <tr>
            <td>Empezando</td>
            <td>
              <img
                src="../assets/candado.png"
                alt="Candado"
                class="lock-icon"
              />
            </td>
            <td>Servidor 4</td>
            <td>7/12</td>
          </tr>
          <tr>
            <td>En Partida</td>
            <td>
              <img
                src="../assets/candado.png"
                alt="Candado"
                class="lock-icon"
              />
            </td>
            <td>Servidor 5</td>
            <td>8/8</td>
          </tr>
          <tr>
            <td>Sola</td>
            <td></td>
            <td>Servidor 6</td>
            <td>11/15</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Barra inferior (mismo color intermedio) -->
    <div class="bottom-bar">
      <button class="btn-back">
        <img src="../assets/flecha.png" alt="Volver" class="icon" />
        VOLVER
      </button>
      <button class="btn-join">
        UNIRSE
        <img src="../assets/tick_blanco.png" alt="Unirse" class="icon" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServerBrowser'
}
</script>

<style src="./ServerBrowser.css"></style>

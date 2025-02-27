<script setup>
import Volver from '../components/Volver.vue';
import Cabecera from '../components/Cabecera.vue'; // Importamos la cabecera
</script>

<template>
  <div class="server-browser">
    <!-- Cabecera con título -->
    <Cabecera titulo="Server Browser" />

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
          <tr>
            <td>Sola</td>
            <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
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
            <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
            <td>Servidor 3</td>
            <td>12/12</td>
          </tr>
          <tr>
            <td>Empezando</td>
            <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
            <td>Servidor 4</td>
            <td>7/12</td>
          </tr>
          <tr>
            <td>En Partida</td>
            <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
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

    <!-- Barra inferior -->
    <div class="bottom-bar">
      <Volver /> <!-- También aquí si quieres otro botón de volver -->
      <button class="btn-join">
        UNIRSE
        <img src="../assets/tick_blanco.png" alt="Unirse" class="icon" />
      </button>
    </div>
  </div>
</template>

<style src="./ServerBrowser.css"></style>

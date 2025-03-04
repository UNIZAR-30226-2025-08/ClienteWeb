<script setup>
import Volver from '../components/Volver.vue';
import Cabecera from '../components/Cabecera.vue';
</script>

<template>
  <!-- Contenedor principal de la vista de Sala -->
  <div class="sala-wrapper">
    <!-- Cabecera (ya hecha) -->
    <Cabecera titulo="Nombre De La Sala" :compacto="true" />

    <!-- Contenedor central que agrupa la info del jugador y los slots de la sala -->
    <div class="sala-content">
      <!-- Parte superior derecha con la info del jugador (NombreCuenta, Nivel, etc.) -->
      <div class="usuario-info">
        <div class="usuario-detalle">
          <!-- Icono/avatar del usuario (colócalo según tu proyecto) -->
          <img src="../assets/avatar.png" alt="Avatar" class="avatar-usuario" />
          <div class="usuario-nombre">NombreCuenta</div>
          <div class="usuario-nivel">Nivel 10</div>
          <div class="usuario-puntos">30085</div>
        </div>
      </div>

      <!-- Grid para los 12 'slots' de la sala (jugadores) -->
      <div class="slots-container">
        <!-- Ejemplo de slot con jugador 'Listo' -->
        <div class="slot-item">
          <div class="slot-avatar">
            <img src="../assets/avatar.png" alt="Avatar Jugador" />
          </div>
          <div class="slot-nombre">Jugador 1</div>
          <div class="slot-estado listo">Listo!</div>
        </div>

        <!-- Ejemplo de slot con jugador 'No Listo' -->
        <div class="slot-item">
          <div class="slot-avatar">
            <img src="../assets/avatar.png" alt="Avatar Jugador" />
          </div>
          <div class="slot-nombre">Jugador 2</div>
          <div class="slot-estado no-listo">No Listo</div>
        </div>

        <!-- Ejemplo de slot vacío (sin jugador) -->
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
        <div class="slot-item slot-vacio"></div>
      </div>
    </div>

    <!-- Barra inferior con botones -->
    <div class="bottom-bar">
      <Volver />
      <button class="btn-invite">Invitar Amigos</button>
      <button class="btn-start">Iniciar Partida</button>
    </div>
  </div>
</template>

<style src="./Sala.css"></style>

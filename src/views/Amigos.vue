<script setup>
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";
</script>

<template>
  <div class="amigos-page">
    <!-- Cabecera reutilizable -->
    <Cabecera titulo="Juega Con Amigos" :compacto="true" />

    <!-- Contenedor principal para la lista de amigos -->
    <div class="amigos-container">
      <!-- Primera fila de amigo -->
      <div class="friend-row">
        <div class="friend-info">
          <img
            src="../assets/profile_icon.jpg"
            alt="Icono Amigo"
            class="friend-icon"
          />
          <div class="friend-text">
            <p class="friend-name">Nombre Amigo</p>
            <p class="friend-status">En Sala / 1 Persona</p>
          </div>
        </div>
        <div class="friend-buttons">
          <!-- Botones verdes -->
          <button class="green-button">Unirse</button>
          <button class="green-button">Invitar</button>
        </div>
      </div>

      <!-- Segunda fila de amigo -->
      <div class="friend-row">
        <div class="friend-info">
          <img
            src="../assets/profile_icon.jpg"
            alt="Icono Amigo"
            class="friend-icon"
          />
          <div class="friend-text">
            <p class="friend-name">Nombre Amigo</p>
            <p class="friend-status">Pantalla De Inicio</p>
          </div>
        </div>
        <div class="friend-buttons">
          <button class="green-button">Invitar</button>
        </div>
      </div>
    </div>

    <!-- Barra inferior con botón Volver -->
    <div class="bottom-bar">
      <Volver />
    </div>
  </div>
</template>

<style src="./Amigos.css"></style>

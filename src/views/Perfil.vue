<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

// Importar imagen por defecto para evitar problemas con la ruta
import defaultAvatar from '../assets/profile_icon.jpg';

const router = useRoute();

// Computed properties para manejar los valores de manera segura
const nombre = computed(() => router.query.nombre || 'NombreCuenta');
const avatar = computed(() => router.query.avatar || defaultAvatar);
const rolFavorito = computed(() => router.query.rolFavorito || 'Sin rol favorito');

</script>

<template>
  <div class="perfil-container">
    <img :src="avatar" alt="Avatar" class="avatar" />
    <h2>{{ nombre }}</h2>
    <p>Rol Favorito: {{ rolFavorito }}</p>
  </div>
</template>

<style scoped>
.perfil-container {
  text-align: center;
  margin-top: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>

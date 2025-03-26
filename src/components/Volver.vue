<template>
  <div class="volver" @click="goBack">
    <span class="arrow">←</span>
    <span class="text">Volver</span>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.volver {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fff; /* Texto y flecha en blanco */
  padding: 0.5rem;
}

.arrow {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.text {
  font-size: 1rem;
}
</style>

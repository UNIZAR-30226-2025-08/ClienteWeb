<template>
  <!-- Aquí no es necesario agregar nada visible en el template -->
</template>

<script setup>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// Función para mostrar una notificación
function showToast(message, type = "info") {
  switch (type) {
    case "success":
      toast.success(message, { autoClose: 2000 });
      break;
    case "error":
      toast.error(message, { autoClose: 3000 });
      break;
    case "warning":
      toast.warning(message, { autoClose: 2000 });
      break;
    case "info":
    default:
      toast.info(message, { autoClose: 2000 });
      break;
  }
}

// Puedes exponer la función showToast para que sea accesible globalmente
defineExpose({
  showToast,
});
</script>

<style scoped>
/* Estilos adicionales (si los necesitas) */
</style>

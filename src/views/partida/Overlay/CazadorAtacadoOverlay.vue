<template>
  <transition name="fade">
    <!-- Mostramos el overlay con la transición fade, sin control de visibilidad -->
    <div class="cazador-atacado-overlay">
      <div class="dialog">
        <h2>Cuidado</h2>
        <p>El Cazador está a punto de disparar. ¡Prepárate!</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "CazadorAtacadoOverlay",
};
</script>

<style scoped>
/* Contenedor principal del overlay */
.cazador-atacado-overlay {
  /*prittier*/
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Fondo oscuro para hacer un efecto de alerta */
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9998; /* Asegúrate de que se muestre por encima de otros elementos */
}

/* Estilos del texto */
.dialog {
  text-align: center;
  color: #fff;
  font-family: "MedievalSharp", serif; /* Ejemplo de fuente, puedes cambiarla */
  padding: 2rem;
  border-radius: 0.5rem;
  background: #000000;
  max-width: 90%;
}

/* Animaciones de entrada/salida con transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

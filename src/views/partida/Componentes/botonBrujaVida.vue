<template>
  <div class="tooltip-container">
    <button class="boton-bruja" @click="$emit('usar-pocima-vida')">
      <img
        src="../../../assets/pocimaVida.png"
        alt="Poción de Vida"
        class="icono"
      />
    </button>
    <span class="tooltip-text">Poción de Vida</span>
  </div>
</template>

<script>
export default {
  name: "BotonBrujaVida",
};
</script>

<style scoped>
.boton-bruja {
  background-color: #262522;
  border: none;
  border-radius: 50%;
  width: 4rem; /* Aproximadamente 64px en una base de 1920px */
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}
/*prittier*/
.boton-bruja:hover {
  transform: scale(1.05);
}

.icono {
  width: 60%; /* La imagen ocupará el 60% del botón */
  height: auto;
}

/* Tooltips para poción de vida */
.tooltip-container {
  position: relative;
  display: inline-block;
}
.tooltip-text {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 0.5rem;
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1000;
}
.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}
.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>

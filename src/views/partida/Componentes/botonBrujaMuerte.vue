<template>
  <div class="tooltip-container">
    <button class="boton-bruja" @click="$emit('usar-pocima-muerte')">
      <img
        src="../../../assets/pocimaMuerte.png"
        alt="Poción de Muerte"
        class="icono"
      />
    </button>
    <span class="tooltip-text">Poción de Muerte</span>
  </div>
</template>

<script>
//prittier
export default {
  name: "BotonBrujaMuerte",
};
</script>

<style scoped>
.boton-bruja {
  background-color: #262522;
  border: none;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.boton-bruja:hover {
  transform: scale(1.05);
}

.icono {
  width: 60%;
  height: auto;
}

/* Tooltips para poción de muerte */
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

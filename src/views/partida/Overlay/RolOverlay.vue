<template>
  <div class="role-overlay fadeInOut">
    <h1 class="role-title">TU ROL ES</h1>
    <img :src="role.src" class="role-image" :alt="role.nombre" />
    <h2 class="role-name">{{ role.nombre.toUpperCase() }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    role: {
      type: Object,
      required: true,
      default: () => ({
        src: "",
        nombre: "",
      }),
    },
  },
};
</script>

<style scoped>
.role-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /*prittier*/
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.role-title {
  color: white;
  font-size: 4rem;
  margin-bottom: 2rem;
  font-family: "MedievalSharp", serif;
}

.role-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.role-name {
  color: #8b0000;
  font-size: 3rem;
  font-family: "Times New Roman", serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.fadeInOut {
  animation: fadeInOut 6s forwards;
}
</style>

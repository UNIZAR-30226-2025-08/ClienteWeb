<template>
  <header class="cabecera">
    <div class="contenido">
      <h1>{{ titulo }}</h1>
      <div class="profile">
        <img src="../assets/profile_icon.jpg" alt="User Icon" class="user-icon" />
        <div class="profile-info">
          <span class="user-name">NombreCuenta</span>
          <div class="level-container">
            <span class="level">Nivel 10</span>
            <progress class="xp-bar" value="2000" max="3000"></progress>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
  
  <script setup>
  const props = defineProps({
    titulo: {
      type: String,
      default: 'Mi Aplicación'  // Título por defecto
    }
  });
  </script>
  
  <style scoped>
  .cabecera {
    width: 100%;
    background-color: #262522; /* Fondo oscuro */
    color: #fff;
    padding: 1rem;
    box-sizing: border-box;
  }
  .contenido {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

  /* --------------------- */
/* BARRA SUPERIOR        */
/* --------------------- */
.top-bar {
  background-color: #302E2B; /* Color más claro */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  white-space: nowrap;
}

.profile {
  display: flex;
  align-items: center;
  margin-left: 40rem;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 10px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 4px;
}

.level-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level {
  font-size: 0.9rem;
}

/* Barra de XP más larga */
.xp-bar {
  width: 160px;
  height: 10px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 4px;
}

.xp-bar::-webkit-progress-bar {
  background-color: #333;
  border-radius: 4px;
}

.xp-bar::-webkit-progress-value {
  background-color: #999;
  border-radius: 4px;
}
</style>
  
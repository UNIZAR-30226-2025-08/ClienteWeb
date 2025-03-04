<script setup>
import Volver from '../components/Volver.vue';
import Cabecera from '../components/Cabecera.vue';
</script>

<template>
  <div class="server-browser">
    <Cabecera titulo="Server Browser" :compacto="true" />

    <!-- Contenedor general que ocupa todo el ancho -->
    <div class="server-container">
      <div class="table-container">
        <table class="server-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Pass</th>
              <th>Nombre Del Servidor</th>
              <th>Número Jugadores</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sola</td>
              <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
              <td>Servidor 1</td>
              <td>7/8</td>
            </tr>
            <tr>
              <td>Sala</td>
              <td></td>
              <td>Servidor 2</td>
              <td>4/8</td>
            </tr>
            <tr>
              <td>En Partida</td>
              <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
              <td>Servidor 3</td>
              <td>12/12</td>
            </tr>
            <tr>
              <td>Empezando</td>
              <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
              <td>Servidor 4</td>
              <td>7/12</td>
            </tr>
            <tr>
              <td>En Partida</td>
              <td><img src="../assets/candado.png" alt="Candado" class="lock-icon" /></td>
              <td>Servidor 5</td>
              <td>8/8</td>
            </tr>
            <tr>
              <td>Sola</td>
              <td></td>
              <td>Servidor 6</td>
              <td>11/15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bottom-bar">
      <Volver />
      <button class="btn-join">
        UNIRSE
        <img src="../assets/tick_blanco.png" alt="Unirse" class="icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 
   Paleta de colores (de claro a oscuro):
   #302E2B (más claro)
   #262522 (intermedio)
   #1F1E1C (más oscuro)
*/

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');

.server-browser {
  width: 100%;
  min-height: 100vh;
  background-color: #302E2B;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  margin-top: 1rem;
  box-sizing: border-box;
}

/* 
   NUEVO contenedor para que ocupe todo el ancho 
   y tenga más espacio arriba y abajo 
*/
.server-container {
  background-color: #262522;
  border-radius: 0px;
  margin: 20px 0;       /* Espacio vertical arriba y abajo */
  width: 100%;          /* Ocupa todo el ancho */
  padding: 60px;        /* Separación interna */
  box-sizing: border-box;
}

/* Contenedor de la tabla */
.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  margin: 0; /* Elimina margen para que llene .server-container */
}

/* Tabla de servidores */
.server-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1F1E1C; /* Más oscuro */
  border-radius: 12px;
  overflow: hidden;
}

/* Encabezado con bordes redondeados arriba */
.server-table thead {
  background-color: #302E2B; /* Más claro */
}

.server-table thead th {
  text-align: left;
  padding: 12px;
  font-size: 1rem;
  font-weight: 700;
}

.server-table thead tr:first-child th:first-child {
  border-top-left-radius: 12px;
}
.server-table thead tr:first-child th:last-child {
  border-top-right-radius: 12px;
}

/* Bordes redondeados en la última fila */
.server-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}
.server-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}

/* Líneas de separación */
.server-table th,
.server-table td {
  border: 1px solid #262522;
}

/* Cuerpo */
.server-table td {
  padding: 12px;
  font-size: 0.95rem;
  vertical-align: middle;
}

/* Icono del candado más grande */
.lock-icon {
  width: 24px; 
  height: 36px;
}

/* --------------------- */
/* BARRA INFERIOR        */
/* --------------------- */
.bottom-bar {
  background-color: #302E2B;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.btn-back,
.btn-join {
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: color 0.3s, transform 0.3s;
}

.icon {
  width: 16px;
  height: 16px;
}

.btn-back:hover,
.btn-join:hover {
  color: #ccc;
  transform: scale(1.05);
}
</style>

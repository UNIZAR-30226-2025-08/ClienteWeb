<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Volver from "../components/Volver.vue";
import Cabecera from "../components/Cabecera.vue";
import socket from "../utils/socket"; // Usa la ruta real según tu estructura
const router = useRouter();

// Variables reactivas
const salas = ref([]); // Lista de salas en tiempo real
const usuario = ref(null); // Usuario autenticado

// Función para obtener la lista de salas desde el servidor
const obtenerSalas = () => {
  socket.emit("obtenerSalas"); // Emitimos el evento para obtener las salas
};

onMounted(() => {
  if (!socket.connected) {
    socket.connect();
  }
  const usuarioGuardado = localStorage.getItem("usuario");
  if (!usuarioGuardado) {
    alert("Debes iniciar sesión para ver las salas.");
    router.push("/");
    return;
  }

  usuario.value = JSON.parse(usuarioGuardado);

  // Obtener la lista inicial de salas cuando se monta el componente
  obtenerSalas();

  // Escuchar la lista inicial de salas
  socket.on("listaSalas", (salasRecibidas) => {
    salas.value = salasRecibidas;
  });

  // Escuchar las actualizaciones de salas en tiempo real
  socket.on("actualizarSala", (salaActualizada) => {
    const index = salas.value.findIndex((s) => s.id === salaActualizada.id);
    if (index !== -1) {
      salas.value[index] = salaActualizada; // Si ya existe, actualizamos la sala
    } else {
      salas.value.push(salaActualizada); // Si no existe, agregamos la nueva sala
    }
  });

  // Escuchar cuando se cree una nueva sala
  socket.on("nuevaSala", (nuevaSala) => {
    salas.value.push(nuevaSala); // Agregamos la nueva sala a la lista
  });

  // Escuchar cuando se elimine una sala
  socket.on("eliminarSala", (idSala) => {
    salas.value = salas.value.filter((sala) => sala.id !== idSala); // Eliminamos la sala de la lista
  });

  // Manejo de errores
  socket.on("error", (mensaje) => {
    alert(`Error: ${mensaje}`);
  });
});

onUnmounted(() => {
  // Limpiar eventos al desmontar el componente
  socket.off("listaSalas");
  socket.off("actualizarSala");
  socket.off("nuevaSala");
  socket.off("eliminarSala");
  socket.off("error");
});

const unirseSala = (sala) => {
  if (!sala) return;

  let contrasena = null;
  if (sala.tipo === "privada") {
    contrasena = prompt("Introduce la contraseña de la sala:");
    if (!contrasena) return;
  }

  // Emitir evento para unirse a la sala
  socket.emit("unirseSala", {
    idSala: sala.id,
    usuario: usuario.value,
    contrasena,
  });

  // Escuchar la confirmación para evitar duplicados
  const salaActualizadaHandler = (salaActualizada) => {
    if (salaActualizada.id === sala.id) {
      localStorage.setItem("salaActual", JSON.stringify(salaActualizada));

      // 🔹 En lugar de router.push, recargamos la página completamente
      window.location.href = `/sala/${sala.id}`;

      // Limpiar el escuchador
      socket.off("salaActualizada", salaActualizadaHandler);
    }
  };

  socket.on("salaActualizada", salaActualizadaHandler);
};
</script>

<template>
  <div class="server-browser">
    <Cabecera titulo="Navegador de Salas" :compacto="true" />

    <div class="server-container">
      <div class="table-container">
        <table class="server-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Pass</th>
              <th>Nombre Del Servidor</th>
              <th>Número Jugadores</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sala in salas" :key="sala.id">
              <td>{{ sala.tipo === "privada" ? "Privada" : "Pública" }}</td>
              <td>
                <img
                  v-if="sala.tipo === 'privada'"
                  src="../assets/candado.png"
                  alt="Candado"
                  class="lock-icon"
                />
              </td>
              <td>{{ sala.nombre }}</td>
              <td>{{ sala.jugadores.length }}/{{ sala.maxJugadores }}</td>
              <td>
                <button @click="unirseSala(sala)">Unirse</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bottom-bar">
      <Volver />
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

@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap");

.server-browser {
  width: 100%;
  min-height: 100vh;
  background-color: #302e2b;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: "Open Sans", sans-serif;
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
  margin: 20px 0; /* Espacio vertical arriba y abajo */
  width: 100%; /* Ocupa todo el ancho */
  padding: 60px; /* Separación interna */
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
  background-color: #1f1e1c; /* Más oscuro */
  border-radius: 12px;
  overflow: hidden;
}

/* Encabezado con bordes redondeados arriba */
.server-table thead {
  background-color: #302e2b; /* Más claro */
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
  background-color: #302e2b;
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

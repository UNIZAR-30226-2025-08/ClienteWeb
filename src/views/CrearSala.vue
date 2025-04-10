<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";
// Importar socket.io-client para conectarse al servidor de websockets
import socket from "../utils/socket"; // Usa la ruta real según tu estructura

const router = useRouter();
const usuario = ref(null);
const nombreServidor = ref(""); // Inicializar vacío para que se actualice correctamente
const privacidad = ref("publica");
const password = ref("");

// Recuperar usuario autenticado al cargar la vista
onMounted(() => {
  if (!socket.connected) {
    socket.connect();
  }
  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    usuario.value = JSON.parse(usuarioGuardado);
    nombreServidor.value = `Sala de "${usuario.value.nombre}"`; // Usar el nombre del usuario
  } else {
    alert("Debes iniciar sesión para crear una sala.");
    router.push("/"); // Redirigir al home si no está autenticado
  }
});

// Inicialización de roles con valores predeterminados
const rolesCantidad = ref([
  {
    id: 1,
    nombre: "Hombre lobo",
    imagen: new URL("../assets/roles/hombre_lobo.jpeg", import.meta.url).href,
    cantidad: 1,
  },
  {
    id: 2,
    nombre: "Bruja",
    imagen: new URL("../assets/roles/bruja.jpeg", import.meta.url).href,
    cantidad: 0,
  },
  {
    id: 3,
    nombre: "Vidente",
    imagen: new URL("../assets/roles/vidente.jpeg", import.meta.url).href,
    cantidad: 1,
  },
  {
    id: 4,
    nombre: "Aldeano",
    imagen: new URL("../assets/roles/aldeano.jpeg", import.meta.url).href,
    cantidad: 3,
  },
  {
    id: 5,
    nombre: "Cazador",
    imagen: new URL("../assets/roles/cazador.jpeg", import.meta.url).href,
    cantidad: 0,
  },
]);

const numJugadores = computed(() =>
  rolesCantidad.value.reduce((acc, rol) => acc + rol.cantidad, 0)
);
const botonCrearDeshabilitado = computed(() => numJugadores.value < 5);

// Ajustar roles de forma automática
const ajustarRoles = () => {
  let jugadores = numJugadores.value;
  let lobos = jugadores >= 12 ? 3 : jugadores >= 8 ? 2 : 1;
  rolesCantidad.value.find((rol) => rol.nombre === "Hombre lobo").cantidad =
    lobos;

  if (privacidad.value === "publica") {
    rolesCantidad.value.forEach((rol) => {
      if (rol.nombre === "Vidente") rol.cantidad = 1;
      else if (rol.nombre === "Bruja") rol.cantidad = jugadores >= 8 ? 1 : 0;
      else if (rol.nombre === "Cazador") rol.cantidad = jugadores >= 12 ? 1 : 0;
    });

    const totalRolesEspeciales = rolesCantidad.value.reduce(
      (sum, rol) => (rol.nombre !== "Aldeano" ? sum + rol.cantidad : sum),
      0
    );
    rolesCantidad.value.find((rol) => rol.nombre === "Aldeano").cantidad =
      jugadores - totalRolesEspeciales;
  } else {
    if (jugadores !== 7 && jugadores !== 11) {
      const totalRolesEspeciales = rolesCantidad.value.reduce(
        (sum, rol) => (rol.nombre !== "Aldeano" ? sum + rol.cantidad : sum),
        0
      );
      rolesCantidad.value.find((rol) => rol.nombre === "Aldeano").cantidad =
        jugadores - totalRolesEspeciales;
    }
    if (jugadores !== 8 && jugadores !== 12) {
      const totalRolesEspeciales = rolesCantidad.value.reduce(
        (sum, rol) => (rol.nombre !== "Aldeano" ? sum - rol.cantidad : sum),
        0
      );
      rolesCantidad.value.find((rol) => rol.nombre === "Aldeano").cantidad =
        jugadores + totalRolesEspeciales;
    }
  }
};

// Watch para actualizar automáticamente los roles cuando cambia la privacidad o el número de jugadores
watch([privacidad, numJugadores], ajustarRoles);

// Funciones para modificar la privacidad y los jugadores
const cambiarPrivacidad = () =>
  (privacidad.value = privacidad.value === "publica" ? "Privada" : "publica");

const incrementarJugadores = () => {
  if (numJugadores.value < 18) {
    const aldeano = rolesCantidad.value.find((rol) => rol.nombre === "Aldeano");
    if (aldeano) aldeano.cantidad++;
  }
};

const decrementarJugadores = () => {
  if (numJugadores.value > 5) {
    const aldeano = rolesCantidad.value.find((rol) => rol.nombre === "Aldeano");
    if (aldeano && aldeano.cantidad > 0) aldeano.cantidad--;
  }
};

// Funciones para modificar roles manualmente en partidas privadas
const incrementarRol = (rol) => {
  if (
    privacidad.value === "publica" ||
    rol.nombre === "Hombre lobo" ||
    numJugadores.value >= 18
  )
    return;
  if ((rol.nombre === "Bruja" || rol.nombre === "Vidente") && rol.cantidad >= 1)
    return;
  if (rol.nombre === "Cazador" && rol.cantidad >= 2) return;
  rol.cantidad++;
};

const decrementarRol = (rol) => {
  if (
    privacidad.value === "publica" ||
    rol.nombre === "Hombre lobo" ||
    rol.cantidad <= 0
  )
    return;
  rol.cantidad--;
};

// Función para crear la sala utilizando websockets
function crearSala() {
  const maxRoles = rolesCantidad.value.reduce((acc, rol) => {
    acc[rol.nombre] = rol.cantidad;
    return acc;
  }, {});

  const salaData = {
    nombreSala: nombreServidor.value,
    tipo: privacidad.value.toLowerCase(),
    contrasena: privacidad.value === "Privada" ? password.value : null,
    maxJugadores: numJugadores.value,
    maxRoles,
    usuario: usuario.value,
  };

  console.log("Enviando datos de sala:", salaData);
  socket.emit("crearSala", salaData);
}

socket.on("salaCreada", (data) => {
  if (data && data.id) {
    localStorage.removeItem("salaActual");
    // Guardar la información de la sala para que el creador se vea dentro de ella
    localStorage.setItem("salaActual", JSON.stringify(data));

    // 🔹 En lugar de router.push, forzamos una recarga completa de la página
    window.location.href = `/sala/${data.id}`;
  } else {
    alert("Hubo un error al crear la sala. Por favor, inténtalo nuevamente.");
  }
});

// Escuchar un posible error al crear la sala
socket.on("errorSala", (msg) => {
  alert(`Error al crear la sala: ${msg}`);
});
</script>

<template>
  <div class="container">
    <Cabecera titulo="Configuración de Sala" />

    <div class="formulario">
      <div class="campo">
        <label>Nombre de la Sala:</label>
        <input v-model="nombreServidor" placeholder="Sala de..." />
      </div>

      <div class="campo">
        <label>Número de jugadores:</label>
        <button
          @click="decrementarJugadores"
          class="flecha"
          :disabled="numJugadores <= 5"
        >
          -
        </button>
        <span class="jugadores">{{ numJugadores }}</span>
        <button
          @click="incrementarJugadores"
          class="flecha"
          :hidden="numJugadores >= 18"
        >
          +
        </button>
      </div>

      <div class="campo flex-row">
        <div class="tipo">
          <label>Tipo:</label>
          <button class="flecha" @click="cambiarPrivacidad">🡨</button>
          <span>{{ privacidad }}</span>
          <button class="flecha" @click="cambiarPrivacidad">🡪</button>
        </div>
        <div v-if="privacidad === 'Privada'" class="contraseña">
          <label>Contraseña:</label>
          <input
            type="password"
            v-model="password"
            placeholder="Introduce una contraseña"
          />
        </div>
      </div>

      <h3>Roles asignados:</h3>
      <div class="roles">
        <div v-for="rol in rolesCantidad" :key="rol.id" class="rol">
          <img :src="rol.imagen" :alt="rol.nombre" />
          <span>{{ rol.nombre }}: {{ rol.cantidad }}</span>

          <div class="role-controls">
            <button
              v-if="
                rol.cantidad > 0 &&
                privacidad !== 'publica' &&
                rol.nombre !== 'Hombre lobo'
              "
              @click.stop="decrementarRol(rol)"
              class="button decrement"
            >
              -
            </button>

            <span class="role-amount">{{ rol.cantidad }}</span>

            <button
              v-if="
                privacidad !== 'publica' &&
                rol.nombre !== 'Hombre lobo' &&
                numJugadores < 18 &&
                numJugadores !== 7 &&
                numJugadores !== 11 &&
                ((rol.nombre === 'Bruja' && rol.cantidad < 1) ||
                  (rol.nombre === 'Vidente' && rol.cantidad < 1) ||
                  (rol.nombre === 'Cazador' && rol.cantidad < 2) ||
                  rol.nombre === 'Aldeano')
              "
              @click.stop="incrementarRol(rol)"
              class="button increment"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="acciones">
      <Volver />
      <div class="acciones-derecha">
        <button
          v-if="!botonCrearDeshabilitado"
          class="crear-sala"
          :disabled="botonCrearDeshabilitado"
          @click="crearSala"
        >
          Crear Sala
        </button>

        <p v-if="botonCrearDeshabilitado" class="warning-message">
          <span v-if="numJugadores < 5">
            Asegúrate de tener al menos 5 jugadores.
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #2c2a28 0%, #1a1917 100%);
  color: #fff;
  font-family: "Segoe UI", system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.formulario {
  width: 88%;
  max-width: 1600px;
  padding: 2rem;
  background: rgba(38, 37, 34, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin: 2rem auto;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.campo {
  margin-bottom: 2rem;
  position: relative;
}

.campo:nth-child(2) {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.campo:nth-child(2) > div {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  padding: 8px;
}
.campo label {
  display: block;
  font-size: 0.9rem;
  color: #a8a6a1;
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.campo input {
  width: 95%;
  padding: 12px 16px;
  background: rgba(217, 217, 217, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.campo input:focus {
  outline: none;
  border-color: #a2d060;
  box-shadow: 0 0 0 3px rgba(162, 208, 96, 0.2);
}

.campo input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.flex-row {
  display: flex;
  gap: 2rem;
  align-items: flex-end;
}

.tipo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.flecha {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flecha:hover {
  background: rgba(162, 208, 96, 0.2);
  transform: scale(1.05);
}

.jugadores {
  font-size: 1.8rem;
  font-weight: 700;
  color: #a2d060;
  margin: 0 1rem;
  min-width: 50px;
  text-align: center;
}

.roles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.rol {
  background: linear-gradient(
    160deg,
    rgba(50, 48, 45, 0.8) 0%,
    rgba(40, 38, 35, 0.9) 100%
  );
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(162, 208, 96, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.rol:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  border-color: rgba(162, 208, 96, 0.3);
}

.rol img {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.rol span {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
}

.rol .role-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.role-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.increment {
  background: linear-gradient(135deg, #a2d060 0%, #8fb853 100%);
  color: #2c2a28;
}

.increment:hover {
  background: linear-gradient(135deg, #8fb853 0%, #7da347 100%);
}

.decrement {
  background: linear-gradient(135deg, #e74c3c 0%, #d34335 100%);
  color: white;
}

.decrement:hover {
  background: linear-gradient(135deg, #d34335 0%, #c23a2d 100%);
}

.role-amount {
  font-size: 1.6rem;
  font-weight: 700;
  color: #a2d060;
  min-width: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Role specific styling */
.rol[data-role="Hombre lobo"] {
  border-color: rgba(231, 76, 60, 0.2);
}

.rol[data-role="Bruja"] {
  border-color: rgba(155, 89, 182, 0.2);
}

.rol[data-role="Vidente"] {
  border-color: rgba(52, 152, 219, 0.2);
}

.rol[data-role="Cazador"] {
  border-color: rgba(241, 196, 15, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .roles {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }

  .rol {
    padding: 1.5rem;
  }

  .rol img {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .roles {
    grid-template-columns: 1fr;
  }

  .role-controls {
    gap: 1rem;
  }

  .button {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
}
.acciones {
  position: fixed;
  bottom: 20px;
  right: 20px;
  margin: 0;
  width: auto;
}

.acciones-derecha {
  margin-left: 0;
}

.crear-sala {
  background: linear-gradient(135deg, #a2d060 0%, #8fb853 100%);
  color: #1a1917;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-right: 0;
}

.crear-sala:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(162, 208, 96, 0.3);
}

.crear-sala:disabled {
  background: #3a3937;
  color: #6b6a67;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Mobile adjustment */
@media (max-width: 768px) {
  .acciones {
    bottom: 10px;
    right: 10px;
  }

  .crear-sala {
    width: 90px;
    padding: 10px;
    font-size: 1rem;
  }
}
.warning-message {
  color: #e74c3c;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.5rem;
  text-align: right;
}

h3 {
  color: #a2d060;
  font-size: 1.4rem;
  margin: 2rem 0 1.5rem;
  position: relative;
  padding-left: 1rem;
}

h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: #a2d060;
  border-radius: 2px;
}

.contraseña {
  flex-grow: 1;
  animation: slideIn 0.3s ease;
}
.contraseña input {
  width: 30%;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

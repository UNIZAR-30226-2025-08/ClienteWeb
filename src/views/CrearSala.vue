<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cabecera from '../components/Cabecera.vue';
import Volver from '../components/Volver.vue';
// Importar socket.io-client para conectarse al servidor de websockets
//import { io } from 'socket.io-client';

// Crear la conexión al servidor de websockets (ajusta la URL según tu entorno)
const socket = io('http://localhost:5000');

const router = useRouter();
const usuario = ref(null);
const nombreServidor = ref(''); // Inicializar vacío para que se actualice correctamente
const privacidad = ref('Privada');
const password = ref('');

// 🟢 Recuperar usuario autenticado al cargar la vista
onMounted(() => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    usuario.value = JSON.parse(usuarioGuardado);
    nombreServidor.value = `Servidor de "${usuario.value.nombre}"`; // Usar el nombre del usuario
  } else {
    alert('Debes iniciar sesión para crear una sala.');
    router.push('/'); // Redirigir al home si no está autenticado
  }
});

// Inicialización de roles con valores predeterminados
const rolesCantidad = ref([
  { id: 1, nombre: 'Hombre Lobo', imagen: new URL('../assets/roles/hombre_lobo.jpeg', import.meta.url).href, cantidad: 1 },
  { id: 2, nombre: 'Bruja', imagen: new URL('../assets/roles/bruja.jpeg', import.meta.url).href, cantidad: 0 },
  { id: 3, nombre: 'Vidente', imagen: new URL('../assets/roles/vidente.jpeg', import.meta.url).href, cantidad: 1 },
  { id: 4, nombre: 'Aldeano', imagen: new URL('../assets/roles/aldeano.jpeg', import.meta.url).href, cantidad: 3 },
  { id: 5, nombre: 'Cazador', imagen: new URL('../assets/roles/cazador.jpeg', import.meta.url).href, cantidad: 0 }
]);

const numJugadores = computed(() => rolesCantidad.value.reduce((acc, rol) => acc + rol.cantidad, 0));
const botonCrearDeshabilitado = computed(() => numJugadores.value < 5);

// Ajustar roles de forma automática
const ajustarRoles = () => {
  let jugadores = numJugadores.value;
  let lobos = jugadores >= 12 ? 3 : jugadores >= 8 ? 2 : 1;
  rolesCantidad.value.find(rol => rol.nombre === 'Hombre Lobo').cantidad = lobos;

  if (privacidad.value === 'publica') {
    rolesCantidad.value.forEach(rol => {
      if (rol.nombre === 'Vidente') rol.cantidad = 1;
      else if (rol.nombre === 'Bruja') rol.cantidad = jugadores >= 8 ? 1 : 0;
      else if (rol.nombre === 'Cazador') rol.cantidad = jugadores >= 12 ? 1 : 0;
    });

    const totalRolesEspeciales = rolesCantidad.value.reduce((sum, rol) => rol.nombre !== 'Aldeano' ? sum + rol.cantidad : sum, 0);
    rolesCantidad.value.find(rol => rol.nombre === 'Aldeano').cantidad = jugadores - totalRolesEspeciales;
  } else {
    if (jugadores !== 7 && jugadores !== 11) {
      const totalRolesEspeciales = rolesCantidad.value.reduce((sum, rol) => rol.nombre !== 'Aldeano' ? sum + rol.cantidad : sum, 0);
      rolesCantidad.value.find(rol => rol.nombre === 'Aldeano').cantidad = jugadores - totalRolesEspeciales;
    }
    if (jugadores !== 8 && jugadores !== 12){
      const totalRolesEspeciales = rolesCantidad.value.reduce((sum, rol) => rol.nombre !== 'Aldeano' ? sum - rol.cantidad : sum, 0);
      rolesCantidad.value.find(rol => rol.nombre === 'Aldeano').cantidad = jugadores + totalRolesEspeciales;
    }
  }
};

// Watch para actualizar automáticamente los roles cuando cambia la privacidad o el número de jugadores
watch([privacidad, numJugadores], ajustarRoles);

// Funciones para modificar la privacidad y los jugadores
const cambiarPrivacidad = () => privacidad.value = privacidad.value === 'publica' ? 'Privada' : 'publica';

const incrementarJugadores = () => {
  if (numJugadores.value < 18) {
    const aldeano = rolesCantidad.value.find(rol => rol.nombre === 'Aldeano');
    if (aldeano) aldeano.cantidad++;
  }
};

const decrementarJugadores = () => {
  if (numJugadores.value > 5) {
    const aldeano = rolesCantidad.value.find(rol => rol.nombre === 'Aldeano');
    if (aldeano && aldeano.cantidad > 0) aldeano.cantidad--;
  }
};

// Funciones para modificar roles manualmente en partidas privadas
const incrementarRol = (rol) => {
  if (privacidad.value === 'publica' || rol.nombre === 'Hombre Lobo' || numJugadores.value >= 18) return;
  if ((rol.nombre === 'Bruja' || rol.nombre === 'Vidente') && rol.cantidad >= 1) return;
  if (rol.nombre === 'Cazador' && rol.cantidad >= 2) return;
  rol.cantidad++;
};

const decrementarRol = (rol) => {
  if (privacidad.value === 'publica' || rol.nombre === 'Hombre Lobo' || rol.cantidad <= 0) return;
  rol.cantidad--;
};

// Función para crear la sala utilizando websockets
function crearSala() {
  const maxRolesEspeciales = rolesCantidad.value
    .filter(rol => rol.nombre !== 'Aldeano')
    .reduce((acum, rol) => acum + rol.cantidad, 0);

  const salaData = {
    nombreSala: nombreServidor.value,                        
    tipo: privacidad.value.toLowerCase(),                   
    contrasena: privacidad.value === 'Privada' ? password.value : null,  
    maxJugadores: numJugadores.value,
    maxRolesEspeciales,                                      
    usuario: usuario.value                                   
  };

  console.log("Enviando datos de sala:", salaData);
  socket.emit('crearSala', salaData);
}

socket.on('salaCreada', (data) => {
  if (data && data.id) {
    // Guardar la información de la sala para que el creador se vea dentro de ella
    localStorage.setItem('salaActual', JSON.stringify(data));
    
    // 🔹 En lugar de router.push, forzamos una recarga completa de la página
    window.location.href = `/sala/${data.id}`;
  } else {
    alert('Hubo un error al crear la sala. Por favor, inténtalo nuevamente.');
  }
});


// Escuchar un posible error al crear la sala
socket.on('errorSala', (msg) => {
  alert(`Error al crear la sala: ${msg}`);
});
</script>

<template>
  <div class="container">
    <Cabecera titulo="Server Settings" />

    <div class="formulario">
      <div class="campo">
        <label>Nombre del Servidor:</label>
        <input v-model="nombreServidor" placeholder="Servidor de..." />
      </div>

      <div class="campo">
        <label>Número de jugadores:</label>
        <button @click="decrementarJugadores" class="flecha" :disabled="numJugadores <= 5">-</button>
        <span class="jugadores">{{ numJugadores }}</span>
        <button @click="incrementarJugadores" class="flecha" :hidden="numJugadores >= 18">+</button>
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
          <input type="password" v-model="password" placeholder="Introduce una contraseña" />
        </div>
      </div>

      <h3>Roles asignados:</h3>
      <div class="roles">
        <div 
          v-for="rol in rolesCantidad" 
          :key="rol.id" 
          class="rol"
        >
          <img :src="rol.imagen" :alt="rol.nombre" />
          <span>{{ rol.nombre }}: {{ rol.cantidad }}</span>
          
          <div class="role-controls">
            <button 
              v-if="rol.cantidad > 0 && privacidad !== 'publica' && rol.nombre !== 'Hombre Lobo'"
              @click.stop="decrementarRol(rol)"  
              class="button decrement"
            >
              - 
            </button>

            <span class="role-amount">{{ rol.cantidad }}</span>

            <button 
              v-if="privacidad !== 'publica' && rol.nombre !== 'Hombre Lobo' && numJugadores < 18 && 
                    numJugadores !== 7 && numJugadores !== 11 &&
                    ((rol.nombre === 'Bruja' && rol.cantidad < 1) || 
                      (rol.nombre === 'Vidente' && rol.cantidad < 1) || 
                      (rol.nombre === 'Cazador' && rol.cantidad < 2) || 
                      (rol.nombre === 'Aldeano'))"
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
</template>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #302E2B;
  color: #fff;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
  
.formulario {
  width: 100%;
  padding: 20px;
  background-color: #262522;
  margin: 30px auto;
  flex-grow: 1;
  text-align: left;
}
  
.campo {
  margin-bottom: 20px;
}
  
.flex-row {
  display: flex;
  align-items: center;
  gap: 30px;
}
  
.tipo, .contraseña {
  display: flex;
  align-items: center;
}
  
.campo label {
  display: inline-block;
  font-size: 16px;
  margin-bottom: 0;
  margin-right: 10px;
}
  
.campo input {
  width: 60%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #D9D9D9;
  color: #000000;
}
  
.flecha {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  padding: 5px;
  cursor: pointer;
  transition: color 0.3s;
}
  
.flecha:hover {
  color: #ccc;
}
  
.roles {
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin-top: 20px;
}
  
.rol {
  display: flex;
  align-items: center;
  flex-direction: column;
}
  
.rol img {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}
  
.contador {
  display: flex;
  align-items: center;
  gap: 10px;
}
  
.acciones {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin: 0 auto 20px;
}
  
.crear-sala {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
  
.crear-sala:hover {
  background-color: #218838;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
  
.popup-content {
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 500px;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.jugadores {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  padding: 10px;
}
  
.role-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 5px;
}
  
.button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}
  
.button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
  
.decrement {
  background-color: #ff4d4d;
}
  
.increment {
  background-color: #4CAF50;
}
  
.role-amount {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0 10px;
  min-width: 25px;
  text-align: center;
}
  
.max-label {
  font-size: 1rem;
  font-weight: bold;
  color: #ff4d4d;
  min-width: 40px;
  text-align: center;
}
  
.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
  
.warning-message {
  color: #ff4d4d;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}
</style>

<script setup>
import { ref, computed, watch } from 'vue';
import Cabecera from '../components/Cabecera.vue';
import Volver from '../components/Volver.vue';
import { roles } from '../assets/data/roles.js';

const nombreServidor = ref('Servidor de "nombreJugador"');
const privacidad = ref('Privada');
const password = ref('');

// Inicialización de roles con valores predeterminados
const rolesCantidad = ref([
  { id: 1, nombre: 'Hombre Lobo', imagen: new URL('../assets/roles/hombre_lobo.jpeg', import.meta.url).href, cantidad: 1 },
  { id: 2, nombre: 'Bruja', imagen: new URL('../assets/roles/bruja.jpeg', import.meta.url).href, cantidad: 0 },
  { id: 3, nombre: 'Vidente', imagen: new URL('../assets/roles/vidente.jpeg', import.meta.url).href, cantidad: 1 },
  { id: 4, nombre: 'Aldeano', imagen: new URL('../assets/roles/aldeano.jpeg', import.meta.url).href, cantidad: 3 },
  { id: 5, nombre: 'Cazador', imagen: new URL('../assets/roles/cazador.jpeg', import.meta.url).href, cantidad: 0 }
]);

// Computed para obtener el número total de jugadores
const numJugadores = computed(() => rolesCantidad.value.reduce((acc, rol) => acc + rol.cantidad, 0));

// Ajustar roles de forma automática
const ajustarRoles = () => {
  let jugadores = numJugadores.value;

  // 📌 Ajuste automático de lobos SIEMPRE, sin importar privacidad
  let lobos = jugadores >= 12 ? 3 : jugadores >= 8 ? 2 : 1;
  rolesCantidad.value.find(rol => rol.nombre === 'Hombre Lobo').cantidad = lobos;

  if (privacidad.value === 'Pública') {
    // 📌 Ajuste automático de otros roles solo si es pública
    rolesCantidad.value.forEach(rol => {
      if (rol.nombre === 'Vidente') {
        rol.cantidad = 1;
      } else if (rol.nombre === 'Bruja') {
        rol.cantidad = jugadores >= 8 ? 1 : 0;
      } else if (rol.nombre === 'Cazador') {
        rol.cantidad = jugadores >= 12 ? 1 : 0;
      }
    });

    // 📌 Calcular los aldeanos restantes
    const totalRolesEspeciales = rolesCantidad.value.reduce((sum, rol) => rol.nombre !== 'Aldeano' ? sum + rol.cantidad : sum, 0);
    rolesCantidad.value.find(rol => rol.nombre === 'Aldeano').cantidad = jugadores - totalRolesEspeciales;
  }
};

// Watch para actualizar automáticamente los roles cuando cambia la privacidad o el número de jugadores
watch([privacidad, numJugadores], ajustarRoles);

// Función para cambiar la privacidad
const cambiarPrivacidad = () => {
  privacidad.value = privacidad.value === 'Pública' ? 'Privada' : 'Pública';
};

// Función para incrementar el número de jugadores (máximo 18)
const incrementarJugadores = () => {
  if (numJugadores.value < 18) {
    const aldeano = rolesCantidad.value.find(rol => rol.nombre === 'Aldeano');
    if (aldeano) aldeano.cantidad++;
  }
};

// Función para decrementar el número de jugadores (mínimo 5)
const decrementarJugadores = () => {
  if (numJugadores.value > 5) {
    const aldeano = rolesCantidad.value.find(rol => rol.nombre === 'Aldeano');
    if (aldeano && aldeano.cantidad > 0) aldeano.cantidad--;
  }
};

// Función para incrementar la cantidad de un rol (solo en partidas privadas)
const incrementarRol = (rol) => {
  if (privacidad.value === 'Pública') return;
  if (rol.nombre === 'Hombre Lobo') return; // ❌ Lobos no modificables manualmente

  // 📌 Evitar superar el límite de 18 jugadores
  if (numJugadores.value >= 18) return;

  // 📌 Aplicar límites específicos
  if (rol.nombre === 'Bruja' && rol.cantidad >= 1) return; // Máximo 1 Bruja
  if (rol.nombre === 'Vidente' && rol.cantidad >= 1) return; // Máximo 1 Vidente
  if (rol.nombre === 'Cazador' && rol.cantidad >= 2) return; // Máximo 2 Cazadores

  rol.cantidad++;
};

// Función para decrementar la cantidad de un rol (solo en partidas privadas)
const decrementarRol = (rol) => {
  if (privacidad.value === 'Pública') return;
  if (rol.nombre === 'Hombre Lobo') return; // ❌ Lobos no modificables manualmente

  if (rol.cantidad > 0) rol.cantidad--;
};



// Computed para deshabilitar el botón de "Crear Sala"
const botonCrearDeshabilitado = computed(() => numJugadores.value < 5);
</script>

<template>
  <div class="container">
    <Cabecera titulo="Server Settings" />

    <div class="formulario">
      <div class="campo">
        <label>Nombre del Servidor:</label>
        <input type="text" v-model="nombreServidor" placeholder="Introduce un nombre" />
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
              v-if="rol.cantidad > 0 && privacidad !== 'Pública' && rol.nombre !== 'Hombre Lobo'"
              @click.stop="decrementarRol(rol)"  
              class="button decrement"
            >
              -
            </button>

            <span class="role-amount">{{ rol.cantidad }}</span>

            <button 
              v-if="privacidad !== 'Pública' && rol.nombre !== 'Hombre Lobo' && numJugadores < 18 && 
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
  
  /* Etiquetas en línea con un pequeño margen */
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
  
  /* ====== Estilo para las flechas más finas y elegantes ====== */
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
  
  /* Estilo cuando el botón está deshabilitado */
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

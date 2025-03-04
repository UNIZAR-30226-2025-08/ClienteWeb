<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Vamos a capturar los datos del formulario y enviarlos a /api/usuario/crear con axios

const router = useRouter();

// Función para volver a la pantalla principal
function volver() {
  router.push('/');
}

// Función para ir a la pantalla de inicio de sesión
function irALogin() {
  router.push('/');
}

const nombre = ref('');
const correo = ref('');
const contrasena = ref('');
const confirmacionContrasena = ref('');
const mensajeError = ref('');

// Control de visibilidad de contraseña
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function togglePasswordVisibility(field) {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'confirm-password') {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
}

// Función para realizar el hash SHA-256
async function generarHashSHA256(contrasena) {
  const encoder = new TextEncoder();
  const data = encoder.encode(contrasena);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Verificar si las contraseñas coinciden y enviar los datos del formulario al backend
async function registerUser() {
  mensajeError.value = '';

  if (!nombre.value || !correo.value || !contrasena.value || !confirmacionContrasena.value) {
    mensajeError.value = 'Todos los campos son obligatorios';
    return;
  }

  if (contrasena.value !== confirmacionContrasena.value) {
    mensajeError.value = 'Las contraseñas no coinciden';
    return;
  }

  try {
    // Generar hash SHA-256 en el cliente
    const hashContrasena = await generarHashSHA256(contrasena.value);

    const response = await axios.post('/api/usuario/crear', {
      nombre: nombre.value,
      correo: correo.value,
      contrasena: hashContrasena // Enviar la contraseña encriptada
    });

    if (response.status === 201) {
      router.push('/login-email');
    } else {
      mensajeError.value = 'No se pudo completar el registro';
    }
  } catch (error) {
    mensajeError.value = error.response?.data?.message || 'Error al registrar usuario';
  }
}
</script>

<template>
  <div class="register-container">
    <button class="back-button" @click="volver">← Volver</button>
    <h2 class="register-title">Únete a los hombres lobo de Castronegro</h2>
    
    <form class="register-form" @submit.prevent="registerUser">
      <label for="nombre">Nombre de usuario</label>
      <input id="nombre" v-model="nombre" type="text" placeholder="Ingresa tu nombre de usuario" required />

      <label for="correo">Correo electrónico</label>
      <input id="correo" v-model="correo" type="email" placeholder="Ingresa tu correo" required/>

      <label for="contrasena">Contraseña</label>
      <div class="password-container">
        <input 
          id="contrasena" 
          v-model="contrasena"
          :type="showPassword ? 'text' : 'password'" 
          placeholder="********" 
          required
        />
        <button type="button" class="toggle-password" @click="togglePasswordVisibility('password')">
          {{ showPassword ? '👁️' : '🙈' }}
        </button>
      </div>

      <label for="confirm-password">Confirmar Contraseña</label>
      <div class="password-container">
        <input 
          id="confirm-password"
          v-model="confirmacionContrasena"
          :type="showConfirmPassword ? 'text' : 'password'" 
          placeholder="Repite la contraseña"
          required
        />
        <button type="button" class="toggle-password" @click="togglePasswordVisibility('confirm-password')">
          {{ showConfirmPassword ? '👁️' : '🙈' }}
        </button>
      </div>

      <p v-if="mensajeError" class="error-message">{{ mensajeError }}</p>

      <button type="submit" class="submit-button">REGISTRARSE</button>
    </form>
  </div>
</template>

<style scoped>

.register-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background: #302E2B;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  text-align: left;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 10px;
  color: #ffffff;
}

.back-button:hover {
    color: #d1d134;
}
.register-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.register-form label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #ffffff;
}

.register-form input {
  width: 95%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.submit-button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0069d9;
}

.login-link {
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
}

.login-link a {
  color: #ffffff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-container input {
  width: 100%;
  padding-right: 40px; /* Espacio para el botón */
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();

// Función para volver a la pantalla principal
function volver() {
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

// Función para realizar el hash SHA-256
async function generarHashSHA256(contrasena) {
  const encoder = new TextEncoder();
  const data = encoder.encode(contrasena);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


// Función para registrar usuario
async function registerUser() {
  mensajeError.value = '';

  if (!nombre.value || !correo.value || !contrasena.value || !confirmacionContrasena.value) {
    mensajeError.value = 'Todos los campos son obligatorios';
    toast.error(mensajeError.value, { autoClose: 3000 });
    return;
  }

  if (contrasena.value.length < 6) {
    mensajeError.value = 'La contraseña debe tener al menos 6 caracteres';
    toast.error(mensajeError.value, { autoClose: 3000 });
    return;
  }

  if (contrasena.value !== confirmacionContrasena.value) {
    mensajeError.value = 'Las contraseñas no coinciden';
    toast.error(mensajeError.value, { autoClose: 3000 });
    return;
  }

  try {
    // Generar hash SHA-256 en el cliente
    const hashContrasena = await generarHashSHA256(contrasena.value);

    const response = await axios.post('/api/usuario/crear', {
      nombre: nombre.value,
      correo: correo.value,
      contrasena: hashContrasena, // Enviar la contraseña encriptada
    });

    if (response.status === 201 && response.data.usuario) {
      const usuario = {
        id: response.data.usuario.idUsuario,
        nombre: response.data.usuario.nombre,
        fechaCreacion: response.data.usuario.fechaCreacion,
        avatar: response.data.usuario.avatar
      };
      // Guardar el objeto usuario en Local Storage
      localStorage.setItem('usuario', JSON.stringify(usuario));
      toast.success('Registro exitoso. Redirigiendo...', { autoClose: 3000 });
      setTimeout(() => {
        router.push('/juego'); // Redirigir al login tras éxito
      }, 3000);
    } else {
      mensajeError.value = 'No se pudo completar el registro';
      toast.error(mensajeError.value, { autoClose: 3000 });
    }
  } catch (error) {
    mensajeError.value = error.response?.data?.message || 'Error al registrar usuario';
    toast.error(mensajeError.value, { autoClose: 3000 });
  }
}

function togglePasswordVisibility(field) {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'confirm-password') {
    showConfirmPassword.value = !showConfirmPassword.value;
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
      <input id="correo" v-model="correo" type="email" placeholder="Ingresa tu correo" required />

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

      <button type="submit" class="submit-button">REGISTRARSE</button>
    </form>
  </div>
</template>

<style scoped>
/* Contenedor del formulario de registro */
.register-container {
  width: 35%;
  margin: 5rem auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  text-align: left;
  font-family: 'MedievalSharp', cursive;
  backdrop-filter: blur(5px);
}

/* Botón de volver */
.back-button {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 10px;
  color: #ffffff;
}

.back-button:hover {
  color: #f5a623;
}

/* Título del formulario de registro */
.register-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
  letter-spacing: 3px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
}

/* Formulario del registro */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #cfcfcf;
}

/* Etiquetas del formulario de registro */
.register-form label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Campos de texto del formulario de registro */
.register-form input {
  display: block;
  width: 91%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 0.2rem solid #444;
  border-radius: 0.7rem;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.register-form input:focus {
  border-color: #a7a728; /* Color verde cuando el campo está enfocado */
}

/* Botón de submit del formulario de registro */
.submit-button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #500043;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  font-family: 'MedievalSharp', cursive;
}

.submit-button:hover {
  background-color: #790063;
}

/* Contenedor de la contraseña */
.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Estilo del campo de contraseña */
.password-container input {
  width: 86.5%;
  padding-right: 40px; /* Espacio para el botón de visibilidad */
}

/* Botón de toggle para ver la contraseña */
.toggle-password {
  position: absolute;
  right: 2.5rem;
  top: 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

</style>
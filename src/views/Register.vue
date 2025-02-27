<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/styles/Register.css';

const router = useRouter();

// Función para volver a la pantalla principal
function volver() {
  router.push('/');
}

// Función para ir a la pantalla de inicio de sesión
function irALogin() {
  router.push('/login-email');
}

// Control de visibilidad de la contraseña
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function togglePasswordVisibility(field) {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'confirm-password') {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
}

// Función para manejar el registro y redirigir a la pantalla de juego
function handleRegister(event) {
  event.preventDefault(); // Evita que el formulario recargue la página
  router.push('/juego'); // Redirige a la vista "Juego"
}
</script>

<template>
  <div class="register-container">
    <button class="back-button" @click="volver">← Volver</button>
    <h2 class="register-title">Únete a los hombres lobo de Castonegro</h2>
    
    <form class="register-form" @submit.prevent="handleRegister">
      <label for="username">Nombre de usuario</label>
      <input id="username" type="text" placeholder="Ingresa tu nombre de usuario" required />

      <label for="email">Correo electrónico</label>
      <input id="email" type="email" placeholder="Ingresa tu correo" required />

      <label for="password">Contraseña</label>
      <div class="password-container">
        <input 
          id="password" 
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

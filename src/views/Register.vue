<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/styles/Register.css';

const router = useRouter();

function volver() {
  router.push('/');
}

function irALogin() {
  router.push('/login-email');
}

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
</script>

<template>
  <div class="register-container">
    <button class="back-button" @click="volver">← Volver</button>
    <h2 class="register-title">Únete a los hombres lobo de Castonegro</h2>
    
    <form class="register-form">
      <label for="username">Nombre de usuario</label>
      <input id="username" type="text" placeholder="Ingresa tu nombre de usuario" />

      <label for="email">Correo electrónico</label>
      <input id="email" type="email" placeholder="Ingresa tu correo" />

      <label for="password">Contraseña</label>
      <div class="password-container">
        <input 
          id="password" 
          :type="showPassword ? 'text' : 'password'" 
          placeholder="********" 
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
        />
        <button type="button" class="toggle-password" @click="togglePasswordVisibility('confirm-password')">
          {{ showConfirmPassword ? '👁️' : '🙈' }}
        </button>
      </div>

      <button type="submit" class="submit-button">REGISTRARSE</button>
    </form>
  </div>
</template>
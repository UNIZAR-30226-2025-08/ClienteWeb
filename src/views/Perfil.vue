<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import Volver from "../components/Volver.vue";

// Importar imagen por defecto para evitar problemas con la ruta
import defaultAvatar from '../assets/profile_icon.jpg';

// Obtener el usuario desde el localStorage
const usuario = JSON.parse(localStorage.getItem('usuario'));

// Verificar si el usuario está en localStorage
const router = useRouter();
if (!usuario) {
  router.push('/'); // Redirigir al login si no hay usuario en localStorage
}

// Variables reactivas para los datos del usuario
const nombre = ref(usuario?.nombre || 'NombreCuenta');
const avatar = ref(usuario?.avatar || defaultAvatar);
const rolFavorito = ref(usuario?.rolFavorito || 'Sin rol favorito');

// Variable de estado para mensajes de error
const mensajeError = ref('');

// Función para verificar si la URL del avatar es válida
function esUrlValida(url) {
  try {
    const image = new Image();
    image.src = url;
    return image.complete;
  } catch (e) {
    return false;
  }
}

// Manejo de la actualización del perfil
const actualizarPerfil = async () => {
  mensajeError.value = ''; // Limpiar mensaje de error previo

  // Validación simple de campos
  if (!nombre.value || !avatar.value || !rolFavorito.value) {
    mensajeError.value = 'Todos los campos son obligatorios';
    toast.error(mensajeError.value);
    return;
  }

  // Validar si la URL del avatar es válida
  if (!esUrlValida(avatar.value)) {
    mensajeError.value = 'La URL del avatar no es válida';
    toast.error(mensajeError.value);
    return;
  }

  // Si el rol favorito es 'Sin rol favorito', lo enviamos como null
  const rol = rolFavorito.value === 'Sin rol favorito' ? null : rolFavorito.value;

  try {
    // Enviar la solicitud PUT al backend
    const response = await axios.put('/api/usuario/actualizar', {
      idUsuario: usuario.id, // Usamos el ID del usuario almacenado
      nombre: nombre.value,
      avatar: avatar.value,
      rolFavorito: rol,
    });

    // Verificar la respuesta del servidor
    if (response.status === 200 && response.data?.usuario) {
      console.log('Respuesta del servidor:', response.data);

      // Actualizar los datos del usuario en el localStorage con los nuevos valores
      const usuarioActualizado = response.data.usuario;
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

      // Mostrar mensaje de éxito
      toast.success('Perfil actualizado exitosamente', { autoClose: 3000 });

      // Redirigir al usuario a la página de perfil
      router.push('/perfil');
    } else {
      console.error('Error en la respuesta del servidor:', response);
      mensajeError.value = 'Hubo un error al actualizar el perfil';
      toast.error(mensajeError.value, { autoClose: 3000 });
    }
  } catch (error) {
    console.error('Error completo:', error);

    if (error.response && error.response.data && error.response.data.error) {
      mensajeError.value = error.response.data.error;
    } else if (error.request) {
      mensajeError.value = 'Error de solicitud, por favor revisa la conexión.';
    } else {
      mensajeError.value = 'Hubo un problema al actualizar el perfil.';
    }

    toast.error(mensajeError.value, { autoClose: 3000 });
  }
};
</script>

<template>
  <h1 class="cabecera">Perfil</h1>
  
  <!-- Mostrar mensaje de error si existe -->
  <p v-if="mensajeError" class="error">{{ mensajeError }}</p>
  
  <div class="perfil-container">
    <img :src="avatar" alt="Avatar" class="avatar" />

    <!-- Formulario para modificar el perfil -->
    <div class="formulario-modificacion">
      <h2>Actualizar Perfil</h2>
      <form @submit.prevent="actualizarPerfil">
        <div>
          <label for="nombre">Nuevo Nombre:</label>
          <input v-model="nombre" type="text" id="nombre" placeholder="Nuevo nombre" />
        </div>
        <div>
          <label for="avatar">Nueva URL del Avatar:</label>
          <input v-model="avatar" type="text" id="avatar" placeholder="URL del avatar" />
        </div>
        <div>
          <label for="rolFavorito">Nuevo Rol Favorito:</label>
          <select v-model="rolFavorito" id="rolFavorito">
            <option value="Sin rol favorito">Sin rol favorito</option>
            <option value="bruja">Bruja</option>
            <option value="cazador">Cazador</option>
            <option value="vidente">Vidente</option>
            <option value="lobo">Lobo</option>
            <option value="aldeano">Aldeano</option>
          </select>
        </div>
        <button type="submit">Actualizar Perfil</button>
        <Volver />
      </form>
    </div>
  </div>
</template>

<style scoped>
.cabecera {
  margin-top: 3rem;
  padding: 2rem;
  background-color: #1e1c1a;
  padding-left: 5rem;
}

.perfil-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  margin-top: 5rem;
  margin-left: 25rem;
  max-width: 55%;
  background-color: #1e1c1a;
  padding: 3rem;
  padding-left: 5rem;
}

.avatar {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  margin-right: 3rem;
}

.formulario-modificacion {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
}

.formulario-modificacion input,
.formulario-modificacion select,
.formulario-modificacion button {
  margin: 0.5rem 0;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #2e2e2e;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #444;
}

.error {
  color: red;
  font-weight: bold;
}
</style>

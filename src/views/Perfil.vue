<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import Volver from "../components/Volver.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const usuario = JSON.parse(localStorage.getItem("usuario"));
const nombre = ref(usuario.nombre);
const avatar = ref(usuario.avatar);
const rolFavorito = ref(usuario.rolFavorito);

const nuevoNombre = ref("");
const nuevoAvatar = ref("");
const nuevoRol = ref("Sin rol favorito");
const mensajeError = ref("");

const modalAbierto = ref(false);

const irAAmigos = () => {
  router.push("/amigos");
};

const abrirModal = () => {
  modalAbierto.value = true;
};

const cerrarModal = () => {
  modalAbierto.value = false;
};

onMounted(() => {
  nuevoNombre.value = nombre.value;
  nuevoAvatar.value = avatar.value;
  nuevoRol.value = rolFavorito.value || "Sin rol favorito";
});

const actualizarPerfil = async () => {
  mensajeError.value = "";

  if (
    nuevoNombre.value === nombre.value &&
    nuevoAvatar.value === avatar.value &&
    (nuevoRol.value === rolFavorito.value ||
      (rolFavorito.value == null && nuevoRol.value === "Sin rol favorito"))
  ) {
    mensajeError.value = "No has realizado ningún cambio.";
    toast.error(mensajeError.value);
    return;
  }

  const rol = nuevoRol.value === "Sin rol favorito" ? null : nuevoRol.value;

  const datosActualizados = {
    idUsuario: Number(usuario.idUsuario),
    nombre: nuevoNombre.value,
    avatar: nuevoAvatar.value,
    rolFavorito: rol,
  };

  try {
    const response = await axios.put(
      "/api/usuario/actualizar",
      datosActualizados
    );

    if (response.status === 200 && response.data?.usuario) {
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      nombre.value = response.data.usuario.nombre;
      avatar.value = response.data.usuario.avatar;
      rolFavorito.value = response.data.usuario.rolFavorito;

      toast.success("Perfil actualizado exitosamente", { autoClose: 3000 });
      cerrarModal();
    } else {
      mensajeError.value = "Hubo un error al actualizar el perfil";
      toast.error(mensajeError.value, { autoClose: 3000 });
    }
  } catch (error) {
    mensajeError.value =
      error.response?.data?.error ||
      "Hubo un problema al actualizar el perfil.";
    toast.error(mensajeError.value, { autoClose: 3000 });
  }
};
</script>

<template>
  <h1 class="cabecera">Perfil</h1>

  <div class="perfil-container">
    <img :src="avatar" alt="Avatar" class="avatar" />

    <div class="info-perfil">
      <h2>
        Nombre: <span>{{ nombre }}</span>
      </h2>
      <h3>
        Rol Favorito: <span>{{ rolFavorito || "Sin rol favorito" }}</span>
      </h3>
      <button @click="abrirModal">Actualizar Perfil</button>
      <button @click="irAAmigos" class="ver-amigos-btn">Ver mis amigos</button>
    </div>
  </div>

  <!-- Modal de edición -->
  <div v-if="modalAbierto" class="modal-overlay">
    <div class="modal">
      <h2>Editar Perfil</h2>

      <form @submit.prevent="actualizarPerfil">
        <div>
          <label for="nuevoNombre">Nuevo Nombre:</label>
          <input v-model="nuevoNombre" type="text" id="nuevoNombre" required />
        </div>
        <div>
          <label for="nuevoAvatar">Nueva URL del Avatar:</label>
          <input v-model="nuevoAvatar" type="text" id="nuevoAvatar" required />
        </div>
        <div>
          <label for="nuevoRol">Nuevo Rol Favorito:</label>
          <select v-model="nuevoRol" id="nuevoRol" required>
            <option value="bruja">Bruja</option>
            <option value="cazador">Cazador</option>
            <option value="vidente">Vidente</option>
            <option value="lobo">Lobo</option>
            <option value="aldeano">Aldeano</option>
            <option value="Sin rol favorito">Sin rol favorito</option>
          </select>
        </div>

        <div class="modal-buttons">
          <button type="submit">Guardar</button>
          <button type="button" @click="cerrarModal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <Volver />
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
  align-items: center;
  text-align: left;
  margin: 5rem auto;
  max-width: 55%;
  background-color: #1e1c1a;
  padding: 3rem;
  padding-left: 5rem;
  border-radius: 10px;
}

.avatar {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  margin-right: 3rem;
}

.info-perfil {
  display: flex;
  flex-direction: column;
}

.info-perfil h2,
.info-perfil h3 {
  color: white;
}

.info-perfil span {
  font-weight: bold;
}

button {
  margin-top: 1rem;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  background-color: #2e2e2e;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #444;
}
.ver-amigos-btn {
  margin-top: 1rem;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

.ver-amigos-btn:hover {
  background-color: #45a049;
}

/* Estilos del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #222;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  color: white;
  box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.2);
}

.modal label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.modal input,
.modal select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #444;
  background: #333;
  color: white;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  margin-top: 1rem;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #1a73e8;
  color: white;
}

.modal-buttons button:first-child:hover {
  background-color: #1258c4;
}

.modal-buttons button:last-child {
  background-color: red;
  color: white;
}

.modal-buttons button:last-child:hover {
  background-color: darkred;
}
</style>

<template>
  <div class="sugerencias">
    <h2>Enviar Sugerencia</h2>
    <form @submit.prevent="enviarSugerencia">
      <textarea
        v-model="contenido"
        placeholder="Escribe tu sugerencia..."
      ></textarea>
      <button type="submit">Enviar</button>
    </form>
    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Sugerencias",
  data() {
    return {
      contenido: "",
      mensaje: "",
      error: "",
      usuario: null,
    };
  },
  created() {
    // Se obtiene el usuario del localStorage
    const usuarioStorage = localStorage.getItem("usuario");
    if (usuarioStorage) {
      try {
        this.usuario = JSON.parse(usuarioStorage);
      } catch (e) {
        console.error("Error al parsear el usuario del localStorage:", e);
        this.error = "Error al obtener la información del usuario.";
      }
    } else {
      this.error = "No se encontró información del usuario en el localStorage.";
    }
  },
  methods: {
    async enviarSugerencia() {
      // Validación básica
      if (!this.contenido.trim()) {
        this.error = "La sugerencia no puede estar vacía.";
        return;
      }
      // Cambiado para usar usuario.idUsuario
      if (!this.usuario || !this.usuario.idUsuario) {
        this.error = "No se pudo obtener el ID del usuario.";
        return;
      }

      try {
        const { data } = await axios.post("/api/sugerencias/enviar", {
          idUsuario: this.usuario.idUsuario, // Usar idUsuario en lugar de id
          contenido: this.contenido,
        });
        this.mensaje = data.mensaje;
        this.contenido = "";
        this.error = "";
      } catch (err) {
        this.error =
          (err.response && err.response.data.error) ||
          "Error al enviar la sugerencia.";
        this.mensaje = "";
      }
    },
  },
};
</script>

<style scoped>
.sugerencias {
  max-width: 600px;
  margin: 20px auto;
  padding: 10px;
}
textarea {
  width: 100%;
  height: 100px;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 1rem;
  resize: vertical;
}
button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 1rem;
}
.mensaje {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>

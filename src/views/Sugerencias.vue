<template>
  <div class="sugerencias-container">
    <Cabecera :titulo="'Sugerencias'" :compacto="false" />
    <div class="card">
      <h2 class="card-title">Enviar Sugerencia</h2>
      <form @submit.prevent="enviarSugerencia">
        <textarea
          v-model="contenido"
          placeholder="Escribe tu sugerencia..."
          class="sugerencia-input"
        ></textarea>
        <button type="submit" class="btn-submit">Enviar</button>
      </form>
      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
  <Volver />
</template>

<script>
import axios from "axios";
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";

export default {
  name: "Sugerencias",
  components: {
    Cabecera,
    Volver,
  },
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
      // Usar usuario.idUsuario
      if (!this.usuario || !this.usuario.idUsuario) {
        this.error = "No se pudo obtener el ID del usuario.";
        return;
      }
      try {
        const { data } = await axios.post("/api/sugerencias/enviar", {
          idUsuario: this.usuario.idUsuario,
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
/* Contenedor general con fondo oscuro */
.sugerencias-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #121212;
  padding: 20px;
}

/* Tarjeta para el formulario con fondo oscuro */
.card {
  background-color: #1e1c1a;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  padding: 30px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-bottom: 20px;
}

/* Título de la tarjeta */
.card-title {
  margin-bottom: 20px;
  color: #f0f0f0;
}

/* Área de texto */
.sugerencia-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #333;
  border-radius: 6px;
  resize: vertical;
  background-color: #2c2c2c;
  color: #f0f0f0;
  transition: border-color 0.3s ease;
}

.sugerencia-input:focus {
  outline: none;
  border-color: #007bff;
}

/* Botón de envío */
.btn-submit {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}

/* Mensajes de respuesta */
.mensaje {
  color: #4caf50;
  margin-top: 15px;
  font-weight: bold;
}

.error {
  color: #f44336;
  margin-top: 15px;
  font-weight: bold;
}
</style>

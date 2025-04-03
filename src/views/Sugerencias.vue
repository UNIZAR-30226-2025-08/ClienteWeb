<script>
import axios from "axios";
import { toast } from "vue3-toastify";
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
      usuario: null,
      mostrarMisSugerencias: false,
      misSugerencias: [],
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
        toast.error("Error al obtener la información del usuario.", {
          autoClose: 3000,
        });
      }
    } else {
      toast.error(
        "No se encontró información del usuario en el localStorage.",
        {
          autoClose: 3000,
        }
      );
    }
  },
  methods: {
    async enviarSugerencia() {
      // Validación básica
      if (!this.contenido.trim()) {
        toast.error("La sugerencia no puede estar vacía.", { autoClose: 3000 });
        return;
      }
      // Usar usuario.id (asegúrate de que el objeto usuario tenga esta propiedad)
      if (!this.usuario || !this.usuario.id) {
        toast.error("No se pudo obtener el ID del usuario.", {
          autoClose: 3000,
        });
        return;
      }
      try {
        const { data } = await axios.post("/api/sugerencias/enviar", {
          idUsuario: this.usuario.id,
          contenido: this.contenido,
        });
        toast.success(data.mensaje, { autoClose: 3000 });
        this.contenido = "";
      } catch (err) {
        toast.error(
          (err.response && err.response.data.error) ||
            "Error al enviar la sugerencia.",
          { autoClose: 3000 }
        );
      }
    },
    async obtenerMisSugerencias() {
      if (!this.usuario || !this.usuario.id) {
        toast.error("No se pudo obtener el ID del usuario.", {
          autoClose: 3000,
        });
        return;
      }
      try {
        const { data } = await axios.post("/api/sugerencias/usuario", {
          idUsuario: this.usuario.id,
        });
        this.misSugerencias = data.sugerencias;
      } catch (err) {
        toast.error(
          (err.response && err.response.data.error) ||
            "Error al obtener tus sugerencias.",
          { autoClose: 3000 }
        );
      }
    },
    toggleMisSugerencias() {
      this.mostrarMisSugerencias = !this.mostrarMisSugerencias;
      if (this.mostrarMisSugerencias) {
        this.obtenerMisSugerencias();
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
  },
};
</script>

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
    </div>

    <!-- Botón para desplegar u ocultar las sugerencias enviadas por el usuario -->
    <button class="btn-toggle" @click="toggleMisSugerencias">
      {{
        mostrarMisSugerencias
          ? "Ocultar mis sugerencias"
          : "Ver mis sugerencias"
      }}
    </button>

    <!-- Sección desplegable con las sugerencias del usuario -->
    <div v-if="mostrarMisSugerencias" class="sugerencias-dropdown">
      <h3>Mis Sugerencias</h3>
      <ul>
        <li v-for="sugerencia in misSugerencias" :key="sugerencia.idSugerencia">
          <p><strong>Sugerencia:</strong> {{ sugerencia.contenido }}</p>
          <p>
            <strong>Fecha:</strong> {{ formatDate(sugerencia.fechaSugerencia) }}
          </p>
          <p>
            <strong>Estado:</strong>
            {{ sugerencia.revisada ? "Cerrada" : "Abierta" }}
          </p>
        </li>
      </ul>
      <p v-if="misSugerencias.length === 0" class="mensaje">
        No has enviado sugerencias.
      </p>
    </div>
  </div>
  <Volver />
</template>

<style scoped>
/* Contenedor principal con fondo oscuro */
.sugerencias-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #121212;
  padding: 0px;
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
  margin-top: 20px;
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
  margin-top: 10px;
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
  margin-top: 25px;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}

/* Botón para desplegar/ocultar mis sugerencias */
.btn-toggle {
  background-color: #0056b3;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 40px;
  transition: background-color 0.3s ease;
  margin-top: 15px;
}

.btn-toggle:hover {
  background-color: #003f7f;
}

/* Desplegable de sugerencias del usuario */
.sugerencias-dropdown {
  background-color: #1e1c1a;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  color: #f0f0f0;
}

.sugerencias-dropdown h3 {
  margin-bottom: 15px;
  text-align: center;
}

.sugerencias-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sugerencias-dropdown li {
  border-bottom: 1px solid #333;
  padding: 10px 0;
}

.sugerencias-dropdown li:last-child {
  border-bottom: none;
}
</style>

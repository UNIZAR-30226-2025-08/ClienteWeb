<template>
  <Cabecera class="medieval-font" :titulo="'Sugerencias'" :compacto="false" />
  <div class="sugerencias-page sugerencias-container">
    <!-- Contenedor que centra el formulario en el medio de la pantalla -->
    <div class="enviar-sugerencia-wrapper">
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
    </div>

    <!-- Botón para mostrar/ocultar las sugerencias -->
    <button class="btn-toggle" @click="toggleMisSugerencias">
      {{
        mostrarMisSugerencias
          ? "Ocultar mis sugerencias"
          : "Ver mis sugerencias"
      }}
    </button>

    <!-- Sección con dos columnas: Pendientes (abiertas) y Revisadas (cerradas) -->
    <div v-if="mostrarMisSugerencias" class="columnas-contenedor">
      <div class="columna">
        <h3 class="titulo-columna">
          Pendientes ({{ sugerenciasAbiertas.length }})
        </h3>
        <div class="lista-sugerencias">
          <div
            v-for="sugerencia in sugerenciasAbiertas"
            :key="sugerencia.idSugerencia"
            class="sugerencia-item"
          >
            <div class="sugerencia-header">
              <span class="fecha">{{
                formatDate(sugerencia.fechaSugerencia)
              }}</span>
              <span class="estado abierta">Pendiente</span>
            </div>
            <div class="contenido">{{ sugerencia.contenido }}</div>
          </div>
        </div>
      </div>
      <div class="columna">
        <h3 class="titulo-columna">
          Revisadas ({{ sugerenciasCerradas.length }})
        </h3>
        <div class="lista-sugerencias">
          <div
            v-for="sugerencia in sugerenciasCerradas"
            :key="sugerencia.idSugerencia"
            class="sugerencia-item"
          >
            <div class="sugerencia-header">
              <span class="fecha">{{
                formatDate(sugerencia.fechaSugerencia)
              }}</span>
              <span class="estado cerrada">Revisada</span>
            </div>
            <div class="contenido">{{ sugerencia.contenido }}</div>
            <div v-if="sugerencia.respuesta" class="respuesta">
              <strong>Respuesta:</strong> {{ sugerencia.respuesta }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- El componente Volver se posiciona fijo al fondo -->
  <Volver />
</template>

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
        { autoClose: 3000 }
      );
    }
  },
  computed: {
    sugerenciasAbiertas() {
      return this.misSugerencias.filter((sug) => !sug.revisada);
    },
    sugerenciasCerradas() {
      return this.misSugerencias.filter((sug) => sug.revisada);
    },
  },
  methods: {
    async enviarSugerencia() {
      if (!this.contenido.trim()) {
        toast.error("La sugerencia no puede estar vacía.", { autoClose: 3000 });
        return;
      }
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
        // Actualiza la lista de sugerencias si ya está abierta
        if (this.mostrarMisSugerencias) {
          this.obtenerMisSugerencias();
        }
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

<style scoped>
.sugerencias-page {
  font-family: "MedievalSharp", cursive !important;
}

.sugerencias-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(145deg, #1e1c1a, #141414);
  color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Wrapper para centrar el formulario sin dejar gran espacio vertical */
.enviar-sugerencia-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

/* Tarjeta de envío con degradado sutil y efecto hover */
.card {
  background: linear-gradient(135deg, #1e1c1a, #141414);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  padding: 30px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-3px);
}

.card-title {
  margin-bottom: 20px;
  font-size: 1.8em;
  letter-spacing: 0.5px;
}

/* Estilos del textarea */
.sugerencia-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2c2c2c;
  color: #fff;
  resize: vertical;
  margin-top: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.sugerencia-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
}

/* Botones con efecto hover y degradado */
.btn-submit,
.btn-toggle {
  transition: background 0.3s, transform 0.3s;
  border-radius: 6px;
}

.btn-submit {
  background: linear-gradient(45deg, #2196f3, #1976d2);
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 25px;
}

.btn-submit:hover {
  transform: scale(1.03);
}

.btn-toggle {
  background: linear-gradient(45deg, #ff9800, #f57c00);
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px auto 20px;
  display: block;
}

.btn-toggle:hover {
  transform: scale(1.03);
}

/* Contenedor para las columnas */
.columnas-contenedor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
  width: 100%;
}

/* Cada columna */
.columna {
  background: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s;
}

.columna:hover {
  transform: translateY(-2px);
}

.titulo-columna {
  font-size: 1.4em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #444;
  text-align: center;
}

/* Lista de sugerencias con scroll vertical */
.lista-sugerencias {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 300px);
  overflow-y: auto;
  padding-right: 10px;
}

/* Cada sugerencia */
.sugerencia-item {
  background: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
}

.sugerencia-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

/* Cabecera de cada sugerencia */
.sugerencia-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9em;
}

.estado {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.estado.abierta {
  background: #4caf50;
  color: #fff;
}

.estado.cerrada {
  background: #f44336;
  color: #fff;
}

.contenido {
  margin-bottom: 15px;
  line-height: 1.5;
}

.respuesta {
  padding: 10px;
  background: #2d2d2d;
  border-radius: 6px;
  margin-top: 10px;
}

/* Responsive: en móviles se muestra una sola columna */
@media (max-width: 768px) {
  .columnas-contenedor {
    grid-template-columns: 1fr;
  }
  .lista-sugerencias {
    height: auto;
    max-height: 400px;
  }
}
</style>

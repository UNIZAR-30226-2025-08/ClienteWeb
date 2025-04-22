<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";

export default {
  name: "SugerenciasAdmin",
  components: {
    Cabecera,
    Volver,
  },
  data() {
    return {
      sugerencias: [],
      respuesta: {},
    };
  },
  computed: {
    sugerenciasAbiertas() {
      return this.sugerencias.filter((sug) => !sug.revisada);
    },
    sugerenciasCerradas() {
      return this.sugerencias.filter((sug) => sug.revisada);
    },
  },
  async created() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) {
      // Si no existe el usuario, redirige a "/juego"
      this.$router.push("/juego");
      return;
    }

    try {
      // Verificamos si el usuario es administrador consultando el backend
      const { data } = await axios.post("/api/admin/esAdministrador", {
        idUsuario: usuario.id,
      });
      if (!data.esAdministrador) {
        // Si no es admin, redirige a "/juego"
        this.$router.push("/juego");
        return;
      }
    } catch (error) {
      // En caso de error, podrías redirigir o mostrar un mensaje de error
      this.$router.push("/juego");
      return;
    }

    // Si llega hasta aquí, el usuario es admin y se cargan las sugerencias
    await this.obtenerTodasSugerencias();
  },
  methods: {
    async obtenerTodasSugerencias() {
      try {
        const { data } = await axios.get("/api/sugerencias/todas");
        this.sugerencias = data.sugerencias.map((s) => ({
          ...s,
          revisada: s.revisada || false,
        }));
      } catch (err) {
        toast.error(
          err.response?.data.error || "Error al obtener sugerencias",
          { autoClose: 3000 }
        );
      }
    },

    async responderSugerencia(idSugerencia) {
      try {
        await axios.put("/api/sugerencias/responder", {
          idSugerencia,
          respuesta: this.respuesta[idSugerencia],
        });
        toast.success("Respuesta enviada y sugerencia cerrada", {
          autoClose: 3000,
        });
        await this.obtenerTodasSugerencias();
      } catch (err) {
        toast.error(
          err.response?.data.error || "Error al responder sugerencia",
          { autoClose: 3000 }
        );
      }
    },

    async marcarCerrada(idSugerencia, cerrar = true) {
      try {
        await axios.put("/api/sugerencias/marcarRevisada", {
          idSugerencia,
          revisada: cerrar,
        });
        toast.success(cerrar ? "Sugerencia revisada" : "Sugerencia reabierta", {
          autoClose: 3000,
        });
        await this.obtenerTodasSugerencias();
      } catch (err) {
        toast.error(err.response?.data.error || "Error al actualizar estado", {
          autoClose: 3000,
        });
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
  },
};
</script>

<template>
  <Cabecera titulo="Panel de Sugerencias" />
  <div class="admin-container">
    <div class="columnas-contenedor">
      <div class="columna">
        <h2 class="titulo-columna">
          Pendientes ({{ sugerenciasAbiertas.length }})
        </h2>
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

            <div class="contenido">
              {{ sugerencia.contenido }}
            </div>

            <div v-if="sugerencia.respuesta" class="respuesta">
              <strong>Respuesta:</strong> {{ sugerencia.respuesta }}
            </div>

            <div class="acciones">
              <div class="campo-respuesta">
                <label for="respuesta">Respuesta:</label>
                <textarea
                  v-model="respuesta[sugerencia.idSugerencia]"
                  placeholder="Escribe tu respuesta..."
                  class="respuesta-input"
                  id="respuesta"
                ></textarea>
              </div>
              <div class="botones-accion">
                <button
                  @click="responderSugerencia(sugerencia.idSugerencia)"
                  class="btn-responder"
                >
                  Responder y marcar como Revisada
                </button>
                <button
                  @click="marcarCerrada(sugerencia.idSugerencia)"
                  class="btn-cerrar"
                >
                  Marcar como Revisada sin respuesta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columna">
        <h2 class="titulo-columna">
          Revisadas ({{ sugerenciasCerradas.length }})
        </h2>
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

            <div class="contenido">
              {{ sugerencia.contenido }}
            </div>

            <div v-if="sugerencia.respuesta" class="respuesta">
              <div class="respuesta-header">
                <strong>Respuesta:</strong>
              </div>
              <div class="respuesta-contenido">
                {{ sugerencia.respuesta }}
              </div>
            </div>
            <div v-else class="respuesta">
              <div class="respuesta-header">
                <strong>Sin respuesta</strong>
              </div>
            </div>

            <div class="acciones-cerradas">
              <button
                @click="marcarCerrada(sugerencia.idSugerencia, false)"
                class="btn-reabrir"
              >
                Reabrir Sugerencia como Pendiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Volver />
</template>

<style scoped>
.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
}

.columnas-contenedor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.titulo-columna {
  color: #fff;
  font-size: 1.4em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #444;
}

.columna {
  background: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.lista-sugerencias {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 220px);
  overflow-y: auto;
  padding-right: 10px;
}

.sugerencia-item {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

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
  padding: 15px;
  background: #2d2d2d;
  border-radius: 8px;
  margin-top: 15px;
  border-left: 4px solid #2196f3;
}

.respuesta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #444;
}

.respuesta-contenido {
  line-height: 1.5;
  color: #e0e0e0;
}

.respuesta-input {
  width: 100%;
  height: 100px;
  padding: 12px;
  margin-top: 5px;
  background: #2c2c2c;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 1em;
  line-height: 1.5;
  resize: vertical;
}

.respuesta-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.botones-accion {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-responder {
  background: #2196f3;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-responder:hover {
  background: #1976d2;
}

.btn-cerrar {
  background: #ff9800;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cerrar:hover {
  background: #f57c00;
}

.btn-reabrir {
  background: #4caf50;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
}

.btn-reabrir:hover {
  background: #388e3c;
}

.acciones-cerradas {
  margin-top: 15px;
}

.campo-respuesta {
  margin-top: 15px;
}

.campo-respuesta label {
  display: block;
  margin-bottom: 5px;
  color: #fff;
  font-weight: bold;
}

@media (max-width: 768px) {
  .columnas-contenedor {
    grid-template-columns: 1fr;
  }

  .columna {
    padding: 15px;
  }

  .lista-sugerencias {
    height: auto;
    max-height: 400px;
  }
}
</style>

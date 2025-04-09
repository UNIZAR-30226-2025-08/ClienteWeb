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
        toast.success(cerrar ? "Sugerencia cerrada" : "Sugerencia reabierta", {
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
          Abiertas ({{ sugerenciasAbiertas.length }})
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
              <span class="estado abierta">Abierta</span>
            </div>

            <div class="contenido">
              {{ sugerencia.contenido }}
            </div>

            <div v-if="sugerencia.respuesta" class="respuesta">
              <strong>Respuesta:</strong> {{ sugerencia.respuesta }}
            </div>

            <div class="acciones">
              <textarea
                v-model="respuesta[sugerencia.idSugerencia]"
                placeholder="Escribe tu respuesta..."
                class="respuesta-input"
              ></textarea>
              <div class="botones-accion">
                <button
                  @click="responderSugerencia(sugerencia.idSugerencia)"
                  class="btn-responder"
                >
                  Responder y Cerrar
                </button>
                <button
                  @click="marcarCerrada(sugerencia.idSugerencia)"
                  class="btn-cerrar"
                >
                  Cerrar sin respuesta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columna">
        <h2 class="titulo-columna">
          Cerradas ({{ sugerenciasCerradas.length }})
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
              <span class="estado cerrada">Cerrada</span>
            </div>

            <div class="contenido">
              {{ sugerencia.contenido }}
            </div>

            <div v-if="sugerencia.respuesta" class="respuesta">
              <strong>Respuesta:</strong> {{ sugerencia.respuesta }}
            </div>

            <div class="acciones-cerradas">
              <button
                @click="marcarCerrada(sugerencia.idSugerencia, false)"
                class="btn-reabrir"
              >
                Reabrir Sugerencia
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
  padding: 10px;
  background: #2d2d2d;
  border-radius: 6px;
  margin-top: 10px;
}

.respuesta-input {
  width: 100%;
  height: 80px;
  padding: 10px;
  margin-top: 10px;
  background: #2c2c2c;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
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

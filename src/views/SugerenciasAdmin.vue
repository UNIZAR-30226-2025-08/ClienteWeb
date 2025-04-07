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
      filtroEstado: "todas",
      respuesta: {},
    };
  },
  computed: {
    sugerenciasFiltradas() {
      return this.sugerencias.filter((sug) => {
        if (this.filtroEstado === "abiertas") return !sug.revisada;
        if (this.filtroEstado === "cerradas") return sug.revisada;
        return true;
      });
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
  <div class="admin-container">
    <Cabecera titulo="Panel de Sugerencias" />

    <div class="filtros">
      <select v-model="filtroEstado" class="select-filtro">
        <option value="todas">Todas las sugerencias</option>
        <option value="abiertas">Abiertas</option>
        <option value="cerradas">Cerradas</option>
      </select>
    </div>

    <div class="lista-sugerencias">
      <div
        v-for="sugerencia in sugerenciasFiltradas"
        :key="sugerencia.idSugerencia"
        class="sugerencia-item"
      >
        <div class="sugerencia-header">
          <span class="fecha">{{
            formatDate(sugerencia.fechaSugerencia)
          }}</span>
          <span
            :class="['estado', sugerencia.revisada ? 'cerrada' : 'abierta']"
          >
            {{ sugerencia.revisada ? "Cerrada" : "Abierta" }}
          </span>
        </div>

        <div class="contenido">
          {{ sugerencia.contenido }}
        </div>

        <div v-if="sugerencia.respuesta" class="respuesta">
          <strong>Respuesta:</strong> {{ sugerencia.respuesta }}
        </div>

        <div v-if="!sugerencia.revisada" class="acciones">
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

        <div v-else class="acciones-cerradas">
          <button
            @click="marcarCerrada(sugerencia.idSugerencia, false)"
            class="btn-reabrir"
          >
            Reabrir Sugerencia
          </button>
        </div>
      </div>
    </div>

    <Volver />
  </div>
</template>

<style scoped>
.admin-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
}

.filtros {
  margin: 20px 0;
}

.select-filtro {
  padding: 8px 12px;
  border-radius: 6px;
  background: #2c2c2c;
  color: #fff;
  border: 1px solid #444;
}

.lista-sugerencias {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
}

.btn-cerrar {
  background: #ff9800;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.btn-reabrir {
  background: #4caf50;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
}

.acciones-cerradas {
  margin-top: 15px;
}
</style>

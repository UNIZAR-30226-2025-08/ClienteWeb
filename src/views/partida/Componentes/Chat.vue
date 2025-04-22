<template>
  <div class="chat-container">
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span
          class="username"
          :style="{ color: getUsernameColor(message.username) }"
          >{{ message.username }}:</span
        >
        <span class="content">{{ message.content }}</span>
      </div>
    </div>
    <!-- sólo mostramos el input si no estamos en modo espectador -->
    <div class="chat-input" v-if="!disabled">
      <div class="input-wrapper">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Escribe un mensaje..."
        />
      </div>
      <button @click="sendMessage" class="send-button">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  props: {
    messages: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newMessage: "", // Definir 'newMessage' aquí
      usernameColors: {},
      colorPalette: [
        "#FF6B6B", // Rojo
        "#4ECDC4", // Turquesa
        "#45B7D1", // Azul claro
        "#96CEB4", // Verde menta
        "#FFEEAD", // Amarillo claro
        "#D4A5A5", // Rosa
        "#9B59B6", // Púrpura
        "#3498DB", // Azul
        "#E67E22", // Naranja
        "#2ECC71", // Verde
        "#F1C40F", // Amarillo
        "#E74C3C", // Rojo oscuro
        "#1ABC9C", // Verde esmeralda
        "#34495E", // Azul oscuro
        "#F39C12", // Naranja oscuro
      ],
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        const user = JSON.parse(localStorage.getItem("usuario"));
        this.$emit("new-message", {
          username: user.username,
          content: this.newMessage,
        });
        this.newMessage = "";
      }
    },
    getUsernameColor(username) {
      if (!this.usernameColors[username]) {
        // Generar un índice basado en el nombre y la longitud del nombre
        const hash = username.split("").reduce((acc, char, index) => {
          return acc + char.charCodeAt(0) * (index + 1);
        }, 0);

        // Usar el hash para seleccionar un color de la paleta
        const colorIndex = hash % this.colorPalette.length;
        this.usernameColors[username] = this.colorPalette[colorIndex];
      }
      return this.usernameColors[username];
    },
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.chat-container {
  background-color: #262522;
  width: 18vw;
  height: 80vh;
  border-radius: 1vw;
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 1vw;
  bottom: 2vh;
}

.chat-messages {
  flex: 1;
  padding: 1.5vh 1.5vw;
  overflow-y: auto;
  color: white;
  margin-bottom: 0;
}

.message {
  margin-bottom: 1.5vh;
  word-break: break-word;
}

.username {
  font-weight: bold;
  margin-right: 0.5vw;
}

.content {
  color: #ffffff;
}

.chat-input {
  padding: 1vh;
  background-color: #262522;
  border-top: 1px solid #3a3a3a;
  display: flex;
  gap: 0.5vw;
  align-items: center;
  min-width: 0;
}

.input-wrapper {
  flex: 1;
  background-color: #3a3a3a;
  border-radius: 0.5vw;
  padding: 0.5vh;
  min-width: 0;
  overflow: hidden;
}

input {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  padding: 0.8vh;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

input:focus {
  outline: none;
}

input::placeholder {
  color: #999;
}

.send-button {
  background-color: #a2d060;
  color: #262522;
  border: none;
  padding: 0.8vh 1.2vw;
  border-radius: 0.4vw;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 0.9em;
  min-width: fit-content;
}

.send-button:hover {
  background-color: #8fb850;
  transform: scale(1.02);
}

/* Estilos para la barra de desplazamiento */
.chat-messages::-webkit-scrollbar {
  width: 0.5vw;
}

.chat-messages::-webkit-scrollbar-track {
  background: #3a3a3a;
  border-radius: 0.25vw;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #a2d060;
  border-radius: 0.25vw;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #8fb850;
}
</style>

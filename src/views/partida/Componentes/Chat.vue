<template>
  <div class="chat-container">
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span class="username">{{ message.username }}:</span>
        <span class="content">{{ message.content }}</span>
      </div>
    </div>
    <!-- sólo mostramos el input si no estamos en modo espectador -->
    <div class="chat-input" v-if="!disabled">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Escribe un mensaje..."
      />
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
  width: 18vw; /* Aproximadamente 350px para 1920px de ancho */
  height: 80vh;
  border-radius: 1vw; /* Aproximadamente 10px */
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 1vw; /* Aproximadamente 20px para 1920px */
  bottom: 2vh; /* Aproximadamente 20px para 1080px */
}

.chat-messages {
  flex: 1;
  padding: 1.5vh 1.5vw;
  overflow-y: auto;
  color: white;
}

.message {
  margin-bottom: 1.5vh;
  word-break: break-word;
}

.username {
  color: #a2d060;
  margin-right: 0.5vw;
  font-weight: bold;
}

.content {
  color: #ffffff;
}

.chat-input {
  display: flex;
  padding: 1.5vh 1.5vw;
  border-top: 0.2vh solid #3a3a3a;
}

input {
  flex: 1;
  padding: 1vh 1vw;
  border: none;
  border-radius: 0.5vw;
  margin-right: 1vw;
  background: #3a3a3a;
  color: white;
}

.send-button {
  background-color: #a2d060;
  color: #262522;
  border: none;
  padding: 1vh 2vw;
  border-radius: 0.5vw;
  cursor: pointer;
  font-weight: bold;
}

.send-button:hover {
  background-color: #8fb850;
}
</style>

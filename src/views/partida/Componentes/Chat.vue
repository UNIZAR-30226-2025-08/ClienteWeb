<template>
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <span class="username">{{ message.username }}:</span>
          <span class="content">{{ message.content }}</span>
        </div>
      </div>
      <div class="chat-input">
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
    name: 'Chat',
    props: {
      messages: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        newMessage: ''
      }
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim()) {
          const user = JSON.parse(localStorage.getItem('usuario'))
          this.$emit('new-message', {
            username: user.username,
            content: this.newMessage
          })
          this.newMessage = ''
        }
      }
    },
    watch: {
      messages() {
        this.$nextTick(() => {
          const container = this.$refs.messagesContainer
          container.scrollTop = container.scrollHeight
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .chat-container {
    background-color: #262522;
    width: 350px;
    height: 80vh;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
  
  .chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    color: white;
  }
  
  .message {
    margin-bottom: 10px;
    word-break: break-word;
  }
  
  .username {
    color: #A2D060;
    margin-right: 8px;
    font-weight: bold;
  }
  
  .content {
    color: #ffffff;
  }
  
  .chat-input {
    display: flex;
    padding: 15px;
    border-top: 1px solid #3a3a3a;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
    background: #3a3a3a;
    color: white;
  }
  
  .send-button {
    background-color: #A2D060;
    color: #262522;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .send-button:hover {
    background-color: #8fb850;
  }
  </style>
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // Importamos Vue Router

const app = createApp(App);
app.use(router); // Usamos el router en la app
app.mount('#app');

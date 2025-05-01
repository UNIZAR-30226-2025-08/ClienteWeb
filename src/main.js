import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router"; // Importamos Vue Router
import axios from "axios"; // Para comunicarnos con el backend

// Configuramos la URL base para Axios
axios.defaults.baseURL = "https://albertofsg.ddns.net:5000"; // URL correspondiente al puerto del backend

// Podemos configurar un timeout (opcional) para evitar que las solicitudes se queden colgadas
axios.defaults.timeout = 5000; // 5 segundos de timeout

const app = createApp(App);
app.use(router); // Usamos el router en la app
app.mount("#app");

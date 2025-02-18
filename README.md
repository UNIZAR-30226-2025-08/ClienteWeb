# ClienteWeb

Este proyecto es una aplicación web creada con **Vue 3** y **Vite**.

## Requisitos previos

Antes de empezar, asegúrate de tener instalados los siguientes requisitos:

1. **Node.js**: Si no lo tienes instalado, descárgalo e instálalo desde [Node.js](https://nodejs.org/). Se recomienda la versión LTS.

   Para verificar si tienes Node.js instalado, ejecuta el siguiente comando en tu terminal o línea de comandos:

   ```bash
   node -v
   ```

   Si Node.js está instalado, debería mostrar la versión.

2. **Git**: Asegúrate de tener **Git** instalado para poder clonar el repositorio. Puedes descargarlo desde [Git](https://git-scm.com/).

   Para verificar si tienes Git instalado, ejecuta el siguiente comando en la terminal:

   ```bash
   git --version
   ```

   Si Git está instalado, debería mostrar la versión.

## Instalación

Sigue estos pasos para clonar el proyecto y configurarlo en tu máquina local.

1. **Clonar el repositorio:**

   En la terminal o línea de comandos, navega al directorio donde deseas clonar el proyecto y ejecuta:

   ```bash
   git clone https://github.com/UNIZAR-30226-2025-08/ClienteWeb.git
   ```

   Esto descargará el repositorio completo en una carpeta llamada `ClienteWeb`.

2. **Navegar al directorio del proyecto:**

   Cambia al directorio donde se descargó el proyecto:

   ```bash
   cd ClienteWeb
   ```

3. **Instalar las dependencias:**

   Ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

   ```bash
   npm install
   ```

   Este comando descargará las bibliotecas necesarias para el funcionamiento del proyecto.

   **Nota:** Si no tienes `npm` (Node Package Manager), es probable que Node.js no esté instalado correctamente. Asegúrate de seguir el paso de instalación de Node.js antes de continuar.

## Ejecución en modo desarrollo

Después de instalar las dependencias, puedes ejecutar el proyecto localmente con el siguiente comando:

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo, y podrás acceder a la aplicación en tu navegador en la siguiente URL:

```
http://localhost:5173
```

Cada vez que realices cambios en el código, el navegador se actualizará automáticamente gracias a la funcionalidad de "hot reload" que ofrece Vite.

## Construcción para producción

Si deseas generar una versión lista para producción, puedes ejecutar el siguiente comando:

```bash
npm run build
```

Este comando creará una carpeta `dist` con todos los archivos optimizados para producción.

## Solución de problemas

1. **Node.js no está instalado o no se reconoce el comando `npm`**:

   - Asegúrate de que Node.js esté correctamente instalado.
   - Si acabas de instalar Node.js, reinicia tu terminal o línea de comandos para que los cambios surtan efecto.

2. **Errores de dependencias**:

   - Intenta ejecutar `npm install` nuevamente para asegurarte de que todas las dependencias estén correctamente instaladas.
   - Si sigue habiendo problemas, prueba eliminando la carpeta `node_modules` y ejecutando `npm install` otra vez.

3. **Servidor no se inicia o problemas con `http://localhost:3000`**:

   - Asegúrate de que no haya otro servicio corriendo en el puerto 3000. Si es necesario, detén otros servidores o cambia el puerto en la configuración de Vite.
   - Revisa si el firewall o el antivirus está bloqueando la ejecución de Node.js o el puerto en uso.

## Recursos adicionales

- [Documentación de Vue 3](https://v3.vuejs.org/)
- [Documentación de Vite](https://vitejs.dev/)
- [Guía sobre cómo clonar repositorios con Git](https://docs.github.com/es/repositories/creating-and-managing-repositories/cloning-a-repository)

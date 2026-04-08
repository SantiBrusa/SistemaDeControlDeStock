# 📦 Sistema de Control de Stock + IA (Gemini)

Este es un sistema avanzado de gestión de inventario desarrollado con el **Stack MEN** (MongoDB, Express, Node.js). La aplicación no solo gestiona el stock tradicional, sino que integra la **API de Gemini** para automatizar la carga de productos mediante el procesamiento de imágenes.

---

## 🚀 Funcionalidades Destacadas

* **IA Product Scanner:** Carga automática de productos procesando imágenes con la API de Gemini para extraer nombres, precios y marcas.
* **Gestión de Inventario:** CRUD completo de productos con control de stock mínimo y alertas.
* **Notificaciones:** Sistema de avisos dinámicos para productos con bajo stock.
* **Sesiones Seguras:** Manejo de sesiones de usuario con `connect-mongo` para persistencia en la base de datos.
* **Interfaz Adaptativa:** Diseño optimizado para resoluciones de **1366x768** y dispositivos móviles.

---

## 🛠️ Tecnologías

* **Motor de IA:** [Google Gemini API](https://ai.google.dev/) (Generative AI)
* **Backend:** Node.js & Express
* **Base de Datos:** MongoDB (Mongoose ODM)
* **Vistas:** Handlebars (HBS) con layouts dinámicos
* **Almacenamiento de Sesión:** Connect-Mongo
* **Procesamiento de Archivos:** Multer (para carga de imágenes)

---

## 📋 Configuración del Entorno (`.env`)

Para que el sistema funcione correctamente (especialmente la parte de IA), debes crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=8080
MONGODB_URI=tu_cadena_de_conexion_mongodb
GEMINI_API_KEY=tu_clave_de_api_de_google_gemini
SESSION_SECRET=tu_secreto_para_sesiones

Nota: La GEMINI_API_KEY es fundamental para que el módulo de importación procese las fotos de los productos.

---

⚙️ Instalación
1. Clona el proyecto:

  git clone [https://github.com/SantiBrusa/SistemaDeControlDeStock.git](https://github.com/SantiBrusa/SistemaDeControlDeStock.git)
  cd SistemaDeControlDeStock

2. Instala las dependencias:

  npm install

3. Ejecución:

  # Desarrollo
  npm run dev
  
  # Producción
  npm start

📂 Estructura Clave del Proyecto
/src/app.js: Configuración principal, middlewares y conexión a DB.

/src/routes/importar.js: Lógica de integración con la Gemini API y procesamiento de imágenes.

/src/models/: Definición de esquemas para Productos, Marcas y Usuarios.

/src/public/: Estilos CSS y scripts de cliente (Toastify, validaciones, etc.).

☁️ Despliegue
Este proyecto está preparado para ser desplegado en Railway. Asegúrate de configurar las variables de entorno en el panel de control de Railway para que la conexión a la base de datos y la API de Google funcionen correctamente.

👤 Autor
Santino Vissani Brusadin - santinovissanibrusadin@gmail.com

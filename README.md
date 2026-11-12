# Miniaplicación Web – Consumo de API REST

## Descripción
Aplicación web desarrollada con **HTML5, CSS3 y JavaScript ES6+** que consume una API pública para mostrar información de países del mundo. Incluye búsqueda por nombre, filtrado por región, paginación y manejo completo de estados de carga y errores en el DOM.

## API Utilizada
- **Nombre:** Countries.dev
- **Endpoint:** `https://countries.dev/countries`
- **Formato de respuesta:** JSON
- **Autenticación:** No requiere (API pública)
- **Nota técnica:** Originalmente se intentó usar *REST Countries*, pero debido a cambios recientes en sus políticas de acceso y rate limits, se optó por esta alternativa gratuita que provee datos similares.

---

## Instrucciones de uso

Para ejecutar y probar esta aplicación, sigue estos pasos:

1. **Clonar o descargar el proyecto:**
   - Clona el repositorio desde GitHub o descarga el código fuente en formato `.zip` y descomprímelo.
   
2. **Abrir la aplicación:**
   - No requiere instalación de dependencias ni servidores backend. Simplemente haz doble clic en el archivo `index.html` para abrirlo en tu navegador web (Chrome, Firefox, Edge, etc.).

3. **Interactuar con la interfaz:**
   - **Buscar por nombre:** Escribe el nombre de un país (en inglés o español, según lo devuelva la API) en el campo de búsqueda. Los resultados se filtran en tiempo real.
   - **Filtrar por región:** Utiliza el menú desplegable para seleccionar un continente específico (África, América, Asia, Europa, Oceanía).
   - **Paginación:** Usa los botones "Anterior" y "Siguiente" en la parte inferior para navegar entre las distintas páginas de resultados.
   - **Reintentar:** Si hay un fallo de conexión, aparecerá un botón rojo de "Reintentar" para volver a hacer la petición a la API.

---

## Capturas de pantalla

| Vista principal (Tarjetas) | Filtro por Región |
| :---: | :---: |
| ![Vista principal](https://github.com/user-attachments/assets/553d7641-75b6-4933-bde8-eb079e8aefee) | ![Filtro]() |

| Estado de Carga (Spinner) | Estado de Error / Vacío |
| :---: | :---: |
| ![Cargando](screenshots/cargando.png) | ![Error](screenshots/error.png) |

---

## Reflexión técnica

El desarrollo de esta miniaplicación permitió poner en práctica los conceptos fundamentales del consumo de servicios web y la manipulación del DOM. A continuación, los puntos clave del proceso:

- **Consumo de API y Asincronía:** Se utilizó la API nativa `fetch` junto con `async/await` para manejar las peticiones HTTP de forma asíncrona. Se implementó un bloque `try/catch` para capturar posibles fallos de red y se validó el estado `response.ok` para asegurar que la respuesta HTTP fuera exitosa antes de procesar el JSON.
- **Adaptación y Procesamiento de Datos:** Durante el desarrollo, nos encontramos con que la API de *REST Countries* (la opción inicial) dejó de funcionar por políticas de acceso. Al migrar a la API *Countries.dev*, los datos venían en un formato distinto (por ejemplo, la capital era un string en lugar de un array). Se desarrolló una función adaptadora en JavaScript que evalúa el tipo de dato y lo estandariza. Además, se implementó una lógica matemática para convertir los códigos de país de dos letras (ej. "MX") en emojis de banderas (🇲🇽).
- **Interacción y Experiencia de Usuario (UX):** Se priorizó la retroalimentación visual. La aplicación cuenta con tres estados de UI claros: 
  1. *Spinner de carga* mientras se espera la respuesta de la red.
  2. *Mensaje de error* con botón de reintento si la petición falla.
  3. *Empty State* (estado vacío) con un mensaje amigable si la búsqueda del usuario no arroja resultados.
- **Renderizado Dinámico:** Se evitó el uso de frameworks pesados, optando por manipular el DOM de forma nativa. Utilizando `template literals` e `innerHTML`, se generaron dinámicamente las tarjetas de los países, aplicando un orden alfabético previo y limitando la cantidad de elementos por página para optimizar el rendimiento y la navegación.

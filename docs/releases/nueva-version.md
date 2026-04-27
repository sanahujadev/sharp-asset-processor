# Release Notes - v1.1.0

## Resumen
Se ha añadido una nueva capa de automatización al pipeline para permitir la subida directa de los assets procesados a un bucket de AWS S3. Esta versión introduce interactividad para seleccionar el destino y gestiona automáticamente los metadatos de los archivos (MIME types).

## Cambios Principales
- **Nuevo script de despliegue:** Implementación de `upload.js` para la subida recursiva a S3.
- **Interactividad:** Integración de prompts para seleccionar carpetas de destino específicas (`sanahujadev`, `jenyogart`, `casahita`).
- **Gestión de Entorno:** Soporte para variables de entorno mediante `.env` para credenciales de AWS.
- **Recomendación:** Se recomienda personalizar la interactividad en `upload.js` para adaptar las opciones de destino a tus necesidades.

## Nuevas Dependencias
Se han añadido los siguientes paquetes (versiones exactas):
- `@aws-sdk/client-s3 3.1037.0`: Cliente oficial para interactuar con AWS S3.
- `@inquirer/prompts 8.4.2`: Interfaz interactiva de línea de comandos.
- `dotenv 17.4.2`: Carga de variables de entorno.
- `mime-types 3.0.2`: Detección de tipos MIME para una correcta visualización en S3/Navegadores.

## Cómo usar el Upload
1. Configura tu archivo `.env` con las credenciales de AWS.
2. Procesa tus imágenes con `pnpm run dev` o `pnpm run custom`.
3. Ejecuta `pnpm run upload` y selecciona el destino.

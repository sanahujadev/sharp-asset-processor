# Sharp Image Pipeline

Este es un script de Node.js que automatiza el procesamiento de imágenes para la web moderna. Utiliza la librería `sharp` para convertir un directorio de imágenes en un conjunto de formatos y tamaños optimizados.

## ¿Qué hace?

El script toma todas las imágenes que se encuentran en la carpeta `/assets` y por cada una de ellas:

1.  Crea un nuevo directorio en la carpeta `/output` con el nombre de la imagen original.
2.  Dentro de ese nuevo directorio, genera tres subcarpetas: `avif`, `webp` y `jpg`.
3.  Copia la imagen original en el directorio.
4.  Convierte la imagen original a los siguientes formatos y tamaños, guardándolos en sus respectivas carpetas:
    -   **Anchos:** 360w, 720w, 1280w, 1920w.
    -   **Formatos:** AVIF, WebP, y JPEG.

## Uso

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
2.  **Añadir imágenes:**
    Coloca todas las imágenes que deseas procesar en la carpeta `/assets`.

3.  **Ejecutar el script:**
    ```bash
    pnpm run dev
    ```

Las imágenes procesadas aparecerán en la carpeta `/output` con la estructura de directorios descrita anteriormente.

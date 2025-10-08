# Sharp Image and PDF Pipeline

Este es un script de Node.js que automatiza el procesamiento de imágenes y PDFs para la web moderna. Utiliza la librería `sharp` para convertir un directorio de imágenes en un conjunto de formatos y tamaños optimizados, y `pdf-to-img` para convertir PDFs a imágenes.

## ¿Qué hace?

### Procesamiento de Imágenes

El script toma todas las imágenes que se encuentran en la carpeta `/assets` y por cada una de ellas:

1.  Crea un nuevo directorio en la carpeta `/output` con el nombre de la imagen original.
2.  Dentro de ese nuevo directorio, genera tres subcarpetas: `avif`, `webp` y `jpg`.
3.  Copia la imagen original en el directorio con el nombre `original.<ext>`.
4.  Convierte la imagen original a los siguientes formatos y tamaños, guardándolos en sus respectivas carpetas:
    -   **Anchos:** 360w, 720w, 1280w, 1920w.
    -   **Formatos:** AVIF, WebP, y JPEG.

### Procesamiento de PDFs

El script toma todos los PDFs que se encuentran en la carpeta `/pdf-assets` y por cada uno de ellos:

1.  Convierte cada página del PDF a una imagen PNG.
2.  Guarda las imágenes en la carpeta `/output` con el nombre `pdf-<nombre-del-pdf>-<numero-de-pagina>.png`.

## Uso

### Imágenes

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

### PDFs

1.  **Instalar dependencias (si no lo has hecho ya):**
    ```bash
    pnpm install
    ```
2.  **Añadir PDFs:**
    Coloca todos los PDFs que deseas procesar en la carpeta `/pdf-assets`.

3.  **Ejecutar el script:**
    ```bash
    pnpm run pdf
    ```

Las imágenes generadas a partir de los PDFs aparecerán en la carpeta `/output`. Son Thumbnails de los pdfs.
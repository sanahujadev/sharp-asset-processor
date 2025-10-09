# Sharp Asset Processing Pipeline

Este es un pipeline de Node.js diseñado para automatizar y optimizar el procesamiento de activos visuales (imágenes y PDFs) para su uso en la web moderna. Utiliza la potente librería `sharp` y `pdf-to-img` para crear un conjunto completo de imágenes optimizadas a partir de un directorio de origen.

## ✨ Características

### 🖼️ Procesamiento de Imágenes

-   **Múltiples Formatos:** Convierte tus imágenes a los formatos más eficientes y compatibles: `avif`, `webp` y `jpeg`.
-   **Varios Tamaños (Responsive):** Genera múltiples anchos para asegurar tiempos de carga rápidos en cualquier dispositivo: `1920w`, `1280w`, `720w` y `360w`.
-   **Thumbnails Automáticos:** Crea automáticamente un thumbnail de `100px` de ancho (`thumbnail.*`) para vistas previas rápidas.
-   **Conserva el Original:** Guarda una copia de la imagen original sin procesar para futuras referencias.

### 📄 Procesamiento de PDFs

-   **Extracción de Portada:** Toma la primera página de cada PDF para generar imágenes de vista previa.
-   **Múltiples Formatos:** Convierte la portada a `avif`, `webp` y `jpeg`.
-   **Dos Tamaños de Thumbnail:**
    -   Un thumbnail estándar de `100px` de ancho (`thumbnail.*`).
    -   Una vista previa más grande de `360px` de ancho (`thumbnail-360w.*`).
-   **Conserva el Original:** Al igual que con las imágenes, guarda una copia del PDF original.

## 🚀 Cómo Empezar

### Requisitos Previos

-   [Node.js](https://nodejs.org/) (v18 o superior)
-   [pnpm](https://pnpm.io/installation) como gestor de paquetes.

### Instalación y Uso

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd <nombre-del-directorio>
    ```

2.  **Instala las dependencias:**
    ```bash
    pnpm install
    ```

3.  **Añade tus archivos:**
    -   Copia las **imágenes** que deseas procesar en la carpeta `/assets`.
    -   Copia los **PDFs** que deseas procesar en la carpeta `/pdf-assets`.

4.  **Ejecuta los scripts:**
    -   Para procesar las imágenes:
        ```bash
        pnpm run dev
        ```
    -   Para procesar los PDFs:
        ```bash
        pnpm run pdf
        ```

## 📂 Estructura de Salida

Los archivos procesados se guardarán en la carpeta `/output`, organizados por el nombre del archivo original. A continuación se muestra un ejemplo de la estructura generada:

```
output/
├──
│   bonos-604/            # Carpeta generada para un PDF
│   ├── avif/
│   │   ├── thumbnail-360w.avif
│   │   └── thumbnail.avif
│   ├── jpeg/
│   │   ├── thumbnail-360w.jpeg
│   │   └── thumbnail.jpeg
│   ├── pdf/
│   │   └── original.pdf
│   └── webp/
│       ├── thumbnail-360w.webp
│       └── thumbnail.webp
│
└── HPIM6550/             # Carpeta generada para una imagen
    ├── avif/
    │   ├── HPIM6550-1280w.avif
    │   ├── HPIM6550-1920w.avif
    │   ├── HPIM6550-360w.avif
    │   ├── HPIM6550-720w.avif
    │   └── thumbnail.avif
    ├── jpeg/
    │   ├── HPIM6550-1280w.jpeg
    │   # ... y así sucesivamente
    ├── original.JPG
    └── webp/
        ├── HPIM6550-1280w.webp
        # ... y así sucesivamente
```

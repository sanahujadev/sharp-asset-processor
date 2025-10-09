const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const outputDir = path.join(__dirname, 'output');
const widths = [360, 720, 1280, 1920];
const formats = ['avif', 'webp', 'jpeg'];

// Create main output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Read all files from the assets directory
fs.readdir(assetsDir, (err, files) => {
    if (err) {
        console.error("Error al leer la carpeta de assets:", err);
        return;
    }

    if (files.length === 0) {
        console.log("La carpeta 'assets' está vacía. Añade algunas imágenes para procesar.");
        return;
    }

    console.log(`Se encontraron ${files.length} imágenes para procesar.`);

    files.forEach(file => {
        const inputFilePath = path.join(assetsDir, file);
        const imageName = path.parse(file).name;
        const imageOutputDir = path.join(outputDir, imageName);

        // Create a directory for the current image's output
        if (!fs.existsSync(imageOutputDir)) {
            fs.mkdirSync(imageOutputDir, { recursive: true });
        }

        // 1. Copy the original file
        fs.copyFileSync(inputFilePath, path.join(imageOutputDir, `original${path.extname(file)}`));
        console.log(`[${imageName}] Copiado el archivo original.`);

        const processingPromises = [];

        formats.forEach(format => {
            const formatDir = path.join(imageOutputDir, format);
            if (!fs.existsSync(formatDir)) {
                fs.mkdirSync(formatDir);
            }

            widths.forEach(width => {
                const outputFileName = `${imageName}-${width}w.${format}`;
                const outputFilePath = path.join(formatDir, outputFileName);

                const promise = sharp(inputFilePath)
                    .resize({ width })
                    .toFormat(format)
                    .toFile(outputFilePath)
                    .then(() => console.log(`[${imageName}] Generado: ${outputFileName}`))
                    .catch(err => console.error(`Error al generar ${outputFileName}:`, err));
                
                processingPromises.push(promise);
            });

            // Generar thumbnail
            const thumbnailWidth = 100;
            const thumbnailFileName = `thumbnail.${format}`;
            const thumbnailFilePath = path.join(formatDir, thumbnailFileName);

            const thumbnailPromise = sharp(inputFilePath)
                .resize({ width: thumbnailWidth })
                .toFormat(format)
                .toFile(thumbnailFilePath)
                .then(() => console.log(`[${imageName}] Generado: ${thumbnailFileName}`))
                .catch(err => console.error(`Error al generar ${thumbnailFileName}:`, err));
            
            processingPromises.push(thumbnailPromise);
        });

        Promise.all(processingPromises)
            .then(() => console.log(`✅ Procesamiento de '${imageName}' completado.`))
            .catch(err => console.error(`Ocurrió un error durante el procesamiento de '${imageName}':`, err));
    });
});
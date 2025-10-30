const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const assetsDir = path.join(__dirname, 'assets');
const outputDir = path.join(__dirname, 'output');
const supportedFormats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function processSingleImage(filePath, imageName, format, width) {
    const imageOutputDir = path.join(outputDir, imageName);
    if (!fs.existsSync(imageOutputDir)) {
        fs.mkdirSync(imageOutputDir, { recursive: true });
    }

    const formatDir = path.join(imageOutputDir, format);
    if (!fs.existsSync(formatDir)) {
        fs.mkdirSync(formatDir);
    }

    const outputFileName = `${imageName}-${width}w.${format}`;
    const outputFilePath = path.join(formatDir, outputFileName);

    return sharp(filePath)
        .resize({ width })
        .toFormat(format.toLowerCase())
        .toFile(outputFilePath)
        .then(() => console.log(`[${imageName}] Generado: ${outputFileName}`))
        .catch(err => console.error(`[${imageName}] Error al generar ${outputFileName}:`, err));
}

async function main() {
    // Ensure main output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    let format, width;

    try {
        // Ask for format
        const formatInput = await askQuestion(`Introduce el formato de salida (ej. ${supportedFormats.join(', ')}): `);
        if (!supportedFormats.includes(formatInput.toLowerCase())) {
            console.error(`Error: Formato no soportado. Por favor, elige uno de: ${supportedFormats.join(', ')}`);
            rl.close();
            return;
        }
        format = formatInput.toLowerCase();

        // Ask for width
        const widthStr = await askQuestion('Introduce el ancho en píxeles (ej. 800): ');
        const widthInput = parseInt(widthStr, 10);
        if (isNaN(widthInput) || widthInput <= 0) {
            console.error('Error: El ancho debe ser un número entero positivo.');
            rl.close();
            return;
        }
        width = widthInput;

    } catch (err) {
        console.error("Error durante la entrada de datos:", err);
        rl.close();
        return;
    }

    rl.close(); // Close readline interface after getting inputs

    fs.readdir(assetsDir, (err, files) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log("La carpeta 'assets' no existe. Crea la carpeta y añade algunas imágenes para procesar.");
            } else {
                console.error("Error al leer la carpeta de assets:", err);
            }
            return;
        }

        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp', '.gif', 'avif', 'tiff'].includes(ext);
        });

        if (imageFiles.length === 0) {
            console.log("La carpeta 'assets' está vacía o no contiene imágenes soportadas.");
            return;
        }

        console.log(`Se encontraron ${imageFiles.length} imágenes. Procesando con formato '${format}' y ancho '${width}px'...`);

        const processingPromises = imageFiles.map(file => {
            const inputFilePath = path.join(assetsDir, file);
            const imageName = path.parse(file).name;
            return processSingleImage(inputFilePath, imageName, format, width);
        });

        Promise.all(processingPromises)
            .then(() => console.log('✅ Procesamiento custom completado para todas las imágenes.'))
            .catch(err => console.error('Ocurrió un error durante el procesamiento custom:', err));
    });
}

main();

const sharp = require('sharp');
const { pdf } = require('pdf-to-img');
const fs = require('fs');
const path = require('path');

const pdfAssetsDir = path.join(__dirname, 'pdf-assets');
const outputDir = path.join(__dirname, 'output');
const formats = ['avif', 'webp', 'jpeg'];

// Ensure main output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

async function createPdfThumbnails(pdfPath) {
    const pdfName = path.parse(pdfPath).name;
    const pdfOutputDir = path.join(outputDir, pdfName);

    try {
        // This part can fail if the PDF is corrupted or unreadable
        const document = await pdf(pdfPath);
        const firstPageBuffer = await document.getPage(1);

        // Create the main output directory for the PDF only after successfully reading it
        if (!fs.existsSync(pdfOutputDir)) {
            fs.mkdirSync(pdfOutputDir, { recursive: true });
        }

        // Copy original PDF
        const pdfDir = path.join(pdfOutputDir, 'pdf');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }
        fs.copyFileSync(pdfPath, path.join(pdfDir, 'original.pdf'));
        console.log(`[${pdfName}] Copiado el PDF original`);

        const processingPromises = [];

        const sizes = [
            { width: 100, name: 'thumbnail' },
            { width: 360, name: 'thumbnail-360w' }
        ];

        formats.forEach(format => {
            const formatDir = path.join(pdfOutputDir, format);
            if (!fs.existsSync(formatDir)) {
                fs.mkdirSync(formatDir);
            }

            sizes.forEach(size => {
                const outputFileName = `${size.name}.${format}`;
                const outputPath = path.join(formatDir, outputFileName);

                const promise = sharp(firstPageBuffer)
                    .resize({ width: size.width })
                    .toFormat(format)
                    .toFile(outputPath)
                    .then(() => console.log(`[${pdfName}] Generada: ${outputFileName}`))
                    .catch(err => console.error(`[${pdfName}] Error al generar ${outputFileName}:`, err));

                processingPromises.push(promise);
            });
        });

        Promise.all(processingPromises)
            .then(() => console.log(`✅ Procesamiento de '${pdfName}' completado.`))
            .catch(err => console.error(`Ocurrió un error durante el procesamiento de '${pdfName}':`, err));

    } catch (error) {
        console.error(`[${pdfName}] Error al leer el PDF o crear miniaturas:`, error);
    }
}

// Read all files from the pdf-assets directory
fs.readdir(pdfAssetsDir, (err, files) => {
    if (err) {
        if (err.code === 'ENOENT') {
            console.log("La carpeta 'pdf-assets' no existe. Crea la carpeta y añade algunos PDFs para procesar.");
        } else {
            console.error("Error al leer la carpeta de pdf-assets:", err);
        }
        return;
    }

    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

    if (pdfFiles.length === 0) {
        console.log("La carpeta 'pdf-assets' está vacía o no contiene archivos PDF.");
        return;
    }

    console.log(`Se encontraron ${pdfFiles.length} PDFs para procesar.`);

    pdfFiles.forEach(file => {
        const inputFilePath = path.join(pdfAssetsDir, file);
        createPdfThumbnails(inputFilePath);
    });
});
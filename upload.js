require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { select } = require('@inquirer/prompts');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const outputDir = path.join(__dirname, 'output');

// Configuración de AWS
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const bucketName = process.env.AWS_BUCKET_NAME;

/**
 * Obtiene recursivamente todos los archivos de un directorio.
 */
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

async function uploadFile(filePath, s3Key) {
    const fileContent = fs.readFileSync(filePath);
    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        console.log(`✅ Subido: ${s3Key} (${contentType})`);
    } catch (err) {
        console.error(`❌ Error al subir ${s3Key}:`, err.message);
        throw err;
    }
}

async function main() {
    if (!fs.existsSync(outputDir)) {
        console.error('Error: La carpeta "output" no existe. Ejecuta primero los scripts de procesamiento.');
        return;
    }

    try {
        // 1. Selección interactiva de la carpeta base
        const baseFolder = await select({
            message: 'Selecciona la carpeta de destino en S3:',
            choices: [
                { name: 'sanahujadev', value: 'sanahujadev' },
                { name: 'jenyogart', value: 'jenyogart' },
                { name: 'carousel Javier Angel', value: 'sanahujadev/birthday/ja-sn-rr/carousel' },
                { name: 'carousel José Manuel', value: 'sanahujadev/birthday/jm-sn-rr/carousel' },
            ],
        });

        // 2. Obtener todos los archivos de output/
        const files = getAllFiles(outputDir);
        
        if (files.length === 0) {
            console.log('La carpeta "output" está vacía.');
            return;
        }

        console.log(`🚀 Iniciando subida de ${files.length} archivos a s3://${bucketName}/${baseFolder}/...`);

        // 3. Subir cada archivo manteniendo la estructura
        for (const filePath of files) {
            const relativePath = path.relative(outputDir, filePath);
            const s3Key = `${baseFolder}/${relativePath}`.replace(/\\/g, '/'); // Asegurar separadores web
            await uploadFile(filePath, s3Key);
        }

        console.log('\n✨ ¡Subida completada con éxito!');

    } catch (err) {
        if (err.name === 'ExitPromptError') {
            console.log('\nSubida cancelada.');
        } else {
            console.error('\n💥 Error crítico durante la subida:', err.message);
        }
    }
}

main();

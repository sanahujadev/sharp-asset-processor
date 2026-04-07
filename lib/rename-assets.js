const fs = require('fs');
const path = require('path');

const ASSETS_DIR = 'assets';
const REF_DATE = new Date(2020, 3, 22); // Mes 3 es Abril en JS

/**
 * Calculates the age of a photo based on a reference date.
 * 
 * @param {Date} photoDate Date of the photo.
 * @returns {string} Formatted age (e.g., "12-meses", "3-años").
 */
function calculateAge(photoDate) {
    let months = (photoDate.getFullYear() - REF_DATE.getFullYear()) * 12 + (photoDate.getMonth() - REF_DATE.getMonth());
    if (photoDate.getDate() < REF_DATE.getDate()) {
        months--;
    }

    if (months < 24) {
        return `${months}-meses`;
    } else {
        const years = Math.floor(months / 12);
        return `${years}-años`;
    }
}

/**
 * Parses a date from a filename using various known patterns.
 * 
 * @param {string} filename The name of the file to parse.
 * @returns {Date|null} The parsed date or null if no pattern matches.
 */
function parseDate(filename) {
    // Patrón 1: yyyymmdd_hhmmss.jpg (flexibilizado para cualquier cantidad de dígitos tras _)
    let match = filename.match(/^(\d{4})(\d{2})(\d{2})_\d+/);
    if (match) return new Date(match[1], match[2] - 1, match[3]);

    // Patrón 2: IMG-yyyymmdd-WAnum.jpg
    match = filename.match(/^IMG-(\d{4})(\d{2})(\d{2})-WA/);
    if (match) return new Date(match[1], match[2] - 1, match[3]);

    // Patrón 3: IMGyyyymmddhhmmss.jpg
    match = filename.match(/^IMG(\d{4})(\d{2})(\d{2})\d+/);
    if (match) return new Date(match[1], match[2] - 1, match[3]);

    // Patrón 4: Screenshot_yyyy-mm-dd-num-num-num.jpg
    match = filename.match(/^Screenshot_(\d{4})-(\d{2})-(\d{2})/);
    if (match) return new Date(match[1], match[2] - 1, match[3]);

    // Patrón 5: Timestamp (ej: 1656139729623)
    match = filename.match(/^(\d{13})\./);
    if (match) return new Date(parseInt(match[1]));

    return null;
}

const files = fs.readdirSync(ASSETS_DIR);
const dryRun = !process.argv.includes('--apply');

console.log(dryRun ? "MODO SIMULACIÓN (Dry Run)" : "APLICANDO CAMBIOS");

const usedNames = new Set();

/**
 * Main loop: iterates through the files in ASSETS_DIR and renames them.
 */
files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

    const date = parseDate(file);

    if (date) {
        const age = calculateAge(date);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');

        let baseName = `${yyyy}-${mm}-${dd}-${age}`;
        let newName = `${baseName}${ext}`;
        let counter = 1;

        // Manejar colisiones en el Set de nombres usados (para simulación y ejecución)
        while (usedNames.has(newName)) {
            newName = `${baseName}-${counter}${ext}`;
            counter++;
        }
        usedNames.add(newName);

        const oldPath = path.join(ASSETS_DIR, file);
        const newPath = path.join(ASSETS_DIR, newName);

        if (dryRun) {
            console.log(`${file} -> ${newName}`);
        } else {
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`Renombrado: ${file} -> ${newName}`);
            } catch (err) {
                console.error(`Error al renombrar ${file}: ${err.message}`);
            }
        }
    } else {
        console.warn(`No se pudo procesar: ${file}`);
    }
});

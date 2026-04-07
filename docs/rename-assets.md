# Rename Assets Script

This utility script renames image assets based on the date they were taken, adding the "age" of the person/subject relative to a reference date (April 22, 2020).

## Location
- Script: `lib/rename-assets.js`
- Target Assets: `assets/`

## Usage

### Dry Run (Simulation)
By default, the script runs in simulation mode. It will show what changes would be made without actually modifying any files.
```bash
node lib/rename-assets.js
```

### Apply Changes
To actually rename the files, use the `--apply` flag:
```bash
node lib/rename-assets.js --apply
```

## How it Works

1. **Date Parsing**: The script scans the `assets/` directory for `.jpg`, `.jpeg`, and `.png` files. It attempts to parse the date from the filename using several common patterns (e.g., WhatsApp, screenshots, timestamps).
2. **Age Calculation**: For each identified date, it calculates the time elapsed since `2020-04-22`.
3. **Renaming**: Files are renamed to the format `YYYY-MM-DD-age.ext` (e.g., `2021-04-22-12-meses.jpg`). 
4. **Collision Handling**: If a filename already exists, it appends a counter (e.g., `-1`, `-2`).

## Configuration
- `ASSETS_DIR`: The directory containing the assets to rename (default: `assets`).
- `REF_DATE`: The reference date used for age calculation (default: `2020-04-22`).

#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log(' PhotoCcrop - Demo de Funcionalidades\n');


const demoDir = path.join(__dirname, 'demo');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir);
}

console.log(' Funcionalidades disponibles:');
console.log('1  CLI - Línea de comandos');
console.log('2  GUI - Aplicación de escritorio');
console.log('3  Procesamiento individual');
console.log('4  Procesamiento por lotes');
console.log('5  Múltiples formatos de imagen');
console.log('6  Ejecutables multiplataforma\n');

console.log(' Comandos de desarrollo:');
console.log('• npm start           - Ejecutar aplicación GUI');
console.log('• npm run dev         - Ejecutar GUI en modo desarrollo');
console.log('• npm run cli         - Ejecutar CLI');
console.log('• npm run build       - Construir ejecutables');
console.log('• npm run pkg:cli     - Construir ejecutable CLI\n');

console.log(' Ejemplos de CLI:');
console.log('• node cli/photoCcrop.js examples');
console.log('• node cli/photoCcrop.js process -i imagen.jpg -o circular.png');
console.log('• node cli/photoCcrop.js batch -i ./fotos -o ./circulares\n');

console.log(' Arquitectura del proyecto:');
console.log('• /cli/              - Aplicación de línea de comandos');
console.log('• /gui/              - Aplicación Electron (GUI)');
console.log('• /shared/           - Lógica de procesamiento compartida');



console.log(' photoCcrop está listo para usar!');
console.log(' Tip: Ejecuta "npm start" para abrir la aplicación GUI');
console.log(' Más información en README.md');

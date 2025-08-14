#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const ImageProcessor = require('../shared/imageProcessor');

const program = new Command();
const processor = new ImageProcessor();

// Configuración del programa CLI
program
  .name('photoCcrop')
  .description('PhotoCcrop - Herramienta de Recorte Circular para Credenciales')
  .version('1.0.0');

// Comando para procesar una imagen individual
program
  .command('process')
  .description('Procesa una imagen individual y la recorta en círculo')
  .requiredOption('-i, --input <path>', 'Ruta de la imagen de entrada')
  .requiredOption('-o, --output <path>', 'Ruta de la imagen de salida')
  .option('-s, --size <number>', 'Tamaño del círculo en píxeles', '300')
  .action(async (options) => {
    console.log('Iniciando procesamiento de imagen individual...\n');
    
    const size = parseInt(options.size);
    const result = await processor.processImage(options.input, options.output, size);
    
    if (result.success) {
      console.log('¡Éxito!');
      console.log(`Entrada: ${result.inputPath}`);
      console.log(`Salida: ${result.outputPath}`);
      console.log(`Tamaño: ${result.size}px`);
      console.log(`${result.message}\n`);
    } else {
      console.error('Error:');
      console.error(` ${result.message}\n`);
      process.exit(1);
    }
  });

// Comando para procesamiento por lotes
program
  .command('batch')
  .description('Procesa múltiples imágenes de una carpeta')
  .requiredOption('-i, --input <path>', 'Directorio de entrada con las imágenes')
  .requiredOption('-o, --output <path>', 'Directorio de salida para las imágenes procesadas')
  .option('-s, --size <number>', 'Tamaño del círculo en píxeles', '300')
  .action(async (options) => {
    console.log('Iniciando procesamiento por lotes...\n');
    
    const size = parseInt(options.size);
    
    // Callback para mostrar progreso
    const progressCallback = (progress) => {
      const bar = '█'.repeat(Math.floor(progress.percentage / 5)) + 
                  '░'.repeat(20 - Math.floor(progress.percentage / 5));
      
      process.stdout.write(`\rProgreso: [${bar}] ${progress.percentage}% (${progress.current}/${progress.total}) - ${progress.currentFile}`);
    };
    
    const result = await processor.processBatch(options.input, options.output, size, progressCallback);
    
    console.log('\n'); // Nueva línea después de la barra de progreso
    
    if (result.success) {
      console.log('¡Procesamiento completado!');
      console.log(`Directorio entrada: ${result.inputDir}`);
      console.log(`Directorio salida: ${result.outputDir}`);
      console.log(`Tamaño: ${result.size}px`);
      console.log(`Total archivos: ${result.totalFiles}`);
      console.log(`Exitosas: ${result.successful}`);
      console.log(`Fallidas: ${result.failed}`);
      console.log(` ${result.message}\n`);
      
      // Mostrar detalles de archivos fallidos si los hay
      if (result.failed > 0) {
        console.log(' Archivos que fallaron:');
        result.results
          .filter(r => !r.success)
          .forEach(r => {
            console.log(`  • ${path.basename(r.inputPath)}: ${r.error}`);
          });
        console.log();
      }
    } else {
      console.error(' Error en procesamiento por lotes:');
      console.error(` ${result.message}\n`);
      process.exit(1);
    }
  });

// Comando para obtener información de una imagen
program
  .command('info')
  .description('Muestra información detallada de una imagen')
  .requiredOption('-i, --input <path>', 'Ruta de la imagen')
  .action(async (options) => {
    console.log('z Obteniendo información de la imagen...\n');
    
    const result = await processor.getImageInfo(options.input);
    
    if (result.success) {
      console.log(' Información de la imagen:');
      console.log(` Archivo: ${path.basename(result.path)}`);
      console.log(` Dimensiones: ${result.width} x ${result.height} píxeles`);
      console.log(` Formato: ${result.format.toUpperCase()}`);
      console.log(` Tamaño: ${(result.size / 1024).toFixed(2)} KB\n`);
    } else {
      console.error(' Error obteniendo información:');
      console.error(` ${result.error}\n`);
      process.exit(1);
    }
  });

// Comando de ayuda con ejemplos
program
  .command('examples')
  .description('Muestra ejemplos de uso')
  .action(() => {
    console.log(' Ejemplos de uso de PhotoCcrop CLI:\n');
    
    console.log(' Procesar una imagen individual:');
    console.log('   photoCcrop process -i foto.jpg -o foto_circular.png -s 300\n');
    
    console.log(' Procesar todas las imágenes de una carpeta:');
    console.log('   photoCcrop batch -i ./fotos -o ./fotos_circulares -s 250\n');
    
    console.log(' Obtener información de una imagen:');
    console.log('   photoCcrop info -i mi_foto.jpg\n');
    
    console.log(' Ver ayuda de un comando específico:');
    console.log('   photoCcrop process --help\n');
    
    console.log(' Notas:');
    console.log('   • Formatos soportados: JPG, JPEG, PNG, BMP, TIFF, WEBP');
    console.log('   • Las imágenes de salida siempre serán PNG con fondo transparente');
    console.log('   • El tamaño por defecto es 300px');
    console.log('   • Se creará automáticamente el directorio de salida si no existe\n');
  });

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error(' Error no manejado:', error.message);
  process.exit(1);
});

// Parsear argumentos de línea de comandos
program.parse();

// Si no se proporciona ningún comando, mostrar ayuda
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

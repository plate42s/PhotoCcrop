const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


class ImageProcessor {
  constructor() {
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'];
  }

  /**
   * Verifica si un archivo es una imagen soportada
   * @param {string} filePath - Ruta del archivo
   * @returns {boolean} - True si es una imagen soportada
   */
  isSupportedImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.supportedFormats.includes(ext);
  }

  /**
   * Crea una máscara circular para recortar la imagen
   * @param {number} size - Tamaño de la máscara (ancho/alto)
   * @returns {Buffer} - Buffer de la máscara circular en formato PNG
   */
  async createCircularMask(size) {
    const maskSvg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
      </svg>
    `;
    
    return Buffer.from(maskSvg);
  }

  /**
   * Procesa una imagen individual y la recorta en círculo
   * @param {string} inputPath - Ruta de la imagen de entrada
   * @param {string} outputPath - Ruta de la imagen de salida
   * @param {number} size - Tamaño del círculo (por defecto 300px)
   * @returns {Promise<Object>} - Resultado del procesamiento
   */
  async processImage(inputPath, outputPath, size = 300) {
    try {
      
      if (!fs.existsSync(inputPath)) {
        throw new Error(`El archivo no existe: ${inputPath}`);
      }

      
      if (!this.isSupportedImage(inputPath)) {
        throw new Error(`Formato de imagen no soportado: ${path.extname(inputPath)}`);
      }

      
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      
      const mask = await this.createCircularMask(size);

     
      await sharp(inputPath)
        .resize(size, size, { 
          fit: 'cover',
          position: 'center'
        })
        .composite([{
          input: mask,
          blend: 'dest-in'
        }])
        .png()
        .toFile(outputPath);

      return {
        success: true,
        inputPath,
        outputPath,
        size,
        message: 'Imagen procesada exitosamente'
      };

    } catch (error) {
      return {
        success: false,
        inputPath,
        outputPath,
        error: error.message,
        message: `Error procesando imagen: ${error.message}`
      };
    }
  }

  /**
   * Procesa múltiples imágenes de una carpeta
   * @param {string} inputDir - Directorio de entrada
   * @param {string} outputDir - Directorio de salida
   * @param {number} size - Tamaño del círculo
   * @param {Function} progressCallback - Callback para reportar progreso
   * @returns {Promise<Object>} - Resultado del procesamiento por lotes
   */
  async processBatch(inputDir, outputDir, size = 300, progressCallback = null) {
    try {
      
      if (!fs.existsSync(inputDir)) {
        throw new Error(`El directorio de entrada no existe: ${inputDir}`);
      }

     
      const files = fs.readdirSync(inputDir)
        .filter(file => this.isSupportedImage(file))
        .map(file => path.join(inputDir, file));

      if (files.length === 0) {
        throw new Error('No se encontraron imágenes en el directorio especificado');
      }

      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const results = [];
      let processed = 0;
      let successful = 0;
      let failed = 0;

      
      for (const inputPath of files) {
        const fileName = path.basename(inputPath, path.extname(inputPath));
        const outputPath = path.join(outputDir, `${fileName}_c.png`);

        const result = await this.processImage(inputPath, outputPath, size);
        results.push(result);

        if (result.success) {
          successful++;
        } else {
          failed++;
        }

        processed++;

     
        if (progressCallback) {
          progressCallback({
            current: processed,
            total: files.length,
            successful,
            failed,
            currentFile: path.basename(inputPath),
            percentage: Math.round((processed / files.length) * 100)
          });
        }
      }

      return {
        success: true,
        totalFiles: files.length,
        processed,
        successful,
        failed,
        results,
        inputDir,
        outputDir,
        size,
        message: `Procesamiento completado: ${successful} exitosas, ${failed} fallidas`
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Error en procesamiento por lotes: ${error.message}`
      };
    }
  }

  /**
   * Obtiene información de una imagen
   * @param {string} imagePath - Ruta de la imagen
   * @returns {Promise<Object>} - Metadatos de la imagen
   */
  async getImageInfo(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return {
        success: true,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(imagePath).size,
        path: imagePath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = ImageProcessor;

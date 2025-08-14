# Configuración de Iconos para PhotoCcrop

## Iconos Necesarios

Para que la aplicación funcione completamente, necesitas crear los siguientes iconos:

### Para macOS (.icns)
- **Ubicación**: `gui/assets/icon.icns`
- **Tamaños**: 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024
- **Formato**: ICNS (Icon Composer o herramientas online)

### Para Windows (.ico)
- **Ubicación**: `gui/assets/icon.ico`
- **Tamaños**: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- **Formato**: ICO

### Para Linux (.png)
- **Ubicación**: `gui/assets/icon.png`
- **Tamaño**: 512x512
- **Formato**: PNG con transparencia

## Herramientas Recomendadas

### Online (Gratis)
- [ICO Convert](https://icoconvert.com/) - Convertir PNG a ICO/ICNS
- [CloudConvert](https://cloudconvert.com/) - Conversor universal
- [Favicon.io](https://favicon.io/) - Generador de iconos

### Software
- **macOS**: Icon Composer (Xcode)
- **Windows**: IcoFX, Greenfish Icon Editor
- **Multiplataforma**: GIMP, Figma, Sketch

## Diseño Sugerido

Para el icono de PhotoCcrop, se sugiere:
-  **Colores**: Azul/Morado (tema de la app)
-  **Elementos**: Cámara, círculo, tijeras
-  **Concepto**: Transformación circular de fotos
-  **Estilo**: Moderno, minimalista, profesional

## Crear Iconos Básicos

Si no tienes iconos personalizados, puedes usar este comando para crear iconos básicos:

```bash
# Crear un icono PNG básico con Sharp
node -e "
const sharp = require('sharp');
const svg = \`<svg width='512' height='512'><rect width='100%' height='100%' fill='#667eea'/><circle cx='256' cy='256' r='200' fill='white' fill-opacity='0.9'/><text x='256' y='280' text-anchor='middle' font-family='Arial' font-size='120' fill='#667eea'></text></svg>\`;
sharp(Buffer.from(svg)).png().toFile('gui/assets/icon.png');
console.log('Icono básico creado');
"
```

## Nota Importante

- Los iconos son opcionales para desarrollo
- La aplicación funcionará sin ellos (usará iconos por defecto)
- Para distribución profesional, se recomienda crear iconos personalizados

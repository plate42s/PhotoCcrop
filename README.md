#  PhotoCcrop - Herramienta de Recorte Circular para Credenciales

##  Descripción del Proyecto

PhotoCcrop es una herramienta que creé para solucionar un problema común que enfrenté durante mi servicio social: el tedioso proceso de recortar cientos de fotos una por una para las credenciales de mi universidad.

Esta herramienta automatiza el recorte de fotos en formato circular, permitiéndote procesar imágenes de forma individual o en lotes masivos. Con una aplicación de escritorio (GUI) fácil de usar y una interfaz de línea de comandos (CLI) potente, PhotoCcrop está aquí para transformar una tarea manual y repetitiva en un proceso rápido y eficiente.

##  Características

- ** Procesamiento por lotes**: Recorta automáticamente todas las imágenes dentro de una carpeta especificada
- ** Recorte circular**: Transforma las imágenes de entrada en un formato circular perfecto para fotos de credenciales
- ** Multiplataforma**: Genera ejecutables para Windows (.exe) y macOS (.dmg)
- ** Interfaz de Usuario (GUI)**: Aplicación de escritorio intuitiva con interfaz moderna
- ** Línea de Comandos (CLI)**: Herramienta independiente para automatización y scripts
- ** Alta eficiencia**: Utiliza la biblioteca Sharp para procesamiento rápido y optimizado
- ** Progreso en tiempo real**: Seguimiento visual del procesamiento por lotes
- ** Configuración flexible**: Tamaños personalizables de recorte circular

##  Tecnologías Utilizadas

### Backend/Procesamiento
- **Node.js**: Entorno de ejecución para la lógica del servidor y CLI
- **Sharp**: Biblioteca de procesamiento de imágenes de alto rendimiento
- **Commander**: Framework para interfaces de línea de comandos

### Frontend/GUI
- **Electron**: Framework para aplicaciones de escritorio multiplataforma
- **Tailwind CSS**: Framework CSS para diseño moderno y responsivo
- **JavaScript ES6+**: Lógica del frontend con características modernas

### Empaquetado y Distribución
- **Electron Builder**: Generación de instaladores para múltiples plataformas
- **pkg**: Empaquetado de la CLI en ejecutables independientes

##  Estructura del Proyecto

```
PhotoCcrop/
├── cli/                     # Aplicación de línea de comandos
│   └── photoCcrop.js           # CLI principal con Commander
├── gui/                     # Aplicación Electron
│   ├── main.js             # Proceso principal de Electron
│   ├── preload.js          # Bridge seguro entre procesos
│   └── renderer/           # Interfaz de usuario
│       ├── index.html      # HTML principal con Tailwind CSS
│       └── renderer.js     # Lógica del frontend
├── shared/                  # Lógica compartida
│   └── imageProcessor.js   # Procesamiento de imágenes con Sharp
├── .github/                # Configuración de GitHub
│   └── copilot-instructions.md
├── dist/                   # Ejecutables generados (después del build)
├── package.json            # Configuración del proyecto y dependencias
└── README.md              # Este archivo
```

##  Instalación y Configuración

### Requisitos Previos
- Node.js 16 o superior
- npm o yarn

### Instalación de Dependencias
```bash
# Clonar el repositorio
git clone https://github.com/plate42s/PhotoCcrop.git
cd PhotoCcrop

# Instalar dependencias
npm install
```

## Uso de la Aplicación GUI

### Ejecutar en Modo Desarrollo
```bash
npm run dev
```

### Compilar para Producción
```bash
# Compilar para todas las plataformas
npm run build

# Compilar solo para macOS
npm run build:mac

# Compilar solo para Windows
npm run build:win
```

### Características de la GUI
- **Interfaz de pestañas**: Cambio fácil entre procesamiento individual y por lotes
- **Vista previa**: Información detallada de las imágenes seleccionadas
- **Barra de progreso**: Seguimiento visual del procesamiento por lotes
- **Configuración intuitiva**: Control deslizante para ajustar el tamaño del círculo

##  Uso de la CLI

### Ejecutar CLI en Desarrollo
```bash
npm run cli
```

### Comandos Disponibles

#### Procesar una imagen individual
```bash
node cli/photoCcrop.js process -i input.jpg -o output.png -s 300
```

#### Procesamiento por lotes
```bash
node cli/photoCcrop.js batch -i ./input-folder -o ./output-folder -s 250
```

#### Obtener información de una imagen
```bash
node cli/photoCcrop.js info -i image.jpg
```

#### Ver ejemplos de uso
```bash
node cli/photoCcrop.js examples
```

#### Ver ayuda
```bash
node cli/photoCcrop.js --help
```

### Generar Ejecutable CLI
```bash
npm run pkg:cli
```

##  Formatos de Imagen Soportados

- **JPG/JPEG**: Fotografías estándar
- **PNG**: Imágenes con transparencia
- **BMP**: Formato bitmap
- **TIFF**: Formato de alta calidad
- **WEBP**: Formato moderno optimizado

##  Opciones de Configuración

### Tamaños de Recorte
- **Mínimo**: 100px
- **Por defecto**: 300px
- **Máximo**: 800px

### Formatos de Salida
- **GUI**: PNG con transparencia
- **CLI**: PNG con transparencia (optimizado para credenciales)

##  Scripts de Desarrollo

```bash
# Desarrollo
npm start          # Ejecutar aplicación Electron
npm run dev        # Ejecutar en modo desarrollo con DevTools
npm run cli        # Ejecutar CLI

# Construcción
npm run build      # Construir ejecutables GUI
npm run build:mac  # Construir solo para macOS
npm run build:win  # Construir solo para Windows
npm run pkg:cli    # Construir ejecutable CLI

# Utilidades
npm run clean      # Limpiar directorio dist
```

## 🔧 Configuración de Electron Builder

La aplicación está configurada para generar:

### macOS
- **Formato**: DMG
- **Arquitecturas**: x64, ARM64 (Apple Silicon)
- **Categoría**: Diseño Gráfico

### Windows
- **Formato**: NSIS Installer
- **Arquitecturas**: x64, x86
- **Instalación**: Permite elegir directorio

### Linux
- **Formato**: AppImage
- **Arquitectura**: x64

##  Casos de Uso

### Para Instituciones Educativas
- Procesamiento masivo de fotos de estudiantes
- Credenciales de personal docente
- Gafetes de identificación

### Para Empresas
- Tarjetas de empleados
- Credenciales corporativas
- Badges de eventos

### Para Fotógrafos
- Automatización de trabajo repetitivo
- Procesamiento de sesiones completas
- Entrega rápida a clientes

##  Características de Rendimiento

- **Procesamiento paralelo**: Utiliza todas las capacidades del CPU
- **Memoria optimizada**: Gestión eficiente de recursos
- **Formatos optimizados**: Sharp para máximo rendimiento
- **Progreso en tiempo real**: Feedback inmediato al usuario

##  Seguridad

- **Context Isolation**: Aislamiento del contexto en Electron
- **Preload seguro**: APIs expuestas de manera controlada
- **Validación de entrada**: Verificación de tipos de archivo
- **Manejo de errores**: Captura y reporte de errores robusto

##  Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

##  Autor

**Enrique**
- GitHub: [@plate42s](https://github.com/plate42s)

##  Agradecimientos

- [Sharp](https://sharp.pixelplumbing.com/) por la excelente biblioteca de procesamiento de imágenes
- [Electron](https://www.electronjs.org/) por hacer posibles las aplicaciones de escritorio multiplataforma
- [Tailwind CSS](https://tailwindcss.com/) por el framework CSS moderno
- [Commander.js](https://github.com/tj/commander.js/) por la CLI intuitiva

---

 Si este proyecto te resulta útil, ¡no olvides darle una estrella!

 **PhotoCcrop** - Transformando fotos para credenciales, una imagen a la vez.

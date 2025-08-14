<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# PhotoCcrop - Instrucciones para Copilot

## Descripción del Proyecto
PhotoCcrop es una herramienta de recorte circular para fotos de credenciales hecho en mi estancia del servicio social que incluye:
- CLI (Command Line Interface) independiente
- GUI (Graphical User Interface) usando Electron
- Lógica compartida para procesamiento de imágenes con Sharp

## Arquitectura
```
PhotoCcrop/
├── cli/                 # Aplicación de línea de comandos
│   └── photoCcrop.js    # CLI principal
├── gui/                 # Aplicación Electron
│   ├── main.js         # Proceso principal de Electron
│   ├── preload.js      # Comunicación segura entre procesos
│   └── renderer/       # Interfaz de usuario
│       ├── index.html  # HTML principal
│       └── renderer.js # Lógica del frontend
├── shared/              # Lógica compartida
│   └── imageProcessor.js # Procesamiento de imágenes con Sharp
└── package.json        # Configuración del proyecto
```

## Tecnologías Utilizadas
- **Node.js**: Base del proyecto
- **Sharp**: Biblioteca de procesamiento de imágenes de alto rendimiento
- **Electron**: Framework para aplicaciones de escritorio multiplataforma
- **Commander**: CLI framework para Node.js
- **Tailwind CSS**: Framework CSS para la interfaz
- **Electron Builder**: Empaquetado de aplicaciones Electron
- **pkg**: Empaquetado de aplicaciones CLI en ejecutables

## Funcionalidades Principales
1. **Procesamiento Individual**: Recortar una imagen en formato circular
2. **Procesamiento por Lotes**: Procesar múltiples imágenes de una carpeta
3. **Interfaz CLI**: Uso desde línea de comandos
4. **Interfaz GUI**: Aplicación de escritorio intuitiva
5. **Multiplataforma**: Ejecutables para Windows, macOS y Linux

## Comandos de Desarrollo
- `npm start`: Ejecutar aplicación Electron
- `npm run dev`: Ejecutar en modo desarrollo
- `npm run cli`: Ejecutar CLI
- `npm run build`: Construir ejecutables GUI
- `npm run pkg:cli`: Construir ejecutable CLI

## Convenciones de Código
- Usar ES6+ features cuando sea apropiado
- Manejo de errores consistente con try/catch
- Comentarios en español
- Nombres de variables y funciones descriptivos
- Validación de entrada en todas las funciones públicas

## Estructura de Datos
```javascript
// Resultado de procesamiento
{
  success: boolean,
  inputPath: string,
  outputPath: string,
  size: number,
  message: string,
  error?: string
}

// Progreso de procesamiento por lotes
{
  current: number,
  total: number,
  successful: number,
  failed: number,
  currentFile: string,
  percentage: number
}
```

## Notas de Seguridad
- El preload.js expone APIs específicas al proceso renderizador
- No usar nodeIntegration en el renderizador
- Validar todas las entradas del usuario
- Usar contextIsolation para mayor seguridad

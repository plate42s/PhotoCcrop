const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const ImageProcessor = require('../shared/imageProcessor');

// Configurar ICU data path para Windows
if (process.platform === 'win32') {
  process.env.ICU_DATA_FILE = path.join(process.resourcesPath, 'icudtl.dat');
  // Añadir flags adicionales para Windows
  app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
  app.commandLine.appendSwitch('no-sandbox');
}

const processor = new ImageProcessor();
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), 
    titleBarStyle: 'default',
    show: false 
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));


  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });


  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}


app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.handle('select-input-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Seleccionar carpeta con imágenes'
  });
  
  return result.canceled ? null : result.filePaths[0];
});


ipcMain.handle('select-output-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Seleccionar carpeta de destino'
  });
  
  return result.canceled ? null : result.filePaths[0];
});


ipcMain.handle('select-input-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    title: 'Seleccionar imagen',
    filters: [
      { name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp'] },
      { name: 'Todos los archivos', extensions: ['*'] }
    ]
  });
  
  return result.canceled ? null : result.filePaths[0];
});


ipcMain.handle('select-output-file', async (event, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Guardar imagen procesada',
    defaultPath: defaultName || 'imagen_c.png',
    filters: [
      { name: 'PNG', extensions: ['png'] }
    ]
  });
  
  return result.canceled ? null : result.filePath;
});


ipcMain.handle('process-image', async (event, inputPath, outputPath, size) => {
  return await processor.processImage(inputPath, outputPath, size);
});

ipcMain.handle('process-batch', async (event, inputDir, outputDir, size) => {
  return new Promise((resolve) => {
 
    const progressCallback = (progress) => {
      mainWindow.webContents.send('batch-progress', progress);
    };
    
    processor.processBatch(inputDir, outputDir, size, progressCallback)
      .then(resolve)
      .catch(resolve); 
  });
});


ipcMain.handle('get-image-info', async (event, imagePath) => {
  return await processor.getImageInfo(imagePath);
});

ipcMain.handle('get-supported-formats', () => {
  return processor.supportedFormats;
});


ipcMain.handle('show-info', async (event, title, message) => {
  return await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title,
    message,
    buttons: ['OK']
  });
});


ipcMain.handle('show-error', async (event, title, message) => {
  return await dialog.showMessageBox(mainWindow, {
    type: 'error',
    title,
    message,
    buttons: ['OK']
  });
});


ipcMain.handle('show-confirmation', async (event, title, message) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    title,
    message,
    buttons: ['Sí', 'No'],
    defaultId: 0,
    cancelId: 1
  });
  
  return result.response === 0;
});

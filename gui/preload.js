const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al proceso renderizador
contextBridge.exposeInMainWorld('electronAPI', {
  
  selectInputDirectory: () => ipcRenderer.invoke('select-input-directory'),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  selectInputFile: () => ipcRenderer.invoke('select-input-file'),
  selectOutputFile: (defaultName) => ipcRenderer.invoke('select-output-file', defaultName),
  
  
  processImage: (inputPath, outputPath, size) => 
    ipcRenderer.invoke('process-image', inputPath, outputPath, size),
  processBatch: (inputDir, outputDir, size) => 
    ipcRenderer.invoke('process-batch', inputDir, outputDir, size),
  getImageInfo: (imagePath) => 
    ipcRenderer.invoke('get-image-info', imagePath),
  getSupportedFormats: () => 
    ipcRenderer.invoke('get-supported-formats'),
  
  
  showInfo: (title, message) => ipcRenderer.invoke('show-info', title, message),
  showError: (title, message) => ipcRenderer.invoke('show-error', title, message),
  showConfirmation: (title, message) => ipcRenderer.invoke('show-confirmation', title, message),
  
 
  onBatchProgress: (callback) => {
    ipcRenderer.on('batch-progress', (event, progress) => callback(progress));
  },
 
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

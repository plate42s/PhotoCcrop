
class PhotoCcropApp {
    constructor() {
        this.currentTab = 'single';
        this.isProcessing = false;
        this.selectedInputFile = null;
        this.selectedOutputFile = null;
        this.selectedInputDir = null;
        this.selectedOutputDir = null;
        
        this.initializeEventListeners();
        this.setupDragAndDrop();
    }

    initializeEventListeners() {
        // Tab switching
        document.getElementById('single-tab').addEventListener('click', () => this.switchTab('single'));
        document.getElementById('batch-tab').addEventListener('click', () => this.switchTab('batch'));

        // Single image processing
        document.getElementById('select-single-input').addEventListener('click', () => this.selectSingleInput());
        document.getElementById('select-single-output').addEventListener('click', () => this.selectSingleOutput());
        document.getElementById('process-single').addEventListener('click', () => this.processSingleImage());

        // Batch processing
        document.getElementById('select-batch-input').addEventListener('click', () => this.selectBatchInput());
        document.getElementById('select-batch-output').addEventListener('click', () => this.selectBatchOutput());
        document.getElementById('process-batch').addEventListener('click', () => this.processBatch());

        // Size sliders
        document.getElementById('single-size').addEventListener('input', (e) => {
            document.getElementById('single-size-value').textContent = e.target.value + 'px';
        });

        document.getElementById('batch-size').addEventListener('input', (e) => {
            document.getElementById('batch-size-value').textContent = e.target.value + 'px';
        });

        // Progress callback for batch processing
        window.electronAPI.onBatchProgress((progress) => {
            this.updateBatchProgress(progress);
        });
    }

    setupDragAndDrop() {
        const dropArea = document.getElementById('single-drop-area');
        
      
        if (!dropArea) {
            console.log('Área de drag and drop no encontrada - funcionalidad deshabilitada');
            return;
        }
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-over'), false);
        });

        dropArea.addEventListener('drop', (e) => this.handleDrop(e), false);
        dropArea.addEventListener('click', () => this.selectSingleInput());
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    async handleDrop(e) {
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const file = files[0];
            if (this.isImageFile(file.path)) {
                this.selectedInputFile = file.path;
                await this.displaySingleInputInfo();
                this.updateSingleProcessButton();
            } else {
                await window.electronAPI.showError('Error', 'Por favor selecciona un archivo de imagen válido.');
            }
        }
    }

    isImageFile(filepath) {
        const ext = filepath.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp'].includes(ext);
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('text-gray-500', 'hover:text-gray-700');
        });

        const activeTab = document.getElementById(`${tab}-tab`);
        activeTab.classList.add('active');
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        document.getElementById(`${tab}-content`).classList.remove('hidden');
        this.currentTab = tab;
    }

    async selectSingleInput() {
        if (this.isProcessing) return;

        const filePath = await window.electronAPI.selectInputFile();
        if (filePath) {
            this.selectedInputFile = filePath;
            await this.displaySingleInputInfo();
            this.updateSingleProcessButton();
        }
    }

    async displaySingleInputInfo() {
        const infoSection = document.getElementById('single-input-info');
        const detailsDiv = document.getElementById('single-file-details');

        if (!this.selectedInputFile) {
            infoSection.classList.add('hidden');
            return;
        }

        try {
            const info = await window.electronAPI.getImageInfo(this.selectedInputFile);
            
            if (info.success) {
                const fileName = this.selectedInputFile.split('/').pop();
                detailsDiv.innerHTML = `
                    <div class="grid grid-cols-2 gap-2">
                        <div><strong>Archivo:</strong> ${fileName}</div>
                        <div><strong>Formato:</strong> ${info.format.toUpperCase()}</div>
                        <div><strong>Dimensiones:</strong> ${info.width} x ${info.height}px</div>
                        <div><strong>Tamaño:</strong> ${(info.size / 1024).toFixed(2)} KB</div>
                    </div>
                `;
                infoSection.classList.remove('hidden');
            } else {
                await window.electronAPI.showError('Error', 'No se pudo obtener información del archivo.');
            }
        } catch (error) {
            console.error('Error getting image info:', error);
        }
    }

    async selectSingleOutput() {
        if (this.isProcessing) return;

        const defaultName = this.selectedInputFile ? 
            this.selectedInputFile.split('/').pop().replace(/\.[^/.]+$/, '') + '_c.png' : 
            'imagen_c.png';

        const filePath = await window.electronAPI.selectOutputFile(defaultName);
        if (filePath) {
            this.selectedOutputFile = filePath;
            document.getElementById('single-output').value = filePath;
            this.updateSingleProcessButton();
        }
    }

    updateSingleProcessButton() {
        const button = document.getElementById('process-single');
        const canProcess = this.selectedInputFile && this.selectedOutputFile && !this.isProcessing;
        button.disabled = !canProcess;
    }

    async processSingleImage() {
        if (!this.selectedInputFile || !this.selectedOutputFile || this.isProcessing) return;

        this.isProcessing = true;
        const button = document.getElementById('process-single');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...';
        button.disabled = true;

        try {
            const size = parseInt(document.getElementById('single-size').value);
            const result = await window.electronAPI.processImage(
                this.selectedInputFile, 
                this.selectedOutputFile, 
                size
            );

            if (result.success) {
                this.showResults({
                    type: 'single',
                    success: true,
                    message: 'Imagen procesada exitosamente',
                    details: {
                        input: result.inputPath,
                        output: result.outputPath,
                        size: result.size
                    }
                });

                await window.electronAPI.showInfo('Éxito', 'La imagen se procesó correctamente.');
            } else {
                await window.electronAPI.showError('Error', result.message || 'Error procesando la imagen.');
            }
        } catch (error) {
            console.error('Error processing image:', error);
            await window.electronAPI.showError('Error', 'Error inesperado procesando la imagen.');
        } finally {
            this.isProcessing = false;
            button.innerHTML = originalText;
            this.updateSingleProcessButton();
        }
    }

    async selectBatchInput() {
        if (this.isProcessing) return;

        const dirPath = await window.electronAPI.selectInputDirectory();
        if (dirPath) {
            this.selectedInputDir = dirPath;
            document.getElementById('batch-input').value = dirPath;
            this.updateBatchProcessButton();
        }
    }

    async selectBatchOutput() {
        if (this.isProcessing) return;

        const dirPath = await window.electronAPI.selectOutputDirectory();
        if (dirPath) {
            this.selectedOutputDir = dirPath;
            document.getElementById('batch-output').value = dirPath;
            this.updateBatchProcessButton();
        }
    }

    updateBatchProcessButton() {
        const button = document.getElementById('process-batch');
        const canProcess = this.selectedInputDir && this.selectedOutputDir && !this.isProcessing;
        button.disabled = !canProcess;
    }

    async processBatch() {
        if (!this.selectedInputDir || !this.selectedOutputDir || this.isProcessing) return;

        const confirmed = await window.electronAPI.showConfirmation(
            'Confirmar Procesamiento',
            '¿Estás seguro de que quieres procesar todas las imágenes en la carpeta seleccionada?'
        );

        if (!confirmed) return;

        this.isProcessing = true;
        const button = document.getElementById('process-batch');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...';
        button.disabled = true;

        // Show progress section
        const progressSection = document.getElementById('batch-progress-section');
        progressSection.classList.remove('hidden');

        try {
            const size = parseInt(document.getElementById('batch-size').value);
            const result = await window.electronAPI.processBatch(
                this.selectedInputDir,
                this.selectedOutputDir,
                size
            );

            if (result.success) {
                this.showResults({
                    type: 'batch',
                    success: true,
                    message: result.message,
                    details: {
                        totalFiles: result.totalFiles,
                        successful: result.successful,
                        failed: result.failed,
                        inputDir: result.inputDir,
                        outputDir: result.outputDir,
                        size: result.size,
                        results: result.results
                    }
                });

                await window.electronAPI.showInfo('Procesamiento Completado', result.message);
            } else {
                await window.electronAPI.showError('Error', result.message || 'Error en el procesamiento por lotes.');
            }
        } catch (error) {
            console.error('Error in batch processing:', error);
            await window.electronAPI.showError('Error', 'Error inesperado en el procesamiento por lotes.');
        } finally {
            this.isProcessing = false;
            button.innerHTML = originalText;
            this.updateBatchProcessButton();
            progressSection.classList.add('hidden');
        }
    }

    updateBatchProgress(progress) {
        const progressBar = document.getElementById('batch-progress-bar');
        const progressText = document.getElementById('batch-progress-text');
        const currentFileText = document.getElementById('batch-current-file');

        progressBar.style.width = `${progress.percentage}%`;
        progressText.textContent = `${progress.percentage}% (${progress.current}/${progress.total})`;
        currentFileText.textContent = `Procesando: ${progress.currentFile}`;
    }

    showResults(resultData) {
        const resultsSection = document.getElementById('results-section');
        const resultsContent = document.getElementById('results-content');

        let html = '';

        if (resultData.type === 'single') {
            html = `
                <div class="bg-green-50 border border-green-200 rounded p-4">
                    <h4 class="font-medium text-green-800 mb-2"> Imagen Procesada Exitosamente</h4>
                    <div class="text-sm text-green-700 space-y-1">
                        <p><strong>Archivo de entrada:</strong> ${resultData.details.input.split('/').pop()}</p>
                        <p><strong>Archivo de salida:</strong> ${resultData.details.output.split('/').pop()}</p>
                        <p><strong>Tamaño del círculo:</strong> ${resultData.details.size}px</p>
                    </div>
                </div>
            `;
        } else if (resultData.type === 'batch') {
            const failedFiles = resultData.details.results.filter(r => !r.success);
            
            html = `
                <div class="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                    <h4 class="font-medium text-blue-800 mb-2"> Resumen del Procesamiento</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm text-blue-700">
                        <div><strong>Total de archivos:</strong> ${resultData.details.totalFiles}</div>
                        <div><strong>Tamaño del círculo:</strong> ${resultData.details.size}px</div>
                        <div><strong>Procesados exitosamente:</strong> ${resultData.details.successful}</div>
                        <div><strong>Fallos:</strong> ${resultData.details.failed}</div>
                    </div>
                </div>
            `;

            if (failedFiles.length > 0) {
                html += `
                    <div class="bg-red-50 border border-red-200 rounded p-4">
                        <h4 class="font-medium text-red-800 mb-2">Archivos que no se pudieron procesar:</h4>
                        <ul class="text-sm text-red-700 space-y-1">
                            ${failedFiles.map(f => `
                                <li>• ${f.inputPath.split('/').pop()}: ${f.error}</li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }
        }

        resultsContent.innerHTML = html;
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotoCcropApp();
});

// Handle any uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    if (window.electronAPI) {
        window.electronAPI.showError('Error Inesperado', 'Ha ocurrido un error inesperado en la aplicación.');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Uncaught promise rejection:', event.reason);
    if (window.electronAPI) {
        window.electronAPI.showError('Error Inesperado', 'Ha ocurrido un error inesperado en la aplicación.');
    }
});

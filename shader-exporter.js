/* @tweakable shader export/import functionality for permanent storage */
class ShaderExporter {
    constructor(presetManager) {
        this.presetManager = presetManager;
        /* @tweakable built-in preset count - shaders before this index are considered built-in */
        this.builtInPresetCount = 6;
        /* @tweakable whether to use File System Access API for choosing save location */
        this.useFilePicker = true;
    }

    /* @tweakable check if File System Access API is supported */
    isFilePickerSupported() {
        return this.useFilePicker && 'showSaveFilePicker' in window;
    }

    /* @tweakable convert preset name to valid JavaScript class name */
    toClassName(name) {
        return name
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /* @tweakable convert preset name to valid JavaScript file name */
    toFileName(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');
    }

    /* @tweakable generate shader class code from preset data */
    generateShaderClass(preset) {
        const className = this.toClassName(preset.name);
        const params = preset.params || {};
        
        // Build params string
        const paramsEntries = Object.entries(params);
        const paramsString = paramsEntries.length > 0
            ? paramsEntries.map(([key, value]) => `${key}: ${typeof value === 'string' ? `'${value}'` : value}`).join(', ')
            : 'speed: 1.0, intensity: 1.0';

        return `/* Auto-generated custom shader - ${preset.name} */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class ${className}Shader {
    static getDefinition() {
        return {
            name: '${preset.name}',
            thumbnail: '${preset.thumbnail || this.getDefaultThumbnail()}',
            params: { ${paramsString} },
            fragmentShader: this.getShaderCode()
        };
    }

    static getShaderCode() {
        return \`${preset.fragmentShader}\`;
    }
}`;
    }

    /* @tweakable get default thumbnail for exported shaders */
    getDefaultThumbnail() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DdXN0b208L3RleHQ+PC9zdmc+';
    }

    /* @tweakable save file using File System Access API with user-chosen location */
    async saveWithFilePicker(content, suggestedName, mimeType = 'text/plain') {
        try {
            const options = {
                suggestedName: suggestedName,
                types: [{
                    description: 'JavaScript Files',
                    accept: { 'application/javascript': ['.js'] }
                }, {
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] }
                }, {
                    description: 'Text Files',
                    accept: { 'text/plain': ['.txt'] }
                }]
            };

            const handle = await window.showSaveFilePicker(options);
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            
            return { success: true, fileName: handle.name };
        } catch (error) {
            if (error.name === 'AbortError') {
                // User cancelled the save dialog
                return { success: false, cancelled: true };
            }
            console.error('Error saving file:', error);
            return { success: false, error: error.message };
        }
    }

    /* @tweakable export a single shader as .js file with save location picker */
    async exportShader(presetIndex) {
        const preset = this.presetManager.shaderPresets[presetIndex];
        if (!preset) {
            console.error('Preset not found at index:', presetIndex);
            return;
        }

        const shaderCode = this.generateShaderClass(preset);
        const fileName = `${this.toFileName(preset.name)}.js`;
        
        let result;
        if (this.isFilePickerSupported()) {
            result = await this.saveWithFilePicker(shaderCode, fileName, 'application/javascript');
            if (!result.success && result.cancelled) {
                return; // User cancelled
            }
            if (!result.success) {
                // Fall back to download if file picker failed
                this.downloadFile(fileName, shaderCode, 'application/javascript');
            }
        } else {
            this.downloadFile(fileName, shaderCode, 'application/javascript');
        }
        
        // Show notification
        if (this.presetManager.notifications) {
            this.presetManager.notifications.showExportNotification(preset.name);
        }
    }

    /* @tweakable export all custom shaders as a single JSON backup file with save location picker */
    async exportAllCustomShaders() {
        const customPresets = this.presetManager.shaderPresets
            .slice(this.builtInPresetCount)
            .map((preset, index) => ({
                index: index,
                name: preset.name,
                thumbnail: preset.thumbnail,
                params: preset.params,
                fragmentShader: preset.fragmentShader,
                exportedAt: new Date().toISOString()
            }));

        if (customPresets.length === 0) {
            alert('No custom shaders to export. Create some custom shaders first!');
            return;
        }

        const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            shaderCount: customPresets.length,
            shaders: customPresets
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const fileName = `spectral-nexus-custom-shaders-${new Date().toISOString().split('T')[0]}.json`;
        
        if (this.isFilePickerSupported()) {
            const result = await this.saveWithFilePicker(jsonString, fileName, 'application/json');
            if (!result.success && result.cancelled) {
                return; // User cancelled
            }
            if (!result.success) {
                // Fall back to download if file picker failed
                this.downloadFile(fileName, jsonString, 'application/json');
            }
        } else {
            this.downloadFile(fileName, jsonString, 'application/json');
        }
        
        // Show notification
        if (this.presetManager.notifications) {
            this.presetManager.notifications.showBulkExportNotification(customPresets.length);
        }
    }

    /* @tweakable export all custom shaders as individual .js files in a zip-like structure */
    exportAllAsJsFiles() {
        const customPresets = this.presetManager.shaderPresets.slice(this.builtInPresetCount);

        if (customPresets.length === 0) {
            alert('No custom shaders to export. Create some custom shaders first!');
            return;
        }

        // Export each shader individually
        let delay = 0;
        customPresets.forEach((preset, index) => {
            setTimeout(() => {
                this.exportShader(this.builtInPresetCount + index);
            }, delay);
            delay += 200; // Stagger downloads to avoid browser blocking
        });

        // Show instructions
        setTimeout(() => {
            this.showExportInstructions(customPresets.length);
        }, delay + 100);
    }

    /* @tweakable show instructions for making shaders permanent */
    showExportInstructions(count) {
        const instructions = `
📦 ${count} shader${count > 1 ? 's' : ''} exported!

To make these shaders PERMANENT:

1. Move the downloaded .js file(s) to the shaders/ folder
2. Open index.html
3. Add a script tag BEFORE shaders.js:
   <script src="shaders/your-shader-file.js"></script>
4. Open shaders.js
5. Add a check for your shader class (follow the existing pattern)
6. Refresh the page - your shader is now built-in!

💡 Tip: Keep a backup of your custom shader files to never lose them again.`;

        alert(instructions);
    }

    /* @tweakable import shaders from JSON backup file */
    async importFromJson(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.shaders || !Array.isArray(data.shaders)) {
                throw new Error('Invalid shader backup file format');
            }

            let importedCount = 0;
            
            for (const shaderData of data.shaders) {
                if (shaderData.name && shaderData.fragmentShader) {
                    this.presetManager.addNewPreset(
                        shaderData.name,
                        shaderData.fragmentShader,
                        shaderData.params || {}
                    );
                    importedCount++;
                }
            }

            if (this.presetManager.notifications) {
                this.presetManager.notifications.showImportNotification(importedCount);
            }

            return importedCount;
        } catch (error) {
            console.error('Error importing shaders:', error);
            alert('Error importing shaders: ' + error.message);
            return 0;
        }
    }

    /* @tweakable trigger file download */
    downloadFile(fileName, content, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* @tweakable show export/import dialog */
    showExportImportDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'shader-export-dialog';
        dialog.innerHTML = `
            <div class="export-dialog-content">
                <div class="export-dialog-header">
                    <h3>💾 Shader Export / Import</h3>
                    <button class="close-btn" id="close-export-dialog">✖</button>
                </div>
                
                <div class="export-dialog-body">
                    <div class="export-section">
                        <h4>Export Shaders</h4>
                        <p class="section-description">Download your custom shaders for permanent storage</p>
                        <div class="export-buttons">
                            <button id="export-all-json" class="export-btn primary">
                                📦 Export All (JSON Backup)
                            </button>
                            <button id="export-all-js" class="export-btn">
                                📄 Export All as .js Files
                            </button>
                        </div>
                        <div class="export-info">
                            <p>💡 <strong>JSON Backup:</strong> Quick backup/restore format</p>
                            <p>💡 <strong>.js Files:</strong> Save to shaders/ folder to make permanent</p>
                            ${this.isFilePickerSupported() ? '<p>✅ <strong>File Picker:</strong> You can choose where to save</p>' : '<p>ℹ️ <strong>Auto-download:</strong> Files will download to your default folder</p>'}
                        </div>
                    </div>
                    
                    <div class="import-section">
                        <h4>Import Shaders</h4>
                        <p class="section-description">Restore shaders from a JSON backup file</p>
                        <div class="import-area">
                            <input type="file" id="import-file-input" accept=".json" style="display: none;">
                            <button id="import-shaders-btn" class="import-btn primary">
                                📂 Select Backup File
                            </button>
                            <p class="import-status" id="import-status"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Setup event listeners
        dialog.querySelector('#close-export-dialog').addEventListener('click', () => {
            this.closeDialog(dialog);
        });

        dialog.querySelector('#export-all-json').addEventListener('click', async () => {
            await this.exportAllCustomShaders();
        });

        dialog.querySelector('#export-all-js').addEventListener('click', async () => {
            await this.exportAllAsJsFiles();
        });

        const fileInput = dialog.querySelector('#import-file-input');
        dialog.querySelector('#import-shaders-btn').addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const statusEl = dialog.querySelector('#import-status');
                statusEl.textContent = 'Importing...';
                const count = await this.importFromJson(file);
                statusEl.textContent = `✅ Imported ${count} shader${count !== 1 ? 's' : ''}`;
                fileInput.value = ''; // Reset for re-import
            }
        });

        // Close on backdrop click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.closeDialog(dialog);
            }
        });

        // Animate in
        requestAnimationFrame(() => {
            dialog.classList.add('visible');
        });
    }

    /* @tweakable close export dialog */
    closeDialog(dialog) {
        dialog.classList.remove('visible');
        setTimeout(() => {
            if (dialog.parentNode) {
                document.body.removeChild(dialog);
            }
        }, 300);
    }
}

const DEFAULT_TRANSITION_DURATION = 2500;

class PresetManager {
    constructor(shaderEngine) {
        this.shaderEngine = shaderEngine;
        
        this.maxPresets = MAX_SHADER_PRESETS;
        
        this.shaderPresets = ShaderDefinitions.getPresetShaders();
        this.currentPreset = 0;

        // Initialize utility modules
        this.storage = new PresetStorage();
        this.renderer = new PresetRenderer(this);
        this.thumbnailCapture = new ThumbnailCapture(this, this.shaderEngine);
        this.notifications = new PresetNotifications();
        this.shaderGenerator = new ShaderGenerator(this);
        this.exporter = new ShaderExporter(this);

        this.transitions = new PresetTransitions(this);
        this.shuffle = new PresetShuffle(this);

        this.setupEventListeners();
        this.loadSavedState();
    }

    setupEventListeners() {
        document.getElementById('randomize-btn').addEventListener('click', () => this.randomizePreset());
        document.getElementById('capture-thumbnail-btn').addEventListener('click', () => this.thumbnailCapture.captureThumbnail());
        document.getElementById('shuffle-shader-btn').addEventListener('click', () => this.shuffle.toggleShaderShuffle());
        document.getElementById('export-import-btn').addEventListener('click', () => this.exporter.showExportImportDialog());
    }

    render() {
        this.renderer.render();
    }

    selectPreset(index) {
        if (this.transitions.isTransitioning) {
            // If already transitioning, queue the new selection
            this.transitions.targetPresetIndex = index;
            return;
        }
        
        this.selectPresetWithTransition(index);
    }

    selectPresetWithTransition(index) {
        if (index === this.currentPreset || this.transitions.isTransitioning) return;
        
        // FIX: Removed random check. Always attempt transition.
        this.transitions.startTransition(this.currentPreset, index);
    }

    selectPresetInstant(index) {
        this.currentPreset = index;
        this.render();
        this.saveState();
        
        // Load the selected shader
        if (index >= 0 && index < this.shaderPresets.length) {
            const preset = this.shaderPresets[index];
            this.loadPresetShader(preset);
            
            setTimeout(() => {
                this.shaderEngine.setPresetParams(preset.params);
            }, 50);
            
            // Notify shader editor if it exists
            if (window.spectralNexus && window.spectralNexus.uiManager && 
                window.spectralNexus.uiManager.shaderEditor) {
                window.spectralNexus.uiManager.shaderEditor.loadPresetCode(index);
            }
        }
    }

    updateTransition() {
        this.transitions.updateTransition();
    }

    get isTransitioning() {
        return this.transitions.isTransitioning;
    }

    loadPresetShader(preset) {
        const vertexShader = `#version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }`;

        if (!preset || !preset.fragmentShader) {
            console.error('Invalid preset - missing fragmentShader:', preset?.name);
            // Load fallback shader instead
            try {
                const fallback = ShaderDefinitions.getFallbackShader();
                const result = this.shaderEngine.loadShader(vertexShader, fallback);
                if (!result.success) {
                    console.error('Failed to load fallback shader:', result.error);
                }
            } catch (e) {
                console.error('Error loading fallback shader:', e);
            }
            return;
        }

        const result = this.shaderEngine.loadShader(vertexShader, preset.fragmentShader);
        
        if (!result.success) {
            console.error('Failed to load preset shader:', result.error);
        } else {
            console.log('Loaded shader preset:', preset.name);
        }
    }

    randomizePreset() {
        if (this.currentPreset >= 0 && this.currentPreset < this.shaderPresets.length) {
            const preset = this.shaderPresets[this.currentPreset];
            
            const randomRange = 2.0;
            
            Object.keys(preset.params).forEach(key => {
                preset.params[key] = Math.random() * randomRange;
            });
            this.renderer.renderPresetParams();
            this.saveState();
        }
    }

    saveState() {
        const extendedState = this.shuffle.getState();
        this.storage.saveState(this.shaderPresets, this.currentPreset, extendedState);
    }

    loadSavedState() {
        const state = this.storage.loadSavedState();
        if (state) {
            this.currentPreset = state.currentPreset || 0;
            this.shaderPresets = state.shaderPresets || this.shaderPresets;
            
            if (state.extendedState) {
                this.shuffle.setState(state.extendedState);
            }
        }
    }

    getCurrentPreset() {
        if (this.currentPreset >= 0 && this.currentPreset < this.shaderPresets.length) {
            return this.shaderPresets[this.currentPreset];
        }
        return null;
    }

    updatePresetShader(index, shaderCode) {
        if (index >= 0 && index < this.shaderPresets.length) {
            this.shaderPresets[index].fragmentShader = shaderCode;
            
            this.saveState();
            
            // Reload the shader if it's the current one
            if (index === this.currentPreset) {
                this.loadPresetShader(this.shaderPresets[index]);
            }
        }
    }

    addNewPreset(name, shaderCode, customParams = null) {
        const defaultParams = customParams || {};
        
        const newPreset = {
            name: name,
            thumbnail: this.storage.getDefaultCustomThumbnail(),
            params: defaultParams,
            fragmentShader: shaderCode
        };

        this.shaderPresets.push(newPreset);
        this.render();
        
        this.saveState();
        
        // Select the new preset
        this.selectPreset(this.shaderPresets.length - 1);
    }

    removePreset(index) {
        const builtInPresetCount = ShaderDefinitions ? ShaderDefinitions.shaderFiles.length : 6;
        
        if (index < builtInPresetCount) {
            const warningMessage = 'Built-in presets cannot be deleted.';
            Dialogs.alert(warningMessage, 'Warning');
            return;
        }

        const preset = this.shaderPresets[index];
        
        const confirmMessage = `Delete shader preset "${preset.name}"? This action cannot be undone.`;
        Dialogs.confirm(confirmMessage, 'Delete Preset').then(() => {
            this._removePreset(index, preset);
        }).catch(() => {
            // Cancelled - do nothing
        });
    }

    _removePreset(index, preset) {
        this.shaderPresets.splice(index, 1);

        if (index === this.currentPreset) {
            const fallbackPresetIndex = 0;
            this.selectPreset(Math.min(fallbackPresetIndex, this.shaderPresets.length - 1));
        } else if (index < this.currentPreset) {
            this.currentPreset--;
        }

        this.render();
        this.saveState();
        
        const notificationDuration = 2000;
        this.notifications.showPresetDeleteNotification(preset.name, notificationDuration);
    }

    showRenameDialog(index) {
        const preset = this.shaderPresets[index];
        
        const backdrop = document.createElement('div');
        backdrop.className = 'rename-dialog-backdrop';
        
        const dialog = document.createElement('div');
        dialog.className = 'rename-dialog';
        
        dialog.innerHTML = `
            <div class="rename-dialog-header">
                <h3>Rename Shader</h3>
                <button class="rename-dialog-close">&times;</button>
            </div>
            <div class="rename-dialog-body">
                <input type="text" class="rename-input" value="${preset.name}" placeholder="Enter new name">
            </div>
            <div class="rename-dialog-footer">
                <button class="rename-btn cancel">Cancel</button>
                <button class="rename-btn confirm">Rename</button>
            </div>
        `;
        
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);
        
        requestAnimationFrame(() => {
            backdrop.classList.add('visible');
            dialog.classList.add('visible');
            dialog.querySelector('.rename-input').select();
        });
        
        const closeDialog = () => {
            backdrop.classList.remove('visible');
            dialog.classList.remove('visible');
            setTimeout(() => {
                if (backdrop.parentNode) document.body.removeChild(backdrop);
            }, 200);
        };
        
        dialog.querySelector('.rename-dialog-close').addEventListener('click', closeDialog);
        dialog.querySelector('.rename-btn.cancel').addEventListener('click', closeDialog);
        
        dialog.querySelector('.rename-btn.confirm').addEventListener('click', () => {
            const newName = dialog.querySelector('.rename-input').value.trim();
            if (newName && newName !== preset.name) {
                preset.name = newName;
                this.render();
                this.saveState();
            }
            closeDialog();
        });
        
        dialog.querySelector('.rename-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                dialog.querySelector('.rename-btn.confirm').click();
            } else if (e.key === 'Escape') {
                closeDialog();
            }
        });
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeDialog();
        });
    }
}

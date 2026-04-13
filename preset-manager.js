/* @tweakable default transition duration for shader blending in milliseconds */
const DEFAULT_TRANSITION_DURATION = 2500;

class PresetManager {
    constructor(shaderEngine) {
        this.shaderEngine = shaderEngine;
        
        /* @tweakable number of presets to load on startup */
        this.maxPresets = MAX_SHADER_PRESETS;
        
        this.shaderPresets = ShaderDefinitions.getPresetShaders();
        this.currentPreset = 0;

        // Initialize utility modules
        this.storage = new PresetStorage();
        this.renderer = new PresetRenderer(this);
        this.thumbnailCapture = new ThumbnailCapture(this, this.shaderEngine);
        this.notifications = new PresetNotifications();
        /* @tweakable shader generator integration */
        this.shaderGenerator = new ShaderGenerator(this);
        /* @tweakable shader exporter integration */
        this.exporter = new ShaderExporter(this);

        /* @tweakable initialize transition and shuffle management modules */
        this.transitions = new PresetTransitions(this);
        this.shuffle = new PresetShuffle(this);

        this.setupEventListeners();
        this.loadSavedState();
    }

    setupEventListeners() {
        document.getElementById('randomize-btn').addEventListener('click', () => this.randomizePreset());
        document.getElementById('capture-thumbnail-btn').addEventListener('click', () => this.thumbnailCapture.captureThumbnail());
        /* @tweakable shuffle shader button event listener using extracted module */
        document.getElementById('shuffle-shader-btn').addEventListener('click', () => this.shuffle.toggleShaderShuffle());
        /* @tweakable export/import button event listener */
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

    /* @tweakable preset selection with blend transition using extracted module */
    selectPresetWithTransition(index) {
        if (index === this.currentPreset || this.transitions.isTransitioning) return;
        
        // FIX: Removed random check. Always attempt transition.
        this.transitions.startTransition(this.currentPreset, index);
    }

    /* @tweakable instant preset selection without transition */
    selectPresetInstant(index) {
        this.currentPreset = index;
        this.render();
        this.saveState();
        
        // Load the selected shader
        if (index >= 0 && index < this.shaderPresets.length) {
            const preset = this.shaderPresets[index];
            this.loadPresetShader(preset);
            
            /* @tweakable immediate parameter application after shader loading */
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

    /* @tweakable expose transition update method for external calls */
    updateTransition() {
        this.transitions.updateTransition();
    }

    /* @tweakable expose transition state for external checks */
    get isTransitioning() {
        return this.transitions.isTransitioning;
    }

    loadPresetShader(preset) {
        const vertexShader = `#version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }`;

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
            
            /* @tweakable randomization range for shader parameters */
            const randomRange = 2.0;
            
            Object.keys(preset.params).forEach(key => {
                preset.params[key] = Math.random() * randomRange;
            });
            this.renderer.renderPresetParams();
            this.saveState();
        }
    }

    saveState() {
        /* @tweakable save shuffle state using extracted module */
        const extendedState = this.shuffle.getState();
        this.storage.saveState(this.shaderPresets, this.currentPreset, extendedState);
    }

    loadSavedState() {
        const state = this.storage.loadSavedState();
        if (state) {
            this.currentPreset = state.currentPreset || 0;
            this.shaderPresets = state.shaderPresets || this.shaderPresets;
            
            /* @tweakable restore shuffle state using extracted module */
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
            
            /* @tweakable immediate save after shader modification to ensure persistence */
            this.saveState();
            
            // Reload the shader if it's the current one
            if (index === this.currentPreset) {
                this.loadPresetShader(this.shaderPresets[index]);
            }
        }
    }

    /* @tweakable enhanced preset creation with custom parameters */
    addNewPreset(name, shaderCode, customParams = null) {
        /* @tweakable default parameters for new custom presets */
        const defaultParams = customParams || {};
        
        const newPreset = {
            name: name,
            thumbnail: this.storage.getDefaultCustomThumbnail(),
            params: defaultParams,
            fragmentShader: shaderCode
        };

        this.shaderPresets.push(newPreset);
        this.render();
        
        /* @tweakable immediate save after adding new preset to ensure persistence */
        this.saveState();
        
        // Select the new preset
        this.selectPreset(this.shaderPresets.length - 1);
    }

    removePreset(index) {
        /* @tweakable minimum number of built-in presets that must remain */
        const builtInPresetCount = 6;
        
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
}
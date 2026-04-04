/* @tweakable preset transition management with blend effects */
class PresetTransitions {
    constructor(presetManager) {
        this.presetManager = presetManager;
        
        /* @tweakable transition system configuration */
        this.isTransitioning = false;
        this.transitionDuration = DEFAULT_TRANSITION_DURATION;
        this.transitionProgress = 0.0;
        this.transitionStartTime = 0;
        this.currentBlendMode = null;
        this.blendParams = { param1: 0, param2: 0, param3: 0, param4: 0 };
        this.transitionAnimationId = null;
        this.targetPresetIndex = -1;

        // NEW: Cache for generated transition source code to prevent frame drops
        this.shaderCache = new Map();
    }

    /* @tweakable start blend transition between shaders */
    startTransition(fromIndex, toIndex) {
        if (this.isTransitioning || toIndex < 0) return;
        
        this.isTransitioning = true;
        this.transitionProgress = 0.0;
        this.transitionStartTime = Date.now();
        this.targetPresetIndex = toIndex;
        
        /* @tweakable select and configure random blend mode */
        this.currentBlendMode = BlendShaders.getRandomBlendMode();
        const randomizedParams = BlendShaders.randomizeBlendParams(this.currentBlendMode);
        
        /* @tweakable map blend mode parameters to uniform values */
        this.blendParams = {
            param1: Object.values(randomizedParams)[0] || 0,
            param2: Object.values(randomizedParams)[1] || 0,
            param3: Object.values(randomizedParams)[2] || 0,
            param4: Object.values(randomizedParams)[3] || 0
        };
        
        console.log(`Starting transition with ${this.currentBlendMode.name} blend mode`);
        
        /* @tweakable create and load transition shader */
        this.createTransitionShader(fromIndex, toIndex);
        this.updateTransition();
    }

    
/* @tweakable create transition shader from current and target presets */
    createTransitionShader(fromIndex, toIndex) {
        const fromPreset = this.presetManager.shaderPresets[fromIndex];
        const toPreset = this.presetManager.shaderPresets[toIndex];
        
        if (!fromPreset || !toPreset) {
            console.warn('Invalid presets for transition, falling back to instant switch.');
            this.presetManager.selectPresetInstant(toIndex);
            this.isTransitioning = false;
            return;
        }

        // NEW: Generate a unique key for this specific combination
        const cacheKey = `${fromIndex}_${toIndex}_${this.currentBlendMode.id}`;
        
        let transitionShaderSource;

        // NEW: Check cache first
        if (this.shaderCache.has(cacheKey)) {
            transitionShaderSource = this.shaderCache.get(cacheKey);
        } else {
            console.log(`Generating transition shader: ${fromPreset.name} -> ${toPreset.name}`);
            transitionShaderSource = BlendShaders.createTransitionShader(
                fromPreset.fragmentShader,
                toPreset.fragmentShader,
                this.currentBlendMode
            );
            // Store in cache
            this.shaderCache.set(cacheKey, transitionShaderSource);
        }
        
        const vertexShader = `#version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }`;
        
        const result = this.presetManager.shaderEngine.loadShader(vertexShader, transitionShaderSource);
        
        if (!result.success) {
            console.error('Failed to load transition shader:', result.error);
            // On error, maybe clear cache key just in case it was bad gen
            this.shaderCache.delete(cacheKey);
            this.presetManager.selectPresetInstant(this.targetPresetIndex);
            this.isTransitioning = false;
            return;
        }
    }

    /* @tweakable update transition progress and uniforms */
    updateTransition() {
        if (!this.isTransitioning) return;
        
        const now = Date.now();
        const elapsed = now - this.transitionStartTime;
        this.transitionProgress = Math.min(elapsed / this.transitionDuration, 1.0);
        
        /* @tweakable set transition uniforms on shader engine */
        const gl = this.presetManager.shaderEngine.gl;
        if (gl && this.presetManager.shaderEngine.program) {
            const transitionProgressLoc = gl.getUniformLocation(this.presetManager.shaderEngine.program, 'u_transitionProgress');
            const blendParam1Loc = gl.getUniformLocation(this.presetManager.shaderEngine.program, 'u_blendParam1');
            const blendParam2Loc = gl.getUniformLocation(this.presetManager.shaderEngine.program, 'u_blendParam2');
            const blendParam3Loc = gl.getUniformLocation(this.presetManager.shaderEngine.program, 'u_blendParam3');
            const blendParam4Loc = gl.getUniformLocation(this.presetManager.shaderEngine.program, 'u_blendParam4');
            
            if (transitionProgressLoc) gl.uniform1f(transitionProgressLoc, this.transitionProgress);
            if (blendParam1Loc) gl.uniform1f(blendParam1Loc, this.blendParams.param1);
            if (blendParam2Loc) gl.uniform1f(blendParam2Loc, this.blendParams.param2);
            if (blendParam3Loc) gl.uniform1f(blendParam3Loc, this.blendParams.param3);
            if (blendParam4Loc) gl.uniform1f(blendParam4Loc, this.blendParams.param4);
        }
        
        /* @tweakable transition completion check */
        if (this.transitionProgress >= 1.0) {
            this.completeTransition();
        } else {
            /* @tweakable schedule next transition update */
            this.transitionAnimationId = requestAnimationFrame(() => this.updateTransition());
        }
    }

    /* @tweakable complete transition and switch to target preset */
    completeTransition() {
        this.isTransitioning = false;
        
        if (this.transitionAnimationId) {
            cancelAnimationFrame(this.transitionAnimationId);
            this.transitionAnimationId = null;
        }
        
        /* @tweakable finalize preset switch */
        this.presetManager.currentPreset = this.targetPresetIndex;
        this.targetPresetIndex = -1;
        
        /* @tweakable load final shader without transition */
        const preset = this.presetManager.shaderPresets[this.presetManager.currentPreset];
        this.presetManager.loadPresetShader(preset);
        
        setTimeout(() => {
            this.presetManager.shaderEngine.setPresetParams(preset.params);
        }, 50);
        
        this.presetManager.render();
        this.presetManager.saveState();
        
        // Notify shader editor if it exists
        if (window.spectralNexus && window.spectralNexus.uiManager && 
            window.spectralNexus.uiManager.shaderEditor) {
            window.spectralNexus.uiManager.shaderEditor.loadPresetCode(this.presetManager.currentPreset);
        }
        
        console.log(`Transition completed to: ${preset.name}`);
    }
}
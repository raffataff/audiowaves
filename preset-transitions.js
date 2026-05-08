const SIMPLE_VERTEX_SHADER = `#version 300 es
    in vec4 a_position;
    void main() {
        gl_Position = a_position;
    }`;

class PresetTransitions {
    constructor(presetManager) {
        this.presetManager = presetManager;
        
        this.isTransitioning = false;
        this.transitionDuration = DEFAULT_TRANSITION_DURATION;
        this.transitionProgress = 0.0;
        this.transitionStartTime = 0;
        this.currentBlendMode = null;
        this.blendParams = { param1: 0, param2: 0, param3: 0, param4: 0 };
        this.transitionAnimationId = null;
        this.targetPresetIndex = -1;

        this.holdFrames = 0;
        this.holdMaxFrames = 12;

        this.pendingTargetShader = null;
        this.pendingTargetParams = null;
        this.precompiledTarget = null;

        // NEW: Cache for generated transition source code to prevent frame drops
        this.shaderCache = new Map();
    }

    startTransition(fromIndex, toIndex) {
        if (this.isTransitioning || toIndex < 0) return;
        
        this.isTransitioning = true;
        this.transitionProgress = 0.0;
        this.transitionStartTime = Date.now();
        this.targetPresetIndex = toIndex;
        this.holdFrames = 0;

        const toPreset = this.presetManager.shaderPresets[toIndex];
        this.pendingTargetShader = toPreset.fragmentShader;
        this.pendingTargetParams = { ...toPreset.params };

        this.precompiledTarget = this.presetManager.shaderEngine.precompileShader(
            SIMPLE_VERTEX_SHADER,
            this.pendingTargetShader
        );
        
        this.currentBlendMode = BlendShaders.getRandomBlendMode();
        this.transitionDuration = this.currentBlendMode.durationHint || DEFAULT_TRANSITION_DURATION;
        const randomizedParams = BlendShaders.randomizeBlendParams(this.currentBlendMode);
        
        this.blendParams = {
            param1: Object.values(randomizedParams)[0] || 0,
            param2: Object.values(randomizedParams)[1] || 0,
            param3: Object.values(randomizedParams)[2] || 0,
            param4: Object.values(randomizedParams)[3] || 0
        };
        
        console.log(`Starting transition with ${this.currentBlendMode.name} blend mode`);
        
        this.createTransitionShader(fromIndex, toIndex);
        this.updateTransition();
    }

    
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
        
        const vertexShader = SIMPLE_VERTEX_SHADER;
        
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

    updateTransition() {
        if (!this.isTransitioning) return;
        
        const now = Date.now();
        const elapsed = now - this.transitionStartTime;
        const raw = Math.min(elapsed / this.transitionDuration, 1.0);
        this.transitionProgress = raw < 0.5
            ? 4.0 * raw * raw * raw
            : 1.0 - Math.pow(-2.0 * raw + 2.0, 3.0) / 2.0;
        
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
        
        if (this.transitionProgress >= 1.0) {
            if (this.holdFrames < this.holdMaxFrames) {
                this.holdFrames++;
                this.transitionAnimationId = requestAnimationFrame(() => this.updateTransition());
                return;
            }
            this.completeTransition();
        } else {
            this.transitionAnimationId = requestAnimationFrame(() => this.updateTransition());
        }
    }

    completeTransition() {
        this.isTransitioning = false;
        this.holdFrames = 0;
        
        if (this.transitionAnimationId) {
            cancelAnimationFrame(this.transitionAnimationId);
            this.transitionAnimationId = null;
        }
        
        this.presetManager.currentPreset = this.targetPresetIndex;
        this.targetPresetIndex = -1;
        
        const usePrecompiled = this.precompiledTarget &&
            this.presetManager.shaderEngine.activatePrecompiledProgram(this.precompiledTarget);
        
        if (!usePrecompiled && this.pendingTargetShader) {
            this.presetManager.shaderEngine.loadShader(SIMPLE_VERTEX_SHADER, this.pendingTargetShader);
        }
        
        if (this.pendingTargetParams) {
            this.presetManager.shaderEngine.setPresetParams(this.pendingTargetParams);
        }
        
        this.pendingTargetShader = null;
        this.pendingTargetParams = null;
        this.precompiledTarget = null;
        
        this.presetManager.render();
        this.presetManager.saveState();
        
        const preset = this.presetManager.shaderPresets[this.presetManager.currentPreset];
        
        // Notify shader editor if it exists
        if (window.spectralNexus && window.spectralNexus.uiManager && 
            window.spectralNexus.uiManager.shaderEditor) {
            window.spectralNexus.uiManager.shaderEditor.loadPresetCode(this.presetManager.currentPreset);
        }
        
        console.log(`Transition completed to: ${preset.name}`);
    }
}

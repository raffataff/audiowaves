/* @tweakable maximum number of effects that can be combined in a generated shader */
const MAX_SHADER_EFFECTS = 5;

/* @tweakable maximum number of control sliders that can be added to a generated shader */
const MAX_SHADER_CONTROLS = 12;

/* @tweakable default shader generation template base intensity */
const DEFAULT_GENERATION_INTENSITY = 1.0;

/* @tweakable refactored shader generator main coordination class */
class ShaderGenerator {
    constructor(presetManager) {
        this.presetManager = presetManager;
        this.isFormVisible = false;

        /* @tweakable initialize specialized generator modules */
        this.ui = new ShaderGeneratorUI(this);
        
        // Preview state
        this.previewCanvas = null;
        this.previewGl = null;
        this.previewProgram = null;
        this.previewAnimationId = null;
        this.previewStartTime = 0;
        this.previewUniforms = {};
        this.previewControls = [];
        this.previewControlUniforms = {};
        
        // Store generated code from preview for use by Generate button
        this.lastGeneratedCode = null;
        this.lastShaderData = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('add-shader-btn').addEventListener('click', () => this.showGeneratorForm());
    }

    /* @tweakable show shader generator form using extracted UI module */
    showGeneratorForm() {
        if (this.isFormVisible) return;
        this.isFormVisible = true;

        const modal = document.createElement('div');
        modal.className = 'shader-generator-modal';
        modal.innerHTML = this.ui.createFormHTML();

        document.body.appendChild(modal);

        // Setup form event listeners
        this.ui.setupFormEventListeners(modal);

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.generator-form').style.transform = 'scale(1)';
        }, 10);
    }

    /* @tweakable shader preview functionality using extracted compiler */
    previewShader(shaderData, modal) {
        const shaderCode = ShaderGeneratorCompiler.generateShaderCode(shaderData);
        
        // Store generated code for use by Generate button
        this.lastGeneratedCode = shaderCode;
        this.lastShaderData = shaderData;
        
        // Store controls for uniform initialization
        this.previewControls = shaderData.controls || [];

        const vertexShader = `#version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }`;

        // Wait a moment for layout to complete, then initialize preview
        setTimeout(() => {
            // Initialize preview canvas and WebGL
            const result = this.initPreviewWebGL(shaderCode, modal);
            
            if (result.success) {
                modal.querySelector('.preview-btn').textContent = '✓ Previewing';
                modal.querySelector('.preview-btn').style.background = 'rgba(0, 255, 0, 0.3)';
                
                // Start the preview render loop
                this.startPreviewRenderLoop();
            } else {
                alert('Shader preview failed: ' + result.error);
            }
        }, 100);
    }
    
    /* @tweakable initialize WebGL context for preview */
    initPreviewWebGL(fragmentSource, modal) {
        try {
            // Get or create preview canvas
            this.previewCanvas = modal.querySelector('#preview-canvas');
            if (!this.previewCanvas) {
                console.error('[DEBUG] Preview canvas not found in modal');
                return { success: false, error: 'Preview canvas not found' };
            }
            
            // Set canvas size - panel should already be visible
            const previewPanel = modal.querySelector('#preview-panel');
            
            if (previewPanel) {
                const rect = previewPanel.getBoundingClientRect();
                
                // Set canvas size
                const canvasWidth = Math.max(rect.width - 40, 280);
                const canvasHeight = Math.max(rect.height - 80, 280);
                this.previewCanvas.width = canvasWidth;
                this.previewCanvas.height = canvasHeight;
                this.previewCanvas.style.width = canvasWidth + 'px';
                this.previewCanvas.style.height = canvasHeight + 'px';
            }
            
            // Create WebGL2 context
            this.previewGl = this.previewCanvas.getContext('webgl2', {
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true
            });
            
            if (!this.previewGl) {
                console.error('[DEBUG] WebGL2 not supported');
                return { success: false, error: 'WebGL2 not supported' };
            }
            
            const gl = this.previewGl;
            
            // Compile vertex shader
            const vertexShaderSource = `#version 300 es
                in vec4 a_position;
                void main() {
                    gl_Position = a_position;
                }`;
            
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexShaderSource);
            gl.compileShader(vertexShader);
            
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                const error = gl.getShaderInfoLog(vertexShader);
                console.error('[DEBUG] Vertex shader error:', error);
                gl.deleteShader(vertexShader);
                return { success: false, error: 'Vertex shader error: ' + error };
            }
            
            // Compile fragment shader
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentSource);
            gl.compileShader(fragmentShader);
            
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                const error = gl.getShaderInfoLog(fragmentShader);
                console.error('[DEBUG] Fragment shader error:', error);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                return { success: false, error: 'Fragment shader error: ' + error };
            }
            
            // Create program
            this.previewProgram = gl.createProgram();
            gl.attachShader(this.previewProgram, vertexShader);
            gl.attachShader(this.previewProgram, fragmentShader);
            gl.linkProgram(this.previewProgram);
            
            if (!gl.getProgramParameter(this.previewProgram, gl.LINK_STATUS)) {
                const error = gl.getProgramInfoLog(this.previewProgram);
                console.error('[DEBUG] Program link error:', error);
                gl.deleteProgram(this.previewProgram);
                return { success: false, error: 'Program link error: ' + error };
            }
            
            // Clean up shaders after linking
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            
            // Setup geometry (fullscreen quad)
            const positions = new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1
            ]);
            
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
            
            const positionLocation = gl.getAttribLocation(this.previewProgram, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            
            // Get uniform locations
            this.previewUniforms = {
                time: gl.getUniformLocation(this.previewProgram, 'u_time'),
                resolution: gl.getUniformLocation(this.previewProgram, 'u_resolution'),
                bass: gl.getUniformLocation(this.previewProgram, 'u_bass'),
                mid: gl.getUniformLocation(this.previewProgram, 'u_mid'),
                treble: gl.getUniformLocation(this.previewProgram, 'u_treble'),
                prevFrame: gl.getUniformLocation(this.previewProgram, 'u_prev_frame'),
                spectrum: gl.getUniformLocation(this.previewProgram, 'u_spectrum')
            };
            
            // FIX: Also get uniform locations for control parameters (e.g., u_intensity)
            // Store control uniform values with their default values
            this.previewControlUniforms = {};
            if (this.previewControls && this.previewControls.length > 0) {
                this.previewControls.forEach(control => {
                    const uniformName = control.uniform; // e.g., 'u_intensity'
                    const location = gl.getUniformLocation(this.previewProgram, uniformName);
                    if (location) {
                        this.previewUniforms[uniformName] = location;
                        this.previewControlUniforms[uniformName] = control.defaultValue;
                    }
                });
            }
            
            
            // Set initial time
            this.previewStartTime = Date.now();
            
            return { success: true };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /* @tweakable start the preview render loop */
    startPreviewRenderLoop() {
        if (this.previewAnimationId) {
            cancelAnimationFrame(this.previewAnimationId);
        }
        
        const render = () => {
            if (!this.previewGl || !this.previewProgram) {
                return;
            }
            
            if (!this.previewCanvas) {
                return;
            }
            
            const gl = this.previewGl;
            const now = Date.now();
            const time = (now - this.previewStartTime) / 1000;
            
            gl.viewport(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            gl.useProgram(this.previewProgram);
            
            // Set uniforms
            if (this.previewUniforms.time) {
                gl.uniform1f(this.previewUniforms.time, time);
            }
            if (this.previewUniforms.resolution) {
                gl.uniform2f(this.previewUniforms.resolution, this.previewCanvas.width, this.previewCanvas.height);
            }
            
            // Set audio uniforms to 0 for preview (no audio data)
            if (this.previewUniforms.bass) gl.uniform1f(this.previewUniforms.bass, 0.5);
            if (this.previewUniforms.mid) gl.uniform1f(this.previewUniforms.mid, 0.3);
            if (this.previewUniforms.treble) gl.uniform1f(this.previewUniforms.treble, 0.7);
            
            // Set control uniform values (e.g., u_intensity)
            if (this.previewControlUniforms) {
                for (const [uniformName, value] of Object.entries(this.previewControlUniforms)) {
                    if (this.previewUniforms[uniformName]) {
                        gl.uniform1f(this.previewUniforms[uniformName], value);
                    }
                }
            }
            
            // Draw
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            
            this.previewAnimationId = requestAnimationFrame(render);
        };
        
        render();
    }
    
    /* @tweakable stop the preview render loop */
    stopPreview() {
        if (this.previewAnimationId) {
            cancelAnimationFrame(this.previewAnimationId);
            this.previewAnimationId = null;
        }
        
        if (this.previewGl) {
            // Delete WebGL resources
            if (this.previewProgram) {
                this.previewGl.deleteProgram(this.previewProgram);
                this.previewProgram = null;
            }
            this.previewGl = null;
        }
        
        this.previewCanvas = null;
        this.previewUniforms = {};
    }

    /* @tweakable shader generation using extracted compiler and controls */
    generateShader(shaderData) {
        let shaderCode;
        
        // Use the previewed code if available - the user has already seen this exact shader
        if (this.lastGeneratedCode) {
            console.log('[DEBUG] Using previewed shader code for generation');
            shaderCode = this.lastGeneratedCode;
        } else {
            // No preview was done, generate new code
            console.log('[DEBUG] No previewed code available, generating new shader code');
            shaderCode = ShaderGeneratorCompiler.generateShaderCode(shaderData);
        }
        
        const shaderParams = ShaderGeneratorControls.generateShaderParams(shaderData.controls);

        this.presetManager.addNewPreset(shaderData.name, shaderCode, shaderParams);
    }
}
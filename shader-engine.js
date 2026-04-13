class ShaderEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.program = null;
        this.framebuffers = [];
        this.textures = [];
        this.currentFramebuffer = 0;
        
        // Texture to hold audio frequency data
        this.audioTexture = null;
        
        this.uniforms = {};
        this.startTime = Date.now();
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.fps = 60;
        
        // Use config constants if available
        const config = window.Utils?.APP_CONFIG || {};
        this.renderScale = config.MAX_RENDER_SCALE || 1.0;
        this.targetFPS = 60;
        this.qualityAdjustment = true;
        
        this.currentPreset = null;
        this.presetParams = {};
        
        /* @tweakable resize debounce delay in milliseconds */
        this.resizeDebounceDelay = 16;
        this.resizeTimeout = null;
        
        /* @tweakable whether to preserve aspect ratio during resize */
        this.preserveAspectRatio = true;
        
        /* @tweakable minimum canvas dimensions */
        this.minCanvasSize = { 
            width: config.MIN_CANVAS_WIDTH || 320, 
            height: config.MIN_CANVAS_HEIGHT || 240 
        };
        
        /* @tweakable maximum canvas dimensions */
        this.maxCanvasSize = { 
            width: config.MAX_CANVAS_WIDTH || 4096, 
            height: config.MAX_CANVAS_HEIGHT || 4096 
        };
        
        // Context loss handling
        this.isContextLost = false;
        this.contextLossHandlers = [];
        
        this.initialize();
        this.setupContextLossHandling();
    }
    
    setupContextLossHandling() {
        this.canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            this.handleContextLoss();
            console.warn('WebGL context lost. Attempting to restore...');
        });
        
        this.canvas.addEventListener('webglcontextrestored', () => {
            this.handleContextRestored();
            console.log('WebGL context restored successfully.');
        });
    }
    
    handleContextLoss() {
        this.isContextLost = true;
        // Clear references to lost resources
        this.framebuffers = [];
        this.textures = [];
        this.audioTexture = null;
        this.program = null;
        
        // Notify any registered handlers
        this.contextLossHandlers.forEach(handler => {
            try {
                handler('lost');
            } catch (e) {
                console.error('Error in context loss handler:', e);
            }
        });
    }
    
    handleContextRestored() {
        this.isContextLost = false;
        // Reinitialize WebGL resources
        this.initialize();
        
        // Notify any registered handlers
        this.contextLossHandlers.forEach(handler => {
            try {
                handler('restored');
            } catch (e) {
                console.error('Error in context restore handler:', e);
            }
        });
    }
    
    onContextChange(handler) {
        this.contextLossHandlers.push(handler);
        // Return unsubscribe function
        return () => {
            const index = this.contextLossHandlers.indexOf(handler);
            if (index > -1) {
                this.contextLossHandlers.splice(index, 1);
            }
        };
    }
    
    initialize() {
        try {
            /* @tweakable whether to preserve drawing buffer for thumbnail capture */
            const preserveDrawingBuffer = true;
            
            this.gl = this.canvas.getContext('webgl2', {
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: preserveDrawingBuffer
            });
            
            if (!this.gl) {
                throw new Error('WebGL2 not supported');
            }
            
            this.setupFramebuffers();
            this.setupAudioTexture();
            this.loadDefaultShader();
            this.resize();
            
            console.log('Shader Engine initialized');
        } catch (error) {
            console.error('Failed to initialize shader engine:', error);
        }
    }

    // Create texture for audio spectrum
    setupAudioTexture() {
        const gl = this.gl;
        this.audioTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.audioTexture);
        
        // We need a 1x256 texture for frequency data
        // Using R8 format to save bandwidth (single channel)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 256, 1, 0, gl.RED, gl.UNSIGNED_BYTE, null);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    setupFramebuffers() {
        const gl = this.gl;
        
        // Create ping-pong framebuffers for feedback effects
        for (let i = 0; i < 2; i++) {
            const framebuffer = gl.createFramebuffer();
            const texture = gl.createTexture();
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            
            this.framebuffers.push(framebuffer);
            this.textures.push(texture);
        }
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    
    createShader(source, type) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compilation error: ${error}`);
        }
        
        return shader;
    }
    
    createProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        const vertexShader = this.createShader(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(fragmentSource, gl.FRAGMENT_SHADER);
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Program linking error: ${error}`);
        }
        
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        
        return program;
    }
    
    loadDefaultShader() {
        const vertexShader = `#version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;
        
        // Use first available preset shader (LatticeShader) as default instead of hardcoded
        try {
            const presets = ShaderDefinitions.getPresetShaders();
            if (presets.length > 0) {
                const defaultShader = presets[0];
                this.program = this.createProgram(vertexShader, defaultShader.fragmentShader);
                console.log('Loaded default shader:', defaultShader.name);
            } else {
                // Fallback to hardcoded shader only if no presets available
                const fragmentShader = `#version 300 es
                    precision highp float;
                    
                    uniform float u_time;
                    uniform vec2 u_resolution;
                    uniform float u_bass;
                    uniform float u_mid;
                    uniform float u_treble;
                    uniform float u_beat;
                    uniform sampler2D u_prev_frame;
                    uniform sampler2D u_spectrum;
                    
                    out vec4 fragColor;
                    
                    vec3 palette(float t) {
                        vec3 a = vec3(0.5, 0.5, 0.5);
                        vec3 b = vec3(0.5, 0.5, 0.5);
                        vec3 c = vec3(1.0, 1.0, 1.0);
                        vec3 d = vec3(0.263, 0.416, 0.557);
                        return a + b * cos(6.28318 * (c * t + d));
                    }
                    
                    void main() {
                        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
                        
                        // Sample spectrum texture
                        float specVal = texture(u_spectrum, vec2(length(uv) * 0.5, 0.0)).r;
                        
                        vec2 uv0 = uv;
                        vec3 finalColor = vec3(0.0);
                        
                        for (float i = 0.0; i < 4.0; i++) {
                            uv = fract(uv * 1.5) - 0.5;
                            
                            float d = length(uv) * exp(-length(uv0));
                            vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.4 + u_bass * 2.0);
                            
                            d = sin(d * 8.0 + u_time + u_beat * 10.0) / 8.0;
                            d = abs(d);
                            d = pow(0.01 / d, 1.2);
                            
                            finalColor += col * d * (1.0 + u_treble * 2.0 + specVal * 2.0);
                        }
                        
                        // Feedback effect
                        vec2 prevUV = gl_FragCoord.xy / u_resolution;
                        vec3 prevColor = texture(u_prev_frame, prevUV).rgb;
                        finalColor = mix(finalColor, prevColor * 0.98, 0.1 + u_mid * 0.3);
                        
                        fragColor = vec4(finalColor, 1.0);
                    }
                `;
                this.program = this.createProgram(vertexShader, fragmentShader);
            }
            this.setupUniforms();
            this.setupGeometry();
        } catch (error) {
            console.error('Failed to load default shader:', error);
        }
    }
    
    setupUniforms() {
        const gl = this.gl;
        gl.useProgram(this.program);
        
        // Dynamically discover all active uniforms in the compiled shader
        // This fixes the issue where slider controls were ignored because
        // their uniforms weren't in the hardcoded list
        this.uniforms = {};
        
        const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < numUniforms; i++) {
            const uniformInfo = gl.getActiveUniform(this.program, i);
            const uniformName = uniformInfo.name;
            
            // Store the location using the uniform name without the 'u_' prefix
            // e.g., 'u_speed' -> 'speed' for consistent access from presetParams
            const displayName = uniformName.startsWith('u_') 
                ? uniformName.substring(2) 
                : uniformName;
            
            this.uniforms[displayName] = gl.getUniformLocation(this.program, uniformName);
        }
    }
    
    setupGeometry() {
        const gl = this.gl;
        
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ]);
        
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        const positionLocation = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    }
    
    render(audioData) {
        if (!this.gl || !this.program || this.isContextLost) return;

        const gl = this.gl;
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;
        
        // Fix: Prevent division by zero and use exponential moving average for smoother FPS
        const clampedDelta = Math.max(deltaTime, 1);
        this.fps = 0.9 * this.fps + 0.1 * (1000 / clampedDelta);
        this.frameCount++;
        
        if (this.qualityAdjustment && this.frameCount % 60 === 0) {
            this.adjustQuality();
        }
        
        const targetFramebuffer = this.framebuffers[this.currentFramebuffer];
        const prevTexture = this.textures[1 - this.currentFramebuffer];
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, targetFramebuffer);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        gl.useProgram(this.program);
        
        const time = (now - this.startTime) / 1000;
        gl.uniform1f(this.uniforms.time, time);
        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        
        if (audioData) {
            gl.uniform1f(this.uniforms.bass, audioData.bass || 0);
            gl.uniform1f(this.uniforms.mid, audioData.mid || 0);
            gl.uniform1f(this.uniforms.treble, audioData.treble || 0);
            gl.uniform1f(this.uniforms.beat, audioData.beat || 0);

            // Update audio spectrum texture
            if (audioData.frequencyData) {
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, this.audioTexture);
                
                // Upload audio frequency data to GPU
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, audioData.frequencyData.length, 1, 0, gl.RED, gl.UNSIGNED_BYTE, audioData.frequencyData);
                
                gl.uniform1i(this.uniforms.spectrum, 1);
            }
        }
        
        if (this.presetParams) {
            Object.entries(this.presetParams).forEach(([key, value]) => {
                if (this.uniforms[key] !== null && this.uniforms[key] !== undefined) {
                    gl.uniform1f(this.uniforms[key], value);
                }
            });
        }
        
        // Bind previous frame texture to Unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, prevTexture);
        gl.uniform1i(this.uniforms.prevFrame, 0);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.currentFramebuffer]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        this.currentFramebuffer = 1 - this.currentFramebuffer;
    }

    // RESTORED METHOD
    loadShader(vertexSource, fragmentSource) {
        try {
            const newProgram = this.createProgram(vertexSource, fragmentSource);
            
            // Clean up old program
            if (this.program) {
                this.gl.deleteProgram(this.program);
            }
            
            this.program = newProgram;
            this.setupUniforms();
            this.setupGeometry();
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    adjustQuality() {
        if (this.fps < this.targetFPS && this.renderScale > 0.5) {
            this.renderScale = Math.max(0.5, this.renderScale - 0.1);
            this.resize();
            console.log(`Quality adjusted to ${Math.round(this.renderScale * 100)}%`);
        } else if (this.fps > this.targetFPS + 10 && this.renderScale < 1.0) {
            this.renderScale = Math.min(1.0, this.renderScale + 0.1);
            this.resize();
            console.log(`Quality restored to ${Math.round(this.renderScale * 100)}%`);
        }
    }
    
    resize() {
        const useDevicePixelRatio = true;
        const rect = this.canvas.getBoundingClientRect();
        const dpr = useDevicePixelRatio ? (window.devicePixelRatio || 1) : 1;
        const effectiveRenderScale = this.renderScale;
        
        let newWidth = Math.floor(rect.width * dpr * effectiveRenderScale);
        let newHeight = Math.floor(rect.height * dpr * effectiveRenderScale);
        
        newWidth = Math.max(this.minCanvasSize.width, Math.min(this.maxCanvasSize.width, newWidth));
        newHeight = Math.max(this.minCanvasSize.height, Math.min(this.maxCanvasSize.height, newHeight));
        
        if (this.canvas.width === newWidth && this.canvas.height === newHeight) {
            return;
        }
        
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        
        if (this.gl) {
            this.gl.viewport(0, 0, newWidth, newHeight);
            this.resizeFramebuffers(newWidth, newHeight);
        }
        
        console.log(`Canvas resized to: ${newWidth}x${newHeight} (display: ${rect.width}x${rect.height})`);
    }
    
    resizeFramebuffers(width, height) {
        if (!this.gl || !this.framebuffers.length) return;
        const gl = this.gl;
        for (let i = 0; i < this.textures.length; i++) {
            gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        for (let i = 0; i < this.framebuffers.length; i++) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[i]);
            const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                console.error(`Framebuffer ${i} incomplete after resize:`, status);
            }
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    debouncedResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.resize();
            this.resizeTimeout = null;
        }, this.resizeDebounceDelay);
    }
    
    setPresetParams(params) {
        this.presetParams = params;
    }
    
    getFPS() {
        return Math.round(this.fps);
    }
    
    getRenderScale() {
        return Math.round(this.renderScale * 100);
    }

    destroy() {
        const gl = this.gl;
        
        // Clear resize timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        
        // Delete WebGL resources
        if (gl) {
            // Delete framebuffers and textures
            this.framebuffers.forEach(fb => {
                if (fb) gl.deleteFramebuffer(fb);
            });
            this.textures.forEach(tex => {
                if (tex) gl.deleteTexture(tex);
            });
            
            // Delete audio texture
            if (this.audioTexture) {
                gl.deleteTexture(this.audioTexture);
            }
            
            // Delete shader program
            if (this.program) {
                gl.deleteProgram(this.program);
            }
            
            // Lose context
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
                loseContext.loseContext();
            }
        }
        
        // Clear references
        this.framebuffers = [];
        this.textures = [];
        this.audioTexture = null;
        this.program = null;
        this.gl = null;
        this.uniforms = {};
        this.presetParams = {};
        this.contextLossHandlers = [];
        
        console.log('ShaderEngine destroyed');
    }
}
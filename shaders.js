const MAX_SHADER_PRESETS = 100;

class ShaderDefinitions {
    static shaderFiles = [
        'barCode.js',
        'lattice.js',
        'glitch-cathedral.js',
        'liquid-chrome.js',
        'neural-network.js',
        'plasma-storm.js',
        'geometric-tunnel.js',
        'frida.js'
    ];

    static filenameToClassName(filename) {
        // Remove .js extension
        const base = filename.replace('.js', '');
        // Convert kebab-case to PascalCase, then capitalize first letter
        const pascal = base.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const capitalized = pascal.charAt(0).toUpperCase() + pascal.slice(1);
        return capitalized + 'Shader';
    }

    static filenameToDisplayName(filename) {
        // Remove .js extension
        const base = filename.replace('.js', '');
        // Convert kebab-case to spaces, then handle camelCase
        return base
            .replace(/-/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, s => s.toUpperCase())
            .trim();
    }

    static getPresetShaders() {
        const availableShaders = [];
        
        this.shaderFiles.forEach(filename => {
            const className = this.filenameToClassName(filename);
            const ShaderClass = window[className];
            
            if (typeof ShaderClass !== 'undefined' && ShaderClass.getDefinition) {
                const def = ShaderClass.getDefinition();
                // Only add if it has valid fragmentShader
                if (def.fragmentShader) {
                    // Derive name from filename and format it nicely
                    def.name = this.filenameToDisplayName(filename);
                    availableShaders.push(def);
                } else {
                    console.warn(`Shader '${className}' has no fragmentShader - skipping`);
                }
            } else {
                console.warn(`Shader class '${className}' (from ${filename}) not available`);
            }
        });
        
        if (availableShaders.length === 0) {
            console.error('No shader classes available, creating fallback shader');
            availableShaders.push({
                name: 'Fallback',
                thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYWxsYmFjazwvdGV4dD48L3N2Zz4=',
                params: { ...DEFAULT_SHADER_PARAMS },
                fragmentShader: this.getFallbackShader()
            });
        }
        
        return availableShaders;
    }
    
    static getFallbackShader() {
        return `
            #version 300 es
            precision highp float;

            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_bass;
            uniform float u_mid;
            uniform float u_treble;
            uniform sampler2D u_prev_frame;
            uniform sampler2D u_spectrum;
            uniform float u_speed;
            uniform float u_intensity;
            uniform float u_scale;
            uniform float u_complexity;

            // Defaults for missing sliders
            #define u_amplitude 1.0
            #define u_glow 1.0
            #define u_colorShift 0.0
            #define u_distortion 0.0
            #define u_rotation 0.0
            #define u_frequency 1.0
            #define u_symmetry 0.0
            #define u_turbulence 0.0
            #define u_feedback 0.0
            #define u_decay 0.95

            out vec4 fragColor;

            #define MIN_DIVISOR 0.001
            #define MIN_RADIUS 0.002

            float safeRadius(vec2 p) {
                return max(length(p), MIN_RADIUS);
            }

                    float random(vec2 st) {
                        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                    }

                    float noise(vec2 p) {
                        vec2 i = floor(p);
                        vec2 f = fract(p);
                        vec2 u = f * f * (3.0 - 2.0 * f);
                        return mix(mix(random(i + vec2(0.0,0.0)), 
                                    random(i + vec2(1.0,0.0)), u.x),
                                mix(random(i + vec2(0.0,1.0)), 
                                    random(i + vec2(1.0,1.0)), u.x), u.y);
                    }

                    vec2 rotate(vec2 p, float angle) {
                        float c = cos(angle);
                        float s = sin(angle);
                        return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
                    }

                    // Frequency texture sampler helper
                    float getFreq(float f) {
                        // Clamp to avoid texture edge artifacts
                        float freq = clamp(f, 0.01, 0.99);
                        float freqValue = texture(u_spectrum, vec2(freq, 0.0)).r;
                        
                        // Fallback: create demo pattern when no audio (spectrum is all zeros)
                        // This creates a gentle wave pattern so effects are visible in preview
                        float demo = 0.3 + 0.2 * sin(freq * 10.0 + u_time * 2.0) 
                                        + 0.15 * sin(freq * 25.0 + u_time * 3.0);
                        
                        // Mix between real audio and demo based on audio level
                        float audioLevel = freqValue;
                        return mix(demo, freqValue, step(0.01, audioLevel));
                    }
                    

                            vec3 palette(float t) {
                                return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
                            }

                    vec3 blend_Add(vec3 base, vec3 blend, float opacity) {
                        return mix(base, base + blend, opacity);
                    }
                    vec3 blend_Screen(vec3 base, vec3 blend, float opacity) {
                        return mix(base, 1.0 - (1.0 - base) * (1.0 - blend), opacity);
                    }
                    vec3 blend_Overlay(vec3 base, vec3 blend, float opacity) {
                        return mix(base, mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(0.5, base)), opacity);
                    }
                    vec3 blend_SoftLight(vec3 base, vec3 blend, float opacity) {
                        return mix(base, mix(
                            2.0 * base * blend + base * base * (1.0 - 2.0 * blend), 
                            sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend), 
                            step(0.5, blend)
                        ), opacity);
                    }
                    vec3 blend_Difference(vec3 base, vec3 blend, float opacity) {
                        return mix(base, abs(base - blend), opacity);
                    }
                    vec3 blend_Exclusion(vec3 base, vec3 blend, float opacity) {
                        return mix(base, base + blend - 2.0 * base * blend, opacity);
                    }
                    

                    vec3 applyGlobalEffects(vec3 color, vec2 uv) {
                        // Placeholder
                        return color;
                    }
                    
                    float fbm(vec2 p, int octaves) {
                        float value = 0.0;
                        float amplitude = 0.5;
                        for(int i = 0; i < octaves; i++) {
                            value += amplitude * noise(p);
                            p *= 2.0;
                            amplitude *= 0.5;
                        }
                        return value;
                    }
                    
                    float fbm(vec2 p) {
                        return fbm(p, int(u_complexity * 4.0 + 2.0));
                    }
                    

            void main() {
                // 1. Base Coordinates
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
                vec2 initialUV = uv; 

                // 2. Global Camera Transforms
                uv /= (u_scale * 0.5 + 0.1 + u_bass * 0.05);
                
                // Dynamic Param modifiers
                

                vec2 currentUV = uv; 

                vec3 finalColor = vec3(0.0);
                vec3 layerColor = vec3(0.0);

                // 3. Render Pipeline
                
                // --- Layer 1: Spectrum Analyzer ---
                {
                    currentUV = uv;
                    vec2 layerUV = currentUV;
                    float localTime = u_time * u_speed * 0.18;
                    
                        vec2 p = layerUV;
                        
                        // Create scrolling effect
                        float scrollSpeed = (0.5 * (0.1 + u_treble * 0.1));
                        float scrollY = fract(p.y + localTime * scrollSpeed);
                        
                        // Get frequency based on X position
                        float fIndex = abs(p.x);
                        float val = getFreq(fIndex);
                        
                        // Current bar (most recent, at top)
                        float barIntensity = smoothstep(0.02, 0.0, abs(scrollY - (0.95 * (0.8 + u_treble * 0.5)))) * val;
                        
                        // Add fading trail effect
                        float trail = 0.0;
                        for(float i = 1.0; i < 8.0; i++) {
                            float trailY = fract(scrollY - i * (0.12 * (0.8 + u_treble * 0.5)));
                            float trailFreq = getFreq(fIndex + i * (0.001 * (0.1 + u_treble * 0.1))); // Slight frequency shift for variation
                            trail += smoothstep((0.5 * u_intensity), 0.0, abs(trailY - 0.95)) * trailFreq * (1.0 - i * 0.1);
                        }
                        
                        // Color based on frequency position (bass = left, treble = right)
                        vec3 layerColor = palette(fIndex + p.y * 0.5) * barIntensity;
                        layerColor += palette(fIndex * 0.5 + 0.5) * trail * 0.6;
                        
                        // Add bass glow
                        layerColor += vec3(0.8, 0.2, 0.4) * barIntensity * u_treble * 0.3;
                        
                    layerColor *= u_amplitude * (0.5 + u_treble * 0.4);
                    finalColor = layerColor;
                }

                // --- Layer 2: Fractal Patterns ---
                {
                    currentUV += (vec2(finalColor.r, finalColor.g) - 0.01) * 0.1 * (0.1 + u_bass);
                    vec2 layerUV = currentUV;
                    float localTime = u_time * u_speed * 0.81;
                    
                        vec2 p = layerUV;
                        p = p / (u_scale + (0.1 * (0.8 + u_mid * 0.5))) - vec2(0.7, 0.0); 
                        vec2 c = p;
                        vec2 z = vec2(0.0);
                        float iter = 0.0;
                        for(int i=0; i < int(float(8) * u_complexity); i++) {
                            z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
                            if(length(z) > 2.0) break;
                            iter += 1.0;
                        }
                        vec3 layerColor = palette(iter/8.0 + localTime * 0.2) * u_mid;
                        
                    layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
                    finalColor = blend_Overlay(finalColor, layerColor, 0.5 + u_mid * 0.2);
                }

                // --- Layer 3: Fluid Dynamics ---
                {
                    currentUV += (vec2(finalColor.r, finalColor.g) - 0.01) * 0.1 * (0.1 + u_bass);
                    vec2 layerUV = currentUV;
                    float localTime = u_time * u_speed * 0.83;
                    
                        float d = length(layerUV);
                        float u = noise(layerUV * 5.0 + localTime);
                        float v = noise(layerUV * 10.0 - localTime);
                        float f = 0.5 + 0.5 * sin(10.0 * (u - v));
                        vec3 layerColor = mix(vec3((0.1 * u_complexity), 0.0, 0.2), vec3(0.0, 1.0, 0.8), f) * (1.0-d);
                        
                    layerColor *= u_amplitude * (0.8 + u_treble * 0.4);
                    finalColor = blend_Overlay(finalColor, layerColor, 0.5 + u_treble * 0.2);
                }


                // 4. Post Processing
                finalColor *= 1.0 + u_bass * 0.15;
                finalColor += max(vec3(0.0), finalColor * finalColor) * u_glow * 0.5;
                finalColor.rgb = mix(finalColor.rgb, finalColor.gbr, sin(u_colorShift * 2.0 + u_time) * 0.5 + 0.5);
                finalColor *= u_intensity;

                // 5. Feedback Trail (Fixed Box & Brightness)
                
                vec2 screenUV = gl_FragCoord.xy / u_resolution.xy;
                
                // 1. STATIONARY SAMPLING (Attached Trails)
                // No zoom, just a tiny bit of bass-driven diffusion to smooth the light
                vec2 diff = (vec2(random(screenUV + u_time), random(screenUV - u_time)) - 0.5) * 0.002 * u_bass;
                vec3 prevColor = texture(u_prev_frame, screenUV + diff).rgb;

                // 2. BORDER FADE (Fix Grey Box)
                vec2 border = smoothstep(vec2(0.0), vec2(0.02), screenUV) * (1.0 - smoothstep(vec2(0.98), vec2(1.0), screenUV));
                prevColor *= border.x * border.y;

                // 3. DECAY
                float dcAmount = 0.95; 
                #ifdef u_decay
                    dcAmount = u_decay;
                #endif

                // 4. FEEDBACK AMOUNT
                float fbAmount = 0.0;
                #ifdef u_feedback
                    fbAmount = u_feedback;
                #endif

                // --- RESTORED TRIGGER LOGIC ---
                // Automatically enable trails on high energy
                float volume = (u_bass + u_mid + u_treble) / 3.0;
                
                if(volume > 0.7) {
                    // Force feedback ON during high energy
                    fbAmount = max(fbAmount, 0.85);
                    // Make trails last slightly longer during the hit
                    dcAmount = max(dcAmount, 0.96);
                }

                // Apply Decay
                prevColor *= dcAmount;

                // 5. BLEND (Max = Light Painting)
                vec3 trails = max(finalColor, prevColor);
                finalColor = mix(finalColor, trails, clamp(fbAmount, 0.0, 1.0));
                    

                fragColor = vec4(max(vec3(0.0), finalColor), 1.0);
            }`;
    }
}

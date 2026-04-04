/* Auto-generated custom shader - Chimera */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class ChimeraShader {
    static getDefinition() {
        return {
            name: 'Chimera',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: 1, intensity: 0.9, scale: 1.1, glow: 0.4, feedback: 0.99 },
            fragmentShader: this.getShaderCode()
        };
    }

    static getShaderCode() {
        return `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_beat;
uniform sampler2D u_prev_frame;
uniform sampler2D u_spectrum;
uniform float u_speed;
uniform float u_intensity;
uniform float u_scale;
uniform float u_glow;
uniform float u_feedback;

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_complexity 1.0
#define u_colorShift 0.0
#define u_distortion 0.0
#define u_rotation 0.0
#define u_frequency 1.0
#define u_symmetry 0.0
#define u_turbulence 0.0


out vec4 fragColor;


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
            return texture(u_spectrum, vec2(clamp(f, 0.01, 0.99), 0.0)).r;
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
            return fbm(p, 4);
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
    
    // --- Layer 1: Plasma Waves ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.22;
        
            vec2 p = layerUV * 2.0;
            vec2 v = p;
            float l = 0.0;
            vec3 c = vec3(0.0);
            l = abs((0.7 * (0.8 + u_mid * 0.5)) - dot(p,p));
            v = p * (1.0 - l) / 0.2;
            for(float i=0.0; i<(8.0 * (0.8 + u_mid * 0.5)); i++) {
                c += (sin(vec3(v.x, v.y, v.y) * 2.0) + 1.0) * abs(v.x - v.y) * 0.2 + (u_mid * 1.5);
                v += cos(v.yx * i + vec2(0.0, i) + localTime) / (i + 1.0) + 0.7;
            }
            vec3 glow = exp(p.y * vec3(1.0, -1.0, -(2.0 * u_scale))) * exp(-4.0 * l);
            // SAFE: max(c, (0.1 * u_scale)) correct order
            vec3 layerColor = tanh(glow / max(c, 0.1)) * (1.0 + u_mid);
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Particle System ---
    {
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.52;
        
            vec3 col = vec3(0.0);
            for(float i=0.0; i<8.0; i++) {
                 float t = localTime + i * (0.5 * u_glow);
                 vec2 p = vec2(cos(t), sin(t)) * (0.2 + i * 0.05);
                 float d = length(layerUV - p);
                 col += palette(i*(0.1 * (0.8 + u_mid * 0.5))) * (0.01 / d);
            }
            vec3 layerColor = col;
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = blend_Screen(finalColor, layerColor, 0.5 + u_mid * 0.2);
    }

    // --- Layer 3: Cosmic Space ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.36;
        
            float n = fbm(layerUV * 3.0 + localTime * (0.1 * u_scale), 4);
            float core = 1.0 / (length(layerUV) + (0.1 * (0.8 + u_mid * 0.5)));
            vec3 layerColor = palette(n * (2.0 * u_glow)) * n * core * 0.5;
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = blend_Screen(finalColor, layerColor, 0.5 + u_mid * 0.2);
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
    
    if(volume > 0.7 || u_beat > 0.9) {
        // Force feedback ON during the beat
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
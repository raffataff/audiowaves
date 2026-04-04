/* Auto-generated custom shader - Krea */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class KreaShader {
    static getDefinition() {
        return {
            name: 'Krea',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: -0.2, intensity: 1.5, complexity: 0.6 },
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
uniform float u_complexity;

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_glow 1.0
#define u_colorShift 0.0
#define u_distortion 0.0
#define u_rotation 0.0
#define u_scale 1.0
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
                    vec3 a = vec3(0.5, 0.5, 0.5);
                    vec3 b = vec3(0.5, 0.5, 0.5);
                    vec3 c = vec3(2.0, 1.0, 0.0);
                    vec3 d = vec3(0.5, 0.2, 0.25);
                    return a + b * cos(6.28318 * (c * t + d));
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
    
    
    // Dynamic Param modifiers
    

    vec2 currentUV = uv; 

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline
    
    // --- Layer 1: Fractal Patterns ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.0;
        
            vec2 p = layerUV * 10.0;
            vec3 col = vec3(0.0);
            float t = localTime;
            for(float i=0.0; i<10.0; i++) {
                vec3 pal = cos(p.x + vec3((1.0 * u_intensity), 1.0, 0.0)) + 1.0 * u_bass;
                vec2 distortion = sin(p + t).yx;
                float d = length(sin(p + distortion + u_mid * 0.7));
                col += pal / max((0.001 * u_intensity), d - u_mid * 0.15) / 0.2;
                p *= mat2((0.8 * (0.8 + u_mid * 0.1)), -0.6, 0.6, 0.8);
            }
            vec3 layerColor = tanh(col * col / 20000.0);
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = layerColor;
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
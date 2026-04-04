/* Auto-generated custom shader - Kosmik */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class KosmikShader {
    static getDefinition() {
        return {
            name: 'Kosmik',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: -2, intensity: 0.8, symmetry: 2.7 },
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
uniform float u_symmetry;

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_glow 1.0
#define u_complexity 1.0
#define u_colorShift 0.0
#define u_distortion 0.0
#define u_rotation 0.0
#define u_scale 1.0
#define u_frequency 1.0
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
                    return mix(vec3(0.0, 0.3, 0.8), vec3(0.0, 0.8, 0.6), t);
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
    
                if (u_symmetry > 0.5) {
                    float sides = floor(u_symmetry * 2.0 + 2.0);
                    float a = atan(uv.y, uv.x);
                    float r = length(uv);
                    a = mod(a, 6.28318 / sides);
                    a = abs(a - 3.14159 / sides);
                    uv = r * vec2(cos(a), sin(a));
                }
            
    
    // Dynamic Param modifiers
    

    vec2 currentUV = uv; 

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline
    
    // --- Layer 1: Cosmic Space ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.48;
        
            float n = fbm(layerUV * 3.0 + localTime * (0.1 * u_intensity), 4);
            float core = 1.0 / (length(layerUV) + 0.1);
            vec3 layerColor = palette(n * 2.0) * n * core * 0.5;
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Geometric Shapes ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.60;
        
            vec2 p = layerUV * 5.0;
            vec2 q = vec2( p.x * 2.0*(0.5773503 * u_intensity), p.y + p.x*(0.5773503 * u_symmetry) );
            vec2 pi = floor(q);
            vec2 pf = fract(q);
            float v = mod(pi.x + pi.y, (2.0 * u_intensity));
            float ca = step(1.0, max(abs(pf.x-(0.5 * (0.8 + u_beat * 0.5)))*(1.5 * u_intensity) + abs(pf.y-0.5), abs(pf.y-0.5)*2.0));
            vec3 layerColor = vec3(ca) * palette(pi.x*(0.1 * (0.8 + u_beat * 0.5)) + localTime);
            
        layerColor *= u_amplitude * (0.8 + u_beat * 0.4);
        finalColor = blend_Difference(finalColor, layerColor, 0.5 + u_beat * 0.2);
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
/* Auto-generated custom shader - Humma */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class HummaShader {
    static getDefinition() {
        return {
            name: 'Humma',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { intensity: 0.8, distortion: -0.6 },
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
uniform float u_intensity;
uniform float u_distortion;

// Defaults for missing sliders
#define u_speed 1.0
#define u_amplitude 1.0
#define u_glow 1.0
#define u_complexity 1.0
#define u_colorShift 0.0
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
    
                uv += (vec2(
                    noise(uv * 2.0 + u_time * 0.2),
                    noise(uv * 2.0 - u_time * 0.2)
                ) - 0.5) * u_distortion * 0.5;
            
    
    // Dynamic Param modifiers
    

    vec2 currentUV = uv; 

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline
    
    // --- Layer 1: Bio-Digital (Xor) ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * 0.79;
        
            vec3 rayDir = normalize(vec3(layerUV, -1.0));
            vec3 p = vec3(0.0);
            vec3 col = vec3(0.0);
            float z = 0.0;
            float speed = 2.0 + u_beat * 4.0;
            
            for(int i=0; i<30; i++) {
                p = z * rayDir;
                p.z -= localTime * speed;
                float shape = cos(dot(cos(p), sin(p.yzx / 0.6 + 0.1 * sin(p.zxy * 10.0)) * 10.0));
                float d = 0.01 + 0.3 * abs(shape);
                // Safe usage
                float brightness = 1.0;
                #ifdef u_intensity
                    brightness = u_intensity;
                #endif
                vec3 glow = vec3(0.2, 0.2, 0.3) * brightness + palette(z * 0.05 + localTime) * 0.1;
                col += glow / max(0.001, d); 
                z += d;
            }
            vec3 layerColor = tanh(col * 0.002);
            
        layerColor *= u_amplitude * (0.8 + u_beat * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Plasma Waves ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * 1.62;
        
            vec2 p = layerUV * (4.0 * (0.8 + u_beat * 0.5));
            float n = noise(p + localTime * (0.5 * u_distortion));
            n += noise(p * 2.0 - localTime) * 0.5;
            float ring = sin(n * 10.0 + localTime);
            vec3 layerColor = palette(n + u_beat * 0.5) * (0.5 + 0.5 * ring);
            
        layerColor *= u_amplitude * (0.8 + u_beat * 0.4);
        finalColor = blend_Overlay(finalColor, layerColor, 0.5 + u_beat * 0.2);
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
/* Auto-generated custom shader - Rosemary */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class RosemaryShader {
    static getDefinition() {
        return {
            name: 'Rosemary',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: 1.7, intensity: 0.6 },
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

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_glow 1.0
#define u_complexity 1.0
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
                    return mix(vec3(0.2, 0.0, 0.8), vec3(0.8, 0.2, 1.0), sin(t * 3.14159) * 0.5 + 0.5);
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
    
    
    // Dynamic Param modifiers
    

    vec2 currentUV = uv; 

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline
    
    // --- Layer 1: Tunnel Effect ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.90;
        
            vec3 rayDir = normalize(vec3(layerUV, -1.0));
            vec3 p = vec3(0.0);
            vec3 col = vec3(0.0);
            float z = 0.0;
            float t = localTime * (2.0 * u_intensity);
            for(int i=0; i<20; i++) {
                p = z * rayDir;
                vec3 a = p;
                for(float j=2.0; j<7.0; j++) {
                    a -= sin(a * j + t + float(i)).yzx / j;
                }
                vec3 ap = abs(p);
                float d_box = abs(2.0 - max(ap.x, ap.y)); 
                float s = a.z + a.y - t;
                float d_detail = abs(cos(s)) / 7.0;
                float d = d_box + d_detail;
                vec3 pal = cos(vec3(s - z) + vec3(0.0, 1.0, 8.0)) + 1.0;
                col += pal / max((0.001 * u_intensity), d); 
                z += max(0.05, d);
            }
            vec3 layerColor = tanh(col * (0.005 * u_intensity));
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Fractal Patterns ---
    {
       currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.57;
        
            vec2 p = layerUV * (2.0 * u_intensity);
            float a = 0.0;
            for(int i=0; i<4; i++) {
                p = abs(p) / dot(p,p) - (0.5 * (0.8 + u_treble * 0.5));
                p = rotate(p, localTime * (0.2 * u_intensity));
                a += length(p);
            }
            vec3 layerColor = palette(a * (0.2 * u_intensity) + u_treble) * (((1.5 * u_intensity) * u_treble) + (0.5 * (0.8 + u_treble * 0.5)) * sin(a));
            
        layerColor *= u_amplitude * (0.8 + u_treble * 0.4);
        finalColor = blend_Add(finalColor, layerColor, 0.5 + u_treble * 0.2);
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
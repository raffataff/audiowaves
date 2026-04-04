/* Auto-generated custom shader - Krazey */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class KrazeyShader {
    static getDefinition() {
        return {
            name: 'Krazey',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: 0.9, intensity: 3.1, decay: 0.99 },
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
uniform float u_decay;

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
    
    // --- Layer 1: Bio-Digital (Xor) ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.61;
        
            vec3 p = vec3(0.0);
            vec3 v = vec3(1.0, 2.0, 6.0);
            vec3 col = vec3(0.0);
            vec3 rayDir = normalize(vec3(layerUV, -1.0));
            float z = 0.0;
            float d = 0.0;
            float f = 0.0;
            
            float t = localTime * 2.0 + u_mid * 1.50;

            for(float i=0.0; i<50.0; i++) {
                p = z * rayDir;
                float rotArg = (p.y + sin(p.y)) * 0.4;
                float c = cos(rotArg);
                float s = sin(rotArg);
                p.xz *= mat2(c, -s, s, c);
                p.x += t;
                
                vec3 distVec = cos(p / v) * v + vec3(v.z, v.x, v.x) / 7.0;
                d = length(distVec);
                
                f = 2.0 + d / exp(p.y * (0.5 * u_mid));
                z += d / f;
                
                vec3 pal = cos((vec3(p.x) + z + v) * 0.1) + (1.0 + u_mid * 0.2);
                // SAFE: Ensure max is at least 0.001 regardless of bass
                col += pal / max(0.001, d * f * z);
            }
            
            layerColor = tanh(col * 0.1 + u_mid * 0.1);
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Fractal Patterns ---
    {
        currentUV = initialUV;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.85;
        
            vec2 p = layerUV * 1.5;
            vec2 c = vec2(sin(localTime*0.3), cos(localTime*0.4));
            float i_val = 0.0;
            for(int i=0; i<6; i++) {
                p = vec2(p.x*p.x - p.y*p.y, 2.0*p.x*p.y) + c;
                if(length(p) > 4.0) break;
                i_val += 1.0;
            }
            vec3 layerColor = palette(i_val * (0.1 * u_intensity) + localTime);
            
        layerColor *= u_amplitude * (0.8 + u_beat * 0.4);
        finalColor = blend_Overlay(finalColor, layerColor, 0.5 + u_beat * 0.2);
    }

    // --- Layer 3: Lightning & Electric ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.75;
        
            float r = length(layerUV);
            float a = atan(layerUV.y, layerUV.x);
            float f = getFreq(abs(a) / 3.14159);
            float n = noise(layerUV * (10.0 * (0.8 + u_beat * 0.5)) + localTime * 5.0);
            float bolt = abs(a - (floor(a * 8.0) / 8.0) - sin(r * (20.0 * (0.8 + u_beat * 0.5)) + n * 5.0) * (0.05 * (0.8 + u_beat * 0.5)));
            float intensity = 0.01 / (bolt + 0.001) * f * 2.0;
            intensity *= smoothstep(f + (0.1 * u_intensity), f, r);
            vec3 layerColor = vec3((0.6 * u_intensity), (0.8 * u_intensity), 1.0) * intensity;
            layerColor += palette(f + localTime) * intensity * 0.5;
            
        layerColor *= u_amplitude * (0.8 + u_beat * 0.4);
        finalColor = blend_Screen(finalColor, layerColor, 0.5 + u_beat * 0.2);
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
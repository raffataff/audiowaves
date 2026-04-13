/* Auto-generated custom shader - Lattice */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class LatticeShader {
    static getDefinition() {
        return {
            name: 'Lattice',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MYXR0aWNlPC90ZXh0Pjwvc3ZnPg==',
            params: { speed: -0.5, intensity: 0.7, scale: 0.41, colorShift: 4.1 },
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
uniform sampler2D u_prev_frame;
uniform sampler2D u_spectrum;
uniform float u_speed;
uniform float u_intensity;
uniform float u_scale;
uniform float u_colorShift;

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_glow 1.0
#define u_complexity 1.0
#define u_distortion 0.0
#define u_rotation 0.0
#define u_frequency 1.0
#define u_symmetry 0.0
#define u_turbulence 0.0
#define u_feedback 0.50
#define u_decay 0.85

out vec4 fragColor;

        vec3 tanh3(vec3 x) {
            x = clamp(x, -3.0, 3.0);
            return (exp(x) - exp(-x)) / (exp(x) + exp(-x));
        }

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
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
    
    // --- Layer 1: Fluid Dynamics [Reef] ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.24;
        
            vec3 rayDir = normalize(vec3(layerUV, -1.0));
            vec3 p = vec3(0.0);
            vec3 col = vec3(0.0);
            float z = 0.0;
            float d = 0.0;
            
            // Audio reactive time 
            float t = localTime + u_mid * 1.5;

            for(float i = 1.0; i <= (30.0 * u_intensity); i++) {
                p = z * rayDir;
                
                // Inner volumetric distortion loop
                for(float j = 1.0; j <= 3.0; j++) {
                    p += (0.4 * u_scale) * sin(p.yzx * j - z + t + i) / j + (0.5 * (0.8 + u_mid * 0.5));
                }
                
                // Shape bounds function
                vec4 distVec = vec4(abs(p.y + p.z * 0.5), sin(p - z) / (7.0 * (0.8 + u_mid * 0.5)));
                d = length(distVec) / (4.0 + z * z / (100.0 * u_scale));
                
                // Original code effectively evaluates z += d *before* color division
                z += d;
                
                vec3 pal = (0.9 * (0.8 + u_mid * 0.5)) + sin(i * 0.1 * u_bass - vec3((6.0 * (0.8 + u_mid * 0.5)), 1.0, 2.0));
                
                // SAFE: Ensure denominator is never pure zero
                float denom = max(0.001, d * d * z);
                
                vec3 glow1 = pal / denom;
                vec3 glow2 = (d * z) / vec3((4.0 * u_scale), 2.0, 1.0); 
                
                col += glow1 + glow2;
            }
            
            float intens = 1.0;
            #ifdef u_intensity
                intens = u_intensity;
            #endif
            
            // Scaled by 2000 as per original (o / 2e3), padded with gentle audio dynamics
            vec3 layerColor = tanh3((col / 2000.0) * intens * (1.0 + u_mid * (0.2 * u_colorShift) / max(0.1, u_time)));
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.8);
        finalColor = layerColor;
    }

    // --- Layer 2: Fractal Patterns [Mainframe] ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.01 ;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.71;
        
            // abs(layerUV) creates the 4-way kaleidoscopic mirroring effect
            // Division by 0.4 in the original is equivalent to multiplying by (2.5 * u_colorShift)
            vec2 p = abs(layerUV) * 2.5;
            vec3 col = vec3(0.0);
            
            // Audio reactive time 
            float t = localTime * 1.0;

            for(float i = 1.0; i <= 9.0; i++) {
                vec2 v = p - i * 0.2;
                
                // Inner structural loop
                for(float f = 1.0; f <= 7.0; f++) {
                    // Calculate grid-like offsets using ceil()
                    // v.yx swizzles the vector to swap X and Y components
                    vec2 cell = ceil(v.yx + i * 0.1) * 9.0 + t;
                    vec2 offset = sin(cell) / f;
                    
                    // Add offset and swap X/Y again to create the weaving matrix effect
                    v = (v + offset).yx;
                }
                
                float l = length(sin(v));
                
                // Color palette (converted from golfed vec4 to standard vec3)
                vec3 pal = cos(i * 0.3 + u_bass * 1.5 + 0.5 - vec3(4.0, (5.0 * (0.8 + u_mid * 0.5)), 6.0)) + u_bass;
                
                // SAFE: Prevent division by zero using max()
                // Original used .02 / l / l which equals .02 / (l * l)
                col += (0.02 * u_scale) * pal / max(0.0001, l * l);
            }
            
            float intens = 1.0;
            #ifdef u_intensity
                intens = u_intensity;
            #endif
            
            // Because we don't have backbuffer trails, we pad the color intensity slightly 
            // and use u_mid to make the data-streams pulse beautifully with the beat.
            vec3 layerColor = max(tanh3(col * intens * (1.2 + u_mid * 0.8)), 0.0);
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.8);
        finalColor = blend_Add(finalColor, layerColor, 0.5 + u_mid * 0.8);
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
    
    if(volume > 0.8) {
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
window['LatticeShader'] = LatticeShader;

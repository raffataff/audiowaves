/* Auto-generated custom shader - Speckers */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class BarCodeShader {
    static getDefinition() {
        return {
            name: 'Speckers',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: 0.8, intensity: 3.7, scale: 0.71, complexity: 0.7 },
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
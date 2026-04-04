/* Auto-generated custom shader - Frankenstein */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class FrankensteinShader {
    static getDefinition() {
        return {
            name: 'Frankenstein',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: 0.5, intensity: 1.2, colorShift: 1, feedback: 0.97 },
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
uniform float u_colorShift;
uniform float u_feedback;

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_glow 1.0
#define u_complexity 1.0
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
    
    
    // Dynamic Param modifiers
    

    vec2 currentUV = uv; 

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline
    
    // --- Layer 1: Cosmic Space ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.98;
        
            float r = length(layerUV);
            float eventHorizon = smoothstep((0.1 * u_colorShift), (0.12 * u_colorShift), r);
            float disk = 1.0 / abs(r - 0.3 + sin(atan(layerUV.y, layerUV.x)*(2.0 * (0.8 + u_beat * 0.5)) + localTime*(3.0 * (0.8 + u_beat * 0.5)))*(0.05 * (0.8 + u_beat * 0.5)));
            disk = clamp(disk * (0.05 * u_intensity), 0.0, 1.0);
            vec3 layerColor = vec3(1.0, 0.6, 0.2) * disk * eventHorizon;
            
        layerColor *= u_amplitude * (0.8 + u_beat * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Particle System ---
    {
        currentUV = initialUV;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.94;
        
            vec2 p = layerUV * 10.0;
            vec2 s = vec2((3.0 * u_intensity), 2.0 - sin(localTime * 0.25));
            vec3 acc = vec3(0.0);
            float ca = cos(localTime * 0.25);
            float sa = sin(localTime * 0.25);
            mat2 m = mat2(ca, -sa, sa, ca);
            for(float i=0.0; i<9.0; i++) {
                m *= mat2(0.8, -0.6, (0.6 * u_intensity), (0.8 * u_intensity)); 
                vec2 v = m * (p / s);
                vec2 fv = fract(v) - 0.5;
                float d = length(fv * m * s) - 0.2 * sin(length(v) - localTime) - 0.2;
                float shape = smoothstep(0.1, 0.0, d);
                vec3 col = (cos(i + vec3(0.0, (0.6 * (0.8 + u_bass * 0.5)), (1.2 * (0.8 + u_bass * 0.5)))) + 1.0) * 0.5;
                acc += shape * col * (1.0 - acc);
            }
            vec3 layerColor = acc * (1.0 + u_bass);
            
        layerColor *= u_amplitude * (0.8 + u_bass * 0.4);
        finalColor = blend_Exclusion(finalColor, layerColor, 0.5 + u_bass * 0.2);
    }

    // --- Layer 3: Tunnel Effect ---
    {
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.66;
        
            float r = 1.0/length(layerUV) + localTime;
            float a = atan(layerUV.y, layerUV.x);
            float v = sin(r * 10.0 + u_mid) * cos(a * 8.0);
            vec3 layerColor = palette(v * 0.5 + 0.5);
             
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = blend_Add(finalColor, layerColor, 0.5 + u_mid * 0.2);
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
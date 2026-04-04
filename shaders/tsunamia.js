/* Auto-generated custom shader - Tsunamia */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class TsunamiaShader {
    static getDefinition() {
        return {
            name: 'Tsunamia',
            thumbnail: 'data:image/jpeg;base64,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',
            params: { speed: -0.1, intensity: 1.7, scale: 0.1, colorShift: 0.5, symmetry: 6 },
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
uniform float u_colorShift;
uniform float u_symmetry;

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_glow 1.0
#define u_complexity 1.0
#define u_distortion 0.0
#define u_rotation 0.0
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
    
    // --- Layer 1: Geometric Shapes ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.76;
        
            vec3 p = vec3(0.0);
            vec3 v = vec3(0.0);
            vec3 rayDir = normalize(vec3(layerUV, -1.0));
            vec4 o = vec4(0.0);
            float z = 0.0;
            float d = 0.0;
            v = normalize(cos(localTime * 0.25 + vec3(0.0, 1.0, 4.0)));
            for(float i=0.0; i<40.0; i++) {
                p = z * rayDir;
                float dotP = dot(v, p);
                p = dotP * v + cross(v, p);
                p.z -= localTime;
                vec3 folded = abs(fract(p) - (0.5 * u_intensity));
                p += folded.yzx - (z * 0.7);
                d = 0.3 * length(min(p, p.yzx));
                vec4 colShift = cos(i * 0.5 + localTime + vec4(0.0, 1.0, 3.0, 0.0)) + 1.0;
                o += colShift / max(0.001, d);
                z += d;
            }
            vec3 layerColor = tanh(o.rgb / 2000.0) * (1.0 + u_bass);
            
        layerColor *= u_amplitude * (0.8 + u_bass * 0.8);
        finalColor = layerColor;
    }

    // --- Layer 2: Fractal Patterns ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.12;
        
            vec2 p = layerUV;
            p = p / (u_scale + 0.51 + u_bass) - vec2(0.7, 0.0); 
            vec2 c = p;
            vec2 z = vec2(0.0);
            float iter = 0.0;
            for(int i=0; i<8; i++) {
                z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
                if(length(z) > 2.0) break;
                iter += 1.0;
            }
            vec3 layerColor = palette(iter/8.0 + localTime * (0.2 * (0.8 + u_mid * 0.9))) ;
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = blend_Overlay(finalColor, layerColor, 0.5 + u_mid * 0.2);
    }

    // --- Layer 3: Wave Patterns ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 + (0.10 * u_treble);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * .43;
        
             float scan = sin(layerUV.y * 100.0 + localTime * 10.0);
             float wave = sin(layerUV.x * 5.0 + localTime) * 0.2;
             float beam = smoothstep((0.01 * (0.8 + u_mid * 0.5)), 0.0, abs(layerUV.y - wave));
             vec3 layerColor = vec3((0.2 * (0.8 + u_treble * 0.5)), 1.0, 0.2) * (beam + scan * 0.1);
             
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = blend_Overlay(finalColor, layerColor, 0.5 + u_mid * 0.2);
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
    
    if(volume > 0.6) {
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
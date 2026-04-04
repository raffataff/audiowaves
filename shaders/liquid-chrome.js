/* @tweakable liquid chrome fluidity factor */
const u_turbulence = 1.0;

/* @tweakable metallic reflection intensity multiplier */
const u_colorShift = 0.8;

class LiquidChromeShader {
    static getDefinition() {
        return {
            name: 'Liquid Chrome',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImMiPjxzdG9wIHN0b3AtY29sb3I9IiNjMGMwYzAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzMDMwMzAiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNjKSIvPjwvc3ZnPg==',
            /* @tweakable update shader parameters to use new turbulence and colorShift uniforms */
            params: { turbulence: u_turbulence, colorShift: u_colorShift },
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
uniform float u_distortion;
uniform float u_symmetry;
uniform float u_turbulence;

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

        // NEW: Frequency texture sampler helper
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
            color += noise(uv * 5.0 + u_time) * u_turbulence * 0.1;
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
    // Normalized pixel coordinates (from -0.5 to 0.5)
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 initialUV = uv; // Keep reference to original for vignetting

    // Apply Control Params (Rotation, Scale, etc.)
    
                vec2 warp = vec2(
                    noise(uv * 3.0 + u_time * 0.5),
                    noise(uv * 3.0 - u_time * 0.5)
                );
                uv += (warp - 0.5) * u_distortion * 0.2;
            
    
                if (u_symmetry > 0.5) {
                    float sides = floor(u_symmetry * 2.0 + 2.0);
                    float a = atan(uv.y, uv.x);
                    float r = length(uv);
                    a = mod(a, 6.28318 / sides);
                    a = abs(a - 3.14159 / sides);
                    uv = r * vec2(cos(a), sin(a));
                }
            

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // === RENDER PIPELINE ===
    
    // --- Layer 1: Spectrum Analyzer ---
    {
        vec2 layerUV = uv;
        float localTime = u_time * 1.22;
        
            float dist = length(layerUV);
            float angle = atan(layerUV.y, layerUV.x);
            // Map angle (-PI to PI) to 0-1 frequency range
            float fIndex = abs(angle) / 3.14159; 
            
            // Sample the spectrum
            float val = getFreq(fIndex);
            
            // Create ring
            float ring = smoothstep(0.01, 0.0, abs(dist - (0.2 + val * 0.5)));
            ring += smoothstep(0.2, 0.0, abs(dist - (0.2 + val * 0.5))) * 0.5 * u_bass;
            
            layerColor = palette(fIndex + localTime * 0.2) * ring;
            
        finalColor = layerColor;
    }

    // --- Layer 2: Space Distortion ---
    {
        vec2 layerUV = uv + vec2(sin(u_time * 0.5), cos(u_time * 0.3)) * 0.1;
        layerUV += vec2(finalColor.r - finalColor.b, finalColor.g - finalColor.r) * 0.1 * u_bass;
        float localTime = u_time * 1.52;
        
            float dist = length(layerUV);
            float angle = atan(layerUV.y, layerUV.x);
            angle += sin(dist * 10.0 - localTime) * 0.5 * u_bass;
            layerUV = vec2(cos(angle), sin(angle)) * dist;
            layerColor = vec3(0.0); // Transparent, just mod layerUV
            
        finalColor = blend_SoftLight(finalColor, layerColor, 0.60);
        // Domain Warping: This layer distorts the next
        uv += (vec2(layerColor.r, layerColor.g) - 0.5) * 0.2 * (u_mid + 0.5);
    }

    // Conditional Block triggered by beat
    if(u_beat > 0.7033010767129972) {

        // --- Layer 3: Plasma Waves ---
        {
            vec2 layerUV = uv + vec2(sin(u_time * 0.5), cos(u_time * 0.3)) * 0.1;
            layerUV += vec2(finalColor.r - finalColor.b, finalColor.g - finalColor.r) * 0.1 * u_bass;
            float localTime = u_time * 1.76;
            
            vec2 p = layerUV * 4.0 + vec2(localTime * 0.2, localTime * 0.3);
            float plasma = 0.0;
            for(int i = 0; i < 3; i++) {
                float fi = float(i);
                vec2 cell = vec2(sin(fi * 2.4 + localTime + u_bass), cos(fi * 1.7 + localTime));
                plasma += 1.0 / length(p - cell * 2.0);
            }
            plasma *= 0.3;
            layerColor = palette(plasma + u_treble * 0.4);
            
            finalColor = blend_Exclusion(finalColor, layerColor, 0.64);
        }
    }

    // --- Layer 4: Fractal Patterns ---
    {
        vec2 layerUV = uv;
        float localTime = u_time * 0.70;
        
            vec2 p = layerUV * 1.8;
            vec2 c = p + vec2(u_bass * 0.2, u_mid * 0.2);
            vec2 z = vec2(0.0);
            float fractal = 0.0;
            for(int i = 0; i < 7; i++) {
                z = vec2(abs(z.x)*abs(z.x) - abs(z.y)*abs(z.y), 2.0*abs(z.x)*abs(z.y)) + c;
                fractal += 1.0 / (1.0 + length(z));
            }
            fractal += u_treble * 0.4;
            layerColor = palette(fractal * 0.4 + localTime * 0.15);
            
        finalColor = blend_Difference(finalColor, layerColor, 0.98);
    }

    // --- Layer 5: Tunnel Effect ---
    {
        vec2 layerUV = uv;
        float localTime = u_time * 1.02;
        
            float radius = length(layerUV);
            float angle = atan(layerUV.y, layerUV.x);
            float tunnel = 1.0 / radius + localTime + u_bass * 2.0;
            float pattern = sin(tunnel * 5.0) * cos(angle * 8.0);
            layerColor = palette(pattern * 0.5 + 0.5);
            
        finalColor = blend_Screen(finalColor, layerColor, 0.53);
    }


    // Global Polish
    finalColor *= 1.0 + u_bass * 0.2; // Global pump
    
    // Vignette
    finalColor *= 1.2 - length(initialUV) * 1.0;

    // Beat Flash
    if(u_beat > 0.9) {
        finalColor += 0.1 * palette(u_time);
    }

    // === FEEDBACK LOOP ===
    

    // Final clamp and alpha
    fragColor = vec4(max(vec3(0.0), finalColor), 1.0);
}`;
    }
}
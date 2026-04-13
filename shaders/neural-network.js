class NeuralNetworkShader {
    static getDefinition() {
        return {
            name: 'Neural Network',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImQiPjxzdG9wIHN0b3AtY29sb3I9IiMwMGZmNDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDQwZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNkKSIvPjwvc3ZnPg==',
            params: { scale: 1.0, rotation: 0.1 },
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
uniform float u_scale;
uniform float u_rotation;

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
        
        // Legacy overload
        float fbm(vec2 p) {
            return fbm(p, 4);
        }
        

void main() {
    // 1. Base Coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 initialUV = uv; 

    // 2. Global Camera Transforms (Scale, Rotation, Global Distortion)
    uv = rotate(uv, u_rotation * (1.0 + sin(u_time * 0.5)) + u_time * 0.1);
    uv /= (u_scale * 0.5 + 0.1);

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline (Effects, Frequency, Turbulence, Complexity)
    
    // --- Layer 1: Spectrum Analyzer ---
    {
        vec2 layerUV = uv / 8.0;
        float localTime = u_time * u_speed * 1.17;
        
            float dist = length(layerUV);
            float angle = atan(layerUV.y, layerUV.x);
            float fIndex = abs(angle) / 3.14159; 
            float val = getFreq(fIndex);
            float ring = smoothstep(0.01, 0.0, abs(dist - (0.2 + val * 0.5)));
            ring += smoothstep(0.2, 0.0, abs(dist - (0.2 + val * 0.5))) * 0.5 * u_bass;
            vec3 layerColor = palette(fIndex + localTime * 0.2) * ring;
            
        finalColor = layerColor * u_treble * 12.0;
    }

    // --- Layer 2: Fluid Dynamics ---
    {
        vec2 layerUV = uv;
        layerUV += vec2(finalColor.r - finalColor.g, finalColor.g - finalColor.b) * 0.1 * u_bass;
        float localTime = u_time * u_speed * 1.57;
        
            float d = length(layerUV);
            float u = noise(layerUV * 5.0 + localTime);
            float v = noise(layerUV * 10.0 - localTime);
            float f = 0.5 + 0.5 * sin(10.0 * (u - v));
            vec3 layerColor = mix(vec3(0.1, 0.0, u_mid * 0.7), vec3(0.0, 1.0, 0.8), f) * (1.0-d);
            
        finalColor = blend_Screen(finalColor, layerColor, 0.15);
    }

    // --- Layer 3: Cosmic Space ---
    {
        vec2 layerUV = uv;
        layerUV += vec2(finalColor.r - finalColor.g, finalColor.g - finalColor.b) * 0.1 * u_bass;
        float localTime = u_time * u_speed * 1.87;
        
            float n = fbm(layerUV * 3.0 + localTime * 0.1, 4);
            float core = 1.0 / (length(layerUV) + 0.1);
            vec3 layerColor = palette(n * 1.50 * u_mid) * n * core * 0.5;
            
        finalColor = blend_Difference(finalColor, layerColor, u_mid * 0.8);
    }


    // 4. Post Processing (Glow, Color Shift, Intensity)
    finalColor *= 1.0 + u_bass * 0.2;

    // 5. Feedback Trail (Decay)
    

    fragColor = vec4(max(vec3(0.0), finalColor), 1.0);
}
window['NeuralNetworkShader'] = NeuralNetworkShader;`;
    }
}
window['NeuralNetworkShader'] = NeuralNetworkShader;
}
window['NeuralNetworkShader'] = NeuralNetworkShader;
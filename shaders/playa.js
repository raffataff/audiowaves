/* Auto-generated custom shader - Playa */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class PlayaShader {
    static getDefinition() {
        return {
            name: 'Playa',
            thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABkAGQDASIAAhEBAxEB/8QAGwABAQEBAQEBAQAAAAAAAAAAAAECAwQFBgj/xAArEAACAgEDAgYBBAMAAAAAAAAAAQIRIQMxQRJRBCJhcZHwMhMUgaEFQrH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAYEQEBAQEBAAAAAAAAAAAAAAAAARExQf/aAAwDAQACEQMRAD8A/mBYeTUVmg4ur4K35k0qwgNaulKH5KsXk5p4a4PZ+463XiHKaUXFNSysUv4PFLcLYR5XczwCthGeC9i5i00wnT9AICyTi3F7p0yWB009WUIyUJNKSqSXKNasEtOE1KMupZS49zhZ005qMsxUlWzAzQNNUAKn5WqXew2+mLxWV9+SuUeE175wSK6n04ywiWSWSzi4vgzlBRK+xGjXJYVdSVoDBrddTTaTp/fk1+m+jrVVdGYV1OLdReLfHqEqySlHqVdmjDVDKb/tAEKwDWmrkl3Oi6FpSUk3qcNPAViMG1gE6qAEAwVZwBLK5W1ZC1gA1hO12oPazUVcJLC2fr9yZr+whbRAAqPO7A4FALaDbFCgHuCAC0aksp91ZZQcd+TL2Aj39GLDIBuMnF2myW9iN+X2HARtNFSs58I66LXVnPIVnpM0dd545Lqabi8oDkw9/ctWKwBkGlG+UgDY6a2p1vGEcazTFh7ICVmnjgbblfDEs5+QibMqW6zsZNp9PTJdNp7V/wBAizFrndCLplmlHUai248N8oktk1yBuEumXsfV8f4vS8X4aMlpRhr35nHCa9j4yZuM3HAVeSpWTdpnTSjcqAxTB6v0JcoAx4QuxLDAu6oidAnIF2ZqD8so26ed8Wvr+TBU2mmnTWzCLdxp7rYsXcJRz3+/LE0lK0qTyhFqM03+L39uQMgSVNp7oLagrUWdtKdSTOC3XY3B+an7A1+r8J/kPAS8PD9xor9VKm1/t6/ewPzEdRpUBrWvOOP5ADKFAAjHIAFf4lf4R9GwAjWpnThJ7u4/FHMAEU3PdPuk2AD1ZO3fL3AAJx//2Q==',
            params: { speed: -0.7, intensity: 0.7, colorShift: 2, amplitude: 0.8 },
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
uniform float u_amplitude;

// Defaults for missing sliders
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
                    return mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), t);
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
    
    // --- Layer 1: Lightning & Electric ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.72;
        
            vec2 p = layerUV * (2.0 * u_colorShift);
            p += vec2(noise(p + localTime), noise(p - localTime)) * u_mid;
            float val = 0.0;
            float amp = 1.0;
            for(int i=0; i<5; i++) {
                val += abs(sin(p.x * 5.0 + p.y * (2.0 * u_colorShift) + localTime * 2.0 + noise(p + localTime))) * amp;
                p *= 2.0;
                amp *= (0.5 * (0.8 + u_mid * 0.5));
            }
            float electricity = 0.05 / (val * val + (0.001 * u_amplitude));
            vec3 col = mix(vec3(0.5, 0.1, (0.8 * (0.8 + u_mid * 0.5))), vec3(0.2, (0.8 * (0.8 + u_mid * 0.5)), 1.0), u_mid);
            vec3 layerColor = col * electricity * (1.0 + getFreq(0.5) * 3.0);
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Bio-Digital (Xor) ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.71;
        
            vec3 p = vec3(0.0);
            vec3 v = vec3(1.0, 2.0, 6.0);
            vec3 col = vec3(0.0);
            vec3 rayDir = normalize(vec3(layerUV, -1.0));
            float z = 0.0;
            float d = 0.0;
            float f = 0.0;
            
            float t = localTime * 2.0 + u_bass * 1.50;

            for(float i=0.0; i<50.0; i++) {
                p = z * rayDir;
                float rotArg = (p.y + sin(p.y)) * 0.4;
                float c = cos(rotArg);
                float s = sin(rotArg);
                p.xz *= mat2(c, -s, s, c);
                p.x += t;
                
                vec3 distVec = cos(p / v) * v + vec3(v.z, v.x, v.x) / 7.0;
                d = length(distVec);
                
                f = 2.0 + d / exp(p.y * (0.5 * u_bass));
                z += d / f;
                
                vec3 pal = cos((vec3(p.x) + z + v) * 0.1) + (1.0 + u_bass * 0.2);
                // SAFE: Ensure max is at least 0.001 regardless of bass
                col += pal / max(0.001, d * f * z);
            }
            
            layerColor = tanh(col * 0.1 + u_bass * 0.1);
            
        layerColor *= u_amplitude * (0.8 + u_bass * 0.4);
        finalColor = blend_Difference(finalColor, layerColor, 0.5 + u_bass * 0.2);
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
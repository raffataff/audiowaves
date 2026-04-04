/* Auto-generated custom shader - Geo */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class GeoShader {
    static getDefinition() {
        return {
            name: 'Geo',
            thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABkAGQDASIAAhEBAxEB/8QAHAAAAQQDAQAAAAAAAAAAAAAABgADBAUBAgcI/8QANxAAAQMDAgMEBwYHAAAAAAAAAQACAwQFEQYhEjFBBxNRgSIlMmFxkaEUFUJyscEjM1JiY4LR/8QAGwEAAgMBAQEAAAAAAAAAAAAAAQMCBAUABgf/xAAsEQACAgECAwcDBQAAAAAAAAAAAQIDERIhBDGRBRMiQVFxgRQjYTIzwdHw/9oADAMBAAIRAxEAPwDrDq3HVJlzLXe0qCapI6qFJWEHmvm8KEzdnLB0K33toIDzsiWiq2SAOjdkLizLkWH2lc2jUrqeVvp7eCZCmdUlOvminZiXM6zcqWO4UEsTxlr2kFcx0DRvtldq23vGCYOMeXEP3R/YLvDXxBzHDP4m+Ch1lrEGo6msjGGVFDJG78wwR9M/JbnfRvSvXN7SX58n8lOUcbHijWLvWdR+coRmO6KNYu9a1P5z+qFJTut2leFCBsrUrJKwnBEtgsALYBcEWElsAkgceramUjKq6mfGd1a3SEtJIQ5VvIyvFUpM3LVg1mqiOqjfeJY7moVVLjKqaioIJ3WjXUmZ9jOk6X1U+hq2O49gdxnmu6Wqtp7xbY6mIhwAPlsQR9V45FwdG7IcusdjWtRBc2W+rk/gVHoAk8ndFPue6etcnz/v4e4jVnZnnnWLvW9UP8jv1Qu87oj1ocXytHhK4fVDR5req/QhCMLICwAtwFMkIBONCy1qcaxDIUjTCSfEZwkgHB6+vFGdzhBF1py0nZdkutsy07ZBQJfLU5vF6Oy8Fwl65M9DNK2OqJy+uBBKoax5GUcXK2uyRwoYudoqGsL2xuLfEDkvQ0zizMtgwVqpiM7rNsur6SrjkY4gtIOU1cYXsJDgQqSRzmvWnCKkijJDur5u/vVVMNhJIXjzOVQgZVpdw6QxSH8TR9Nkw2lcI2uxsVYi0opAUWyK1qeZGiDSWlq/Ut4prdbmM7+d4Y0yO4Wj3k/8RHeuzW/WRveVNJ31NnAqaciWI/7DbPuOCrEaLJrUlsRdkIvTJ7gGyI+CkRwHwV2yzTA4Mbh5KdT2WZ2MRn5JEvDzGrfkDzaY45JIzj09OWg92fkkld9H1JaGez5oRgh7ThVNdZ6Wdh4nPbn+3KKCGuG4BCjy0rSCc4HVef4nsKdb10Ya6DKuIcHzwAzNF0s04c6Rz487t4MFTrhSWLTFrnqauCLugMcLwHF5/pAPNb6q1LFZqZwp3APA553XnjXusK66yOFRVSSMaTwtc7IHwVXhKYXS0tuWOnx6+/T1LVkrdOuTwn1L6svPZ5fnVTL7QOs87QXRzUrnESnOw4Q0hvyQ1B2eaVvEFVVWvV1M1kTOINq4zDwYkja4uO+G4kAB2y44A2K5bdat0jnbqlfUSDOHHb3r0/D0Rqw49PL/AHsUJTbe5bXEROttIWuBlaXBw8Bnb910zQejqjVulqSgpre7vjJLKyuER4Wuw0Bj3AeyeE4zyPgCVxZlUS8hxyCiC16jrqJjGU9VLGxvINeQAnwbqecZ9xkJRefLKPTXY52WXTTep47leI44hA13A0PDiSQR0+KKrFpKpsFzllbeooo3uJdHxZDh4EHZc87K+2OgkfDHq2tmgrIozEyr4S9krMbCQDfiB5OAOc78soT1RU3GmrXSx3OlroJCXslpKkSAg+IBy0+5wBTLauKlX9izovIrRjCU2rYHpGp07pW4u4p6SgMp5uiPDk/ALMWg7BHh0dG0j45/deVYdSV0Tv50gPxRRYe0i7W57e6q5OHq0nIPkqvczu8PE7/lZX8jH9r9tHooactEQ4fsEY8klzug7Z2mmb9ro45JermuxnySSH2HF8pi/r5+jC92rIoRkvaPNUN87RGxxObG8Z9y4zXagkIPpn5obuF4e/OXH5rz9PZ9slplN49MvBsTsphvGO4U6s1ZLXPeXPOPiua3WuMjnHK1ra0vJyVSVM5cTut3heFjUsRRRuudjyyPVy5JVZM5SJ35KhyHK04rBWY2HYcpMciidU404UmgJllDOR1VhT18jOTyPNUbHJ9j1DGOQxTaCSK5OPtHKlxVwPVC7JVIjmPiuyyerIWMr/R9pJDbag45pKWsjpQR1FYTndVdRUk5yUzLN71DmlyqcK0jnIU82c7qDM/K2keosjlYjEW2NyOUd5TjymnJqAaDmnGprqnGogNwcJxrk2shBhJDXJ5r1EBTjXKLRJMlh+3NJMBySjgOS0lcVFkJSSUIgZHkKjvKSSaiIy5NuSSU0BmicakkuON1lJJAJkLcJJIBNwUkkkDj/9k=',
            params: { speed: -0.2, intensity: 1.8, scale: 1.1, colorShift: 2.3, frequency: 6.7 },
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
uniform float u_frequency;

// Defaults for missing sliders
#define u_amplitude 1.0
#define u_glow 1.0
#define u_complexity 1.0
#define u_distortion 0.0
#define u_rotation 0.0
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
                    return vec3(0.9, 0.8, 0.8) * (0.5 + 0.5 * cos(6.28318 * t + vec3(0.0, 0.1, 0.2)));
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
    
    // --- Layer 1: Geometric Shapes ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        layerUV *= u_frequency;
        float localTime = u_time * u_speed * 0.51;
        
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
                vec3 folded = abs(fract(p) - 0.5);
                p += folded.yzx - sin(z * 0.7);
                d = 0.3 * length(min(p, p.yzx));
                vec4 colShift = cos(i * 0.2 + localTime + vec4(0.0, 1.0, (3.0 * (0.8 + u_bass * 0.5)), 0.0)) + 1.0;
                o += colShift / max((0.001 * u_colorShift), d);
                z += d;
            }
            vec3 layerColor = tanh(o.rgb / 2000.0) * (1.0 + u_bass);
            
        layerColor *= u_amplitude * (0.8 + u_bass * 0.4);
        finalColor = layerColor;
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
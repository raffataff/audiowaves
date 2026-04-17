/* Auto-generated custom shader - Frida */
/* Save this file to the shaders/ folder and add a script tag in index.html */

class FridaShader {
    static getDefinition() {
        return {
            name: 'Frida',
            thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABkAGQDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAABQYAAwQCAQf/xAA3EAACAQMDAgQEBAQGAwAAAAABAgMABBEFEiExQQYTUWEicZGhFDKBsUJi0fAjM1LB4fEkQ5L/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMEAAX/xAAjEQACAgMBAAEEAwAAAAAAAAAAAQIRAxIhMUETIjJhBHGB/9oADAMBAAIRAxEAPwBFlRNQ09ozg5FfNZo59Ev5FKK0TZVkcZV19DTVoGrAsFJpgurWzvFDzKprM7wy8tMlhzKC0m6o+cWoOpSrZ2FoltHKwMjKSxIHPJPbvj1xRbV7yKKWGxtyPLjATFGLzULHTt0NsiKxGMikC7mb8U0h6ls5/WioucrkjRup+eBnXobcwSrFG6yQjmQ42ueMge4z9j6UsUf1O+trqAyRuWmZAvlsmNndiDnnJz19aCFSOwp4R1VDTpPhwK0WUayXCK+dnJOOpAGcD3PSqSpHUYq62KJKhkwVPB9sjr+lc1aBHoUuJlhjBtt0aPlWQnOCD0/avbxmuII72H/Nj+GQYzkf07VivZkk2LGxYKMbiAN3vj5YH6V3p941o5YLlWGCtQcKVr0d8ZU16qRsLa3SGRxtZwSTg9QM9KN+F7Iwq1zMME9M+ld20un3JEhiRZO/Fd6lqKxxbI8AD0qM5uf2RVWFUu2abm/HnHmpSpJdlmJzUqywJIlqWaTdNHMOacDfP+D4J6UgWTYmUetfRtMtIW09WuJFjDcAscVrlNRVyMmeNtNISLqZpZyznJJrbqGmldJt79CCrnDjuD0z9q48Q6e9jqJixwTuUjuDWhroror206Mw2kRsv8OSCQfbKg/2aFN00U3XKYIhXfwqnIyTgUci0sRra3LQgqEeR1Y4DKqhuoJ65I9qx+HZHS7nVYvOjkjKOvsSOabLa6A1JbJo0FmHe2UMMnKg8575weOOo680maTNMEpMWZ7WC6ScWsEoePLNvPoVBA4/mzn7CsGsWf4S78tUIGO3fkjPU4zTpcyx29ncSx26xSKVijLjggnAzjsOuPagGpXkgtHm8hRcMWt3f0Awc4ycEg+p6VCDlfFwdqLVgC3iM06RoMljgUQtooFvVhvHKxbtrug3EDuQMjP1rHYSpBcM0ill2MuOmc8VxJK0krSN+ZiSapNN2hU1R4rmOf4TxmvLuZmPJojpun+collYLu/KCetYdVgMExU10ZRcq+QfBg3VKgHFSq2LZ7AcSKfem3Ud11HaJy0UVuZdmcB23BeeR6+tJqNimTS7qCeGBJ7gW01u26OUxiQYPUbTwfUe9CS8Yn7DupWgGm6ZLdllYK8ahjluG4B6dAcUvai3lpsBPJ/arda1aO5eGC0UrZ26+WhYgsxySWOOmSScD1rjTY4tT/EQuALjaHiYtjGAcgepPwj/AK5pjdR6ZtHvs/Bj8FwPb6RdXckqQwyzwru38nG8lSByM8cHAP0rTqunpBr00qT7QD5oT0YjPP1P1PrRjS9LiOh2qXTsJH8v/BYjC7SMkDrztGf+aWPFjCS+eWKX42HIDfEGzypA5GMkDOM4z7nO1vJ0zVhnTb+DMt/Nq1pdR3E+3y2zGVG0jB4PFXWMaw2VrH5u55JhIwX/ANg/LsA/+eOnFLUsbQqQsisrcNsP2P8AeKaPCkCTnBHFu6PwcjJxkZz6gH5muy41BX8FnJv+xVurdrW4Mcu0uOuDkD+xVQXg02arpKxeJ5YrgmaCFNxZjzJ9ByfbvjHHWlyEp5jEj4c9OlMna4RdJ8OpozLIAMqY4gytnptTOAPnn6114iO6WEn8xjUn54rZHDa3BkLTMI4yFYFBmRR+Uj/ScDBxQjVLg3N08pGATwPQUsVbX6Gck0YicGpXJ61KtQpWOaI2FhPdK3krnHcnFYol5FHbxBHYwRcbBGZmXnDHIA6fOhJ/CClYHk8yItDICpU8g9jRPwxFv1NJmcJHD8ZJPXAJwPfAP0NYL5/MW3kJLMUwWPfBIH2wP0rm3uZoopIonKpLjeB3x0/enV0Lryj6xY6Yt9rNjqsd1KY5jkRsehAAAHtS7qqs15PduWcmfdjn4QGJwMjgHPArf4Lu5pb7T/w0u2YoFCuSFG0HgdOSQ3Az1PpitWowSmW6tYp/Ks5GLmGNQvGchTgc4I75qePWLe74HH7T+BJuvhgaPKne4fKtngA/Tr060d8KWRurS/tNwXKCQNtJyPt0wapstEe6jmZ/4O4B4Pv9qM6Pa3Nl5XlyRgOHVzgA/EmwYHcj06k/OnyyTWqfRrcVZm8VaSbS9bSluJJZUQSiSQ8vnoo98n60lsCKZ9c1V59RhltpC7QDaszZJIycA5A6Agcjt1PWhGpW6wMihgxMYYkepGcfp0rowaRCU1tR1o+kXV9DLLDgIPh56t34oPfROszBlIYcEGmS1dU3KjussEYaMgHCgJubvjJI6nsO/a7xFp7TzR3ESY8xAzYHTIqbtPoU6fROEJI54qUcGkykZIx7GpS/VQ2yAVqu6ZR70w3dmbqCAq6xyRDHxDIIoNpEJlu1HZQWPyAyfsKI6jeF48jg4xTyi3VDu0C9TKiZIkcuI1wWP8RJJJ+pqmCN33FELBRlsDoKqYktk0etitv4dkZXAeYlSo6nkYJ9gAeP5vaqLiOXfQz4Vu4Ybq0a7JdHlDqiHBDg7lz/AC5X9vfJfT7ae78RFt0jzNK6soGMooJwB7AD/frSlo93PpskkghVnCMi+ZgbG6ZweuOadLDX4rW2S5WKI6nJburzlCpYhASvvwQCe+Mcilmqd0LBpehbWrULoubWP8NFI2JGDckHrnI4+fp9wnmrb6OqTK8vkzs0eWK4wuAvTJHJ44PTBHWiVl4mnktbmK6tbYRCIkqyHLnIG4c98/bjPNC9X1mG3u5IEtUayaMosOCvlt3OT15zz3H60McX4wOTrr6L13aTW88lq8ciTQuVaJh8QYcMCP0rFc78ZfPAonps7NqkUjSbXZipfqUJGN3vgnOK1+NYIYLllt1AVsMdvTOP+avN06RCPffTrT9MOsWluYLgLHtUTREZO4YGQe2QFzjrtGego1qbYmit0OY0ALKp64/v70o+Gb4Ws8iSb/LYfwnGKPRXUXl3ckzsnmDaoAzxnOPsKi8buyE5S3SfgKu7jE7ZOPapVV5/5MxkwW4Az8qlQ+maFRg0W1P4W7mx0QKD7k/0zXklmzx0ft4UtdBVWxvlk3H5AcfvSxf6syTFIMcd6baU5VE1uN9ZhmspEc8cVypZsJk4FE7DVBcSLBcoo38Bvepd2f4a7VNv5sHNXVvj9DqV3NveRWaXEsUggc7RIVOCfn+lWWF+sE8MkvxmI5HHf39f+q16vktdswZcIFYlchlyNmD2PQYH+k0AWmXV0SUEhiuNbkuFCsZWXqFMhIHX+tbbaaSeJZo/Kmnc7CCuScnGMEHJ78evWlZTRbQpHWedIyN8kLKAVDZGOQAe+Ace9MkorhNxT4bLq1lsZPLnjaJx0ypBx64NdzRT3+nDbl2jbGfar9QR5dItCqMFjLJGDnOz9eeTuP61t065j0Xw5LLc8zysPLT1perr6K1rxGPStHaOPdKMMea2XFkx4HQUuzeIbxpSwIC+gpq8PahHqNsc/wCYOCKlOcou34Zc2KX5p2yiGIJGFKA/OpTHFpUlwgeNCR04FSjsiCzCRrMjLY8HotKdiB/jysoZo03gNyM5A5+tSpU/43n+nur2JasjXNvM0u3fEAysqhT1Axx25o+8jXGn208vMmzrUqVd+oWb+0F6teTSxxRO+UHOKHLUqU9URj4WrWmzkaK4SSM4ZTkGpUogHuKVrqaNJsFQmce+KX/EDGXW1hk5iijLKvbgE/7VKlCfJJE8X5AqGdrwyxThCoRmXCgFSB2xWjwjM6amFU/Cw5FSpU8vjKS6un2rQZWSwwMfmJ6ewqVKlYk3R4jfT//Z',
            params: { speed: 1 },
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

// Defaults for missing sliders
#define u_intensity 1.0
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
    
    
    // Dynamic Param modifiers
    

    vec2 currentUV = uv; 

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline
    
    // --- Layer 1: Fractal Patterns ---
    {
        currentUV = uv;
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.0;
        
            vec2 p = layerUV * 2.0;
            float a = 0.0;
            for(int i=0; i<5; i++) {
                p = abs(p) / dot(p,p) - 0.5;
                p = rotate(p + 0.01 + (u_time * 0.00005), localTime * 0.1);
                a += length(p);
            }
            vec3 layerColor = palette(a * 0.2 + u_mid) * ((.5 * u_bass) + 0.5 * sin(a));
            
        layerColor *= u_amplitude * (0.8 + u_treble * 0.4);
        finalColor = layerColor;
    }

    // --- Layer 2: Tunnel Effect ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.59;
        
            vec3 rayDir = normalize(vec3(layerUV, -1.0));
            vec3 p = vec3(0.0);
            vec3 col = vec3(0.0);
            float z = 0.0;
            float t = localTime * 2.0;
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
                col += pal / max(0.001, d); 
                z += max(0.05, d);
            }
            vec3 layerColor = tanh(col * 0.005);
            
        layerColor *= u_amplitude * (0.8 + u_beat * 0.4);
        finalColor = blend_Screen(finalColor, layerColor, 0.5 + u_beat * 0.2);
    }

    // --- Layer 3: Particle System ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.01) * 0.1 * (0.1 + u_bass);
        
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 1.17;
        
            vec3 col = vec3(0.0);
            for(float i=0.0; i<8.0; i++) {
                 float t = localTime + i * 0.5;
                 vec2 p = vec2(cos(t), sin(t)) * (0.2 + i * 0.05);
                 float d = length(layerUV - p);
                 col += palette(i*0.1) * (0.01 / d);
            }
            vec3 layerColor = col;
            
        layerColor *= u_amplitude * (0.8 + u_bass * 0.4);
        finalColor = blend_Difference(finalColor, layerColor, 0.5 + u_bass * 0.2);
    }

    // --- Layer 4: Fluid Dynamics ---
    {
        currentUV += (vec2(finalColor.r, finalColor.g) - 0.01) * 0.1 * (0.1 + u_bass);
        vec2 layerUV = currentUV;
        float localTime = u_time * u_speed * 0.78;
        
            vec2 p = layerUV * 2.0;
            for(int i=1; i<4; i++) {
                float t = localTime * float(i) * 0.2;
                p += vec2(0.7/float(i)*sin(float(i)*p.y + t + 0.3*float(i)) + 0.8, 
                          0.4/float(i)*sin(float(i)*p.x + t + 0.3*float(i) + 1.6));
            }
            vec3 layerColor = vec3(0.5*sin(p.x)+0.5, 0.5*sin(p.y)+0.5, sin(p.x+p.y));
            
        layerColor *= u_amplitude * (0.8 + u_mid * 0.4);
        finalColor = blend_SoftLight(finalColor, layerColor, 0.5 + u_mid * 0.2);
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
window['FridaShader'] = FridaShader;
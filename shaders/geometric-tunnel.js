class GeometricTunnelShader {
    static getDefinition() {
        return {
            name: 'Geometric Tunnel',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImYiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmZmMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjAwZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNmKSIvPjwvc3ZnPg==',
            params: { speed: 1.0, complexity: 1.0 },
            fragmentShader: this.getShaderCode()
        };
    }

    static getShaderCode() {
        return `
#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_beat;
uniform sampler2D u_prev_frame;
uniform float u_distortion;
uniform float u_complexity;
uniform float u_rotation;

// Defaults for missing sliders
#define u_speed 1.0
#define u_amplitude 1.0
#define u_glow 1.0
#define u_intensity 1.0
#define u_colorShift 0.0
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


                vec3 palette(float t) {
                    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
                }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    vec3 color = vec3(0.0);

    
    // Effect 1: Fractal Patterns
    {
        
        vec2 p = uv;
        float fractal = 0.0;
        for(int i = 0; i < 3; i++) {
            p = abs(p) - 0.5;
            p = p * 2.0 - 1.0;
            fractal += exp(-dot(p, p));
        }
        fractal += u_treble + u_beat * 0.5;
        vec3 effectColor = palette(fractal * 0.5 + ((u_time * 0.2) + (u_bass * 0.1)));

        color += effectColor * 0.25;
    }

    // Effect 2: Tunnel Effect
    {
        
        float radius = length(uv);
        float angle = atan(uv.y, uv.x);
        float tunnel = 1.0 / radius + u_time + u_bass * 2.0;
        float pattern = sin(tunnel * 5.0) * cos(angle * 8.0);
        vec3 effectColor = palette(pattern * 0.5 + (0.1 * u_time + (u_treble * 0.1)));

        color += effectColor * 0.25;
    }

    // Effect 3: Wave Patterns
    {
        
        float wave1 = sin(uv.x * 5.0 + u_time + u_bass * 3.0);
        float wave2 = sin(uv.y * 3.0 + u_time * 1.5 + u_mid * 2.0);
        float waves = (wave1 + wave2) * 0.5;
        vec3 effectColor = palette(waves * 0.5 + 0.5 + u_time * 0.1);

        color += effectColor * 0.25;
    }

    // Effect 4: Geometric Shapes
    {
        
        vec2 p = abs(uv);
        float geo = max(p.x, p.y) - 0.3;
        geo = abs(sin(geo * 8.0 + u_time + (u_bass * 0.50)));
        vec3 effectColor = palette(geo + (u_time * 0.15) + (u_treble * 0.2));

        color += effectColor * 0.15;
    }

    // Apply audio reactivity
    color *= 1.0 + u_bass * 0.2 + u_mid * 0.3 + u_treble * 0.3;

    // Beat flash
    color += u_beat * vec3(1.0, 1.0, 1.0) * 0.6;

    // 5. Feedback Trail
    vec2 screenUV = gl_FragCoord.xy / u_resolution.xy;

    // 1. STATIONARY SAMPLING
    vec2 diff = (vec2(random(screenUV + u_time), random(screenUV - u_time)) - 0.5) * 0.002 * u_bass;
    vec3 prevColor = texture(u_prev_frame, screenUV + diff).rgb;

    // 2. BORDER FADE
    vec2 border = smoothstep(vec2(0.0), vec2(0.02), screenUV) * (1.0 - smoothstep(vec2(0.98), vec2(1.0), screenUV));
    prevColor *= border.x * border.y;

    // 3. DECAY
    float dcAmount = u_decay;

    // 4. FEEDBACK AMOUNT
    float fbAmount = u_feedback;

    // Trigger on high energy
    float volume = (u_bass + u_mid + u_treble) / 3.0;

    if(volume > 0.7 || u_beat > 0.9) {
        fbAmount = max(fbAmount, 0.85);
        dcAmount = max(dcAmount, 0.96);
    }

    prevColor *= dcAmount;

    vec3 trails = max(color, prevColor);
    color = mix(color, trails, clamp(fbAmount, 0.0, 1.0));

    fragColor = vec4(color, 1.0);
}`;
    }
}
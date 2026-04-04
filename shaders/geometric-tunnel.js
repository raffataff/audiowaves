/* @tweakable geometric tunnel animation speed factor */
const GEOMETRIC_TUNNEL_SPEED = 1.0;

/* @tweakable geometric pattern complexity multiplier */
const GEOMETRIC_TUNNEL_COMPLEXITY = 1.0;

class GeometricTunnelShader {
    static getDefinition() {
        return {
            name: 'Geometric Tunnel',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImYiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmZmMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjAwZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNmKSIvPjwvc3ZnPg==',
            params: { speed: GEOMETRIC_TUNNEL_SPEED, geometry: GEOMETRIC_TUNNEL_COMPLEXITY },
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

    fragColor = vec4(color, 1.0);
}`;
    }
}
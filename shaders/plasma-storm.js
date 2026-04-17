/* Plasma Storm Shader - Energetic plasma visualization */
class PlasmaStormShader {
    static getDefinition() {
        return {
            name: 'Plasma Storm',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMzMwMDMzIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNmZjAwNjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmZmMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNwcykiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0icmdiYSgyNTUsMjU1LDAsMC4zKSIvPjwvc3ZnPg==',
            params: { intensity: 1.0, turbulence: 0.5 },
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
uniform float u_intensity;
uniform float u_turbulence;

out vec4 fragColor;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 4.0;

    float time = u_time + u_bass * 2.0;

    vec2 turbulence = vec2(
        fbm(p + vec2(time * 0.1, 0.0)),
        fbm(p + vec2(0.0, time * 0.1 + (u_treble * 2.0)))
    ) * u_turbulence;

    p += turbulence;

    float plasma1 = sin(p.x + time);
    float plasma2 = sin(p.y + time * 1.3);
    float plasma3 = sin(p.x + p.y + time * 0.7);
    float plasma4 = sin(sqrt(p.x*p.x + p.y*p.y) + time * 2.0);

    float plasma = (plasma1 + plasma2 + plasma3 + plasma4) * 0.5;
    
    // Calculate lightning
    float lightning = 0.0;
    float volume =( u_bass) + (u_mid * 1.2) + (u_treble * 1.4);
    
    if(volume > 1.70) {
        for(int i = 0; i < 3; i++) {
            vec2 bolt = p + vec2(float(i) * 2.0, sin(time + u_mid + float(i)) * 2.0);
            float dist = abs(bolt.y - sin(bolt.x * 2.0 + time * 5.0 + u_treble) * 0.5);
            lightning += exp(-dist * 50.0) * u_mid * 2.0;
        }
    }
    
    // Read previous frame and apply decay
    vec4 prevFrame = texture(u_prev_frame, uv);
    float prevLightning = prevFrame.a; // Store lightning in alpha channel
    
    // Decay rate - adjust this value to control how fast lightning fades (0.9 = slow, 0.5 = fast)
    float decayRate = 0.95;
    prevLightning *= decayRate;
    
    // Combine new lightning with decayed previous lightning
    lightning = max(lightning, prevLightning);
    
    // Add lightning to plasma
    plasma += lightning;
    plasma = (plasma + 1.0) * 01.2;
    plasma += u_intensity * 0.5;

    vec3 color1 = vec3(0.50, 0.30, 0.5);
    vec3 color2 = vec3(0.5, 0.0, 1.0);
    vec3 color3 = vec3(0.0, 0.5, 0.50);
    vec3 color4 = vec3(1.0, 1.0, 0.0);

    vec3 color;
    if(plasma < 0.25) {
        color = mix(color1, color2, plasma * 4.0);
    } else if(plasma < 0.5) {
        color = mix(color2, color3, (plasma - 0.25) * 4.0);
    } else if(plasma < 0.75) {
        color = mix(color3, color4, (plasma - 0.5) * 4.0);
    } else {
        color = mix(color4, color1, (plasma - 0.75) * 4.0);
    }

    color *= 1.0 + u_mid * 0.5;
    color += vec3(1.0) * u_treble * 0.3;

    float glow = exp(-length(uv - 0.5) * 2.0) * (u_beat * 2.5);
    color += glow * vec3(1.0, 1.0, 0.5);

    // Output color with lightning stored in alpha channel for next frame
    fragColor = vec4(color, lightning);
}
`;
    }
}
window['PlasmaStormShader'] = PlasmaStormShader;

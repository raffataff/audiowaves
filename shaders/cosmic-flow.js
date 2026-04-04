/* @tweakable cosmic flow shader animation speed multiplier */
const COSMIC_FLOW_SPEED_MULTIPLIER = 1.0;

/* @tweakable cosmic flow visual intensity scaling factor */
const COSMIC_FLOW_INTENSITY_SCALE = 1.0;

class CosmicFlowShader {
    static getDefinition() {
        return {
            name: 'Cosmic Flow',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiPjxzdG9wIHN0b3AtY29sb3I9IiMwMGZmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjAwZmYiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==',
            params: { speed: COSMIC_FLOW_SPEED_MULTIPLIER, intensity: COSMIC_FLOW_INTENSITY_SCALE },
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
/* @tweakable cosmic flow animation speed multiplier */
uniform float u_speed;
/* @tweakable cosmic flow visual intensity */
uniform float u_intensity;

out vec4 fragColor;

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    /* @tweakable default fallback values when uniforms are not set */
    float speed = u_speed > 0.0 ? u_speed : 1.0;
    float intensity = u_intensity > 0.0 ? u_intensity : 1.0;

    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.4 * speed + u_bass * 2.0);

        d = sin(d * 8.0 + u_time * speed + u_beat * 10.0) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 1.2);

        finalColor += col * d * (1.0 + u_treble * 2.0) * intensity;
    }

    vec2 prevUV = gl_FragCoord.xy / u_resolution;
    vec3 prevColor = texture(u_prev_frame, prevUV).rgb;
    finalColor = mix(finalColor, prevColor * 0.98, 0.1 + u_mid * 0.3);

    fragColor = vec4(finalColor, 1.0);
}`;
    }
}
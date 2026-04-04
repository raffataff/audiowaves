/* @tweakable shader count for performance vs variety */
const MAX_SHADER_PRESETS = 100;

/* @tweakable default shader parameters */
const DEFAULT_SHADER_PARAMS = {
    speed: 1.0,
    intensity: 1.0,
    glitchIntensity: 0.5,
    architecture: 1.0,
    fluidity: 1.0,
    metallic: 0.8,
    nodeSize: 1.0,
    connectivity: 1.0,
    turbulence: 1.0,
    geometry: 1.0
};

class ShaderDefinitions {
    static getPresetShaders() {
        /* @tweakable error checking for shader class availability before referencing */
        const availableShaders = [];
        
        // Check each shader class and only include if defined
        if (typeof CosmicFlowShader !== 'undefined') {
            availableShaders.push(CosmicFlowShader.getDefinition());
        } else {
            console.warn('CosmicFlowShader not available');
        }
        
        if (typeof GlitchCathedralShader !== 'undefined') {
            availableShaders.push(GlitchCathedralShader.getDefinition());
        } else {
            console.warn('GlitchCathedralShader not available');
        }
        
        if (typeof LiquidChromeShader !== 'undefined') {
            availableShaders.push(LiquidChromeShader.getDefinition());
        } else {
            console.warn('LiquidChromeShader not available');
        }
        
        if (typeof NeuralNetworkShader !== 'undefined') {
            availableShaders.push(NeuralNetworkShader.getDefinition());
        } else {
            console.warn('NeuralNetworkShader not available');
        }
        
        if (typeof PlasmaStormShader !== 'undefined') {
            availableShaders.push(PlasmaStormShader.getDefinition());
        } else {
            console.warn('PlasmaStormShader not available');
        }
        
        if (typeof GeometricTunnelShader !== 'undefined') {
            availableShaders.push(GeometricTunnelShader.getDefinition());
        } else {
            console.warn('GeometricTunnelShader not available');
        }
        
        /* @tweakable ensure at least one shader is available for fallback */
        if (availableShaders.length === 0) {
            console.error('No shader classes available, creating fallback shader');
            availableShaders.push({
                name: 'Fallback',
                thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYWxsYmFjazwvdGV4dD48L3N2Zz4=',
                params: { ...DEFAULT_SHADER_PARAMS },
                fragmentShader: this.getFallbackShader()
            });
        }
        
        return availableShaders;
    }
    
    /* @tweakable fallback shader for when other shaders fail to load */
    static getFallbackShader() {
        return `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_beat;
uniform sampler2D u_prev_frame;

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
    
    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.4 + u_bass * 2.0);
        
        d = sin(d * 8.0 + u_time + u_beat * 10.0) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 1.2);
        
        finalColor += col * d * (1.0 + u_treble * 2.0);
    }
    
    vec2 prevUV = gl_FragCoord.xy / u_resolution;
    vec3 prevColor = texture(u_prev_frame, prevUV).rgb;
    finalColor = mix(finalColor, prevColor * 0.98, 0.1 + u_mid * 0.3);
    
    fragColor = vec4(finalColor, 1.0);
}`;
    }
}
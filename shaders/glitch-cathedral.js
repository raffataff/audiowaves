/* @tweakable energy vortex particle density multiplier */
const ENERGY_VORTEX_PARTICLE_DENSITY = 1.0;

/* @tweakable vortex rotation speed scaling factor */
const ENERGY_VORTEX_ROTATION_SPEED = 1.0;

/* @tweakable energy beam intensity multiplier */
const ENERGY_VORTEX_BEAM_INTENSITY = 1.0;

/* @tweakable core pulsation strength factor */
const ENERGY_VORTEX_CORE_PULSE = 1.0;

/* @tweakable fractal detail level multiplier */
const ENERGY_VORTEX_FRACTAL_DETAIL = 1.0;

class GlitchCathedralShader {
    static getDefinition() {
        return {
            name: 'Energy Vortex',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InZvcnRleCIgY3g9IjUwJSIgY3k9IjUwJSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmMDA4MCIvPjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjODBmZjAwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDA4MGZmIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjdm9ydGV4KSIvPjwvc3ZnPg==',
            params: { 
                /* @tweakable particle density for vortex effect */
                particleDensity: ENERGY_VORTEX_PARTICLE_DENSITY, 
                /* @tweakable vortex rotation speed */
                rotationSpeed: ENERGY_VORTEX_ROTATION_SPEED,
                /* @tweakable energy beam intensity */
                beamIntensity: ENERGY_VORTEX_BEAM_INTENSITY,
                /* @tweakable core pulsation strength */
                corePulse: ENERGY_VORTEX_CORE_PULSE,
                /* @tweakable fractal detail level */
                fractalDetail: ENERGY_VORTEX_FRACTAL_DETAIL
            },
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
/* @tweakable particle density for vortex effect */
uniform float u_particleDensity;
/* @tweakable vortex rotation speed */
uniform float u_rotationSpeed;
/* @tweakable energy beam intensity */
uniform float u_beamIntensity;
/* @tweakable core pulsation strength */
uniform float u_corePulse;
/* @tweakable fractal detail level */
uniform float u_fractalDetail;

out vec4 fragColor;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
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

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < int(4.0 + u_fractalDetail * 4.0); i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 0.5);
    vec3 d = vec3(0.8, 0.9, 0.3);
    
    return a + b * cos(TAU * (c * t + d + u_bass * 0.5));
}

float energyBeam(vec2 uv, float angle, float width, float intensity) {
    vec2 beamDir = vec2(cos(angle), sin(angle));
    float dist = abs(dot(uv, vec2(-beamDir.y, beamDir.x)));
    
    float beam = exp(-dist / (width * (1.0 + u_treble * 0.5))) * intensity;
    float pulse = sin(u_time * 10.0 + angle * 3.0 + u_beat * 20.0) * 0.5 + 0.5;
    
    return beam * pulse * u_beamIntensity;
}

float vortexParticles(vec2 uv) {
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);
    
    float spiralAngle = angle + log(radius + 0.1) * 2.0 + u_time * u_rotationSpeed + u_bass * 4.0;
    
    vec2 spiralUV = vec2(cos(spiralAngle), sin(spiralAngle)) * radius;
    spiralUV += fbm(spiralUV * 3.0 + u_time * 0.5) * 0.3;
    
    float particles = 0.0;
    float density = 20.0 + u_particleDensity * 30.0;
    
    for(float i = 0.0; i < density; i++) {
        vec2 particlePos = vec2(
            cos(i * 2.4 + u_time * 2.0 + u_mid * 3.0) * (0.3 + 0.7 * (i / density)),
            sin(i * 2.4 + u_time * 2.0 + u_mid * 3.0) * (0.3 + 0.7 * (i / density))
        );
        
        particlePos = rotate(particlePos, u_time * u_rotationSpeed + i * 0.5);
        
        float dist = length(uv - particlePos);
        float size = 0.01 + u_beat * 0.02 + sin(i + u_time * 5.0) * 0.005;
        particles += exp(-dist / size) * (1.0 + u_treble * 2.0);
    }
    
    return particles;
}

float energyCore(vec2 uv) {
    float radius = length(uv);
    float corePulse = .9 + (sin(u_time * 8.0 + u_bass * 2.0) * u_corePulse) * 0.5;
    
    float core = exp(-radius * (3.0 / corePulse));
    
    float rings = 0.0;
    for(int i = 1; i <= 5; i++) {
        float ringRadius = float(i) * 0.15 + u_beat * 0.1;
        float ringIntensity = sin(u_time * float(i) * 2.0 + u_mid * 10.0) * 0.5 + 0.5;
        rings += exp(-abs(radius - ringRadius) * 20.0) * ringIntensity;
    }
    
    return core + rings * 0.3;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    vec3 color = vec3(0.0);
    
    // Energy core
    float core = energyCore(uv);
    color += palette(u_time * 0.1 + core) * core * 2.0;
    
    // Vortex particles
    float particles = vortexParticles(uv);
    color += palette(u_time * 0.2 + particles * 0.1) * particles * 0.1;
    
    // Energy beams
    for(int i = 0; i < 8; i++) {
        float beamAngle = float(i) * PI / 4.0 + u_time * u_rotationSpeed * 0.5;
        float beam = energyBeam(uv, beamAngle, 0.05, 0.8);
        color += palette(u_time * 0.3 + float(i) * 0.2) * beam;
    }
    
    // Fractal noise overlay
    float fractalNoise = fbm(uv * 4.0 + u_time * 0.3);
    color += palette(fractalNoise + u_time * 0.1) * fractalNoise * 0.2 * (1.0 + u_mid);
    float volume = u_bass + u_mid + u_treble;
    
    // Lightning effects on beat
    if(volume > 0.8) {
        for(int i = 0; i < 3; i++) {
            float lightning = 0.0;
            vec2 start = vec2(cos(float(i) * TAU / 3.0), sin(float(i) * TAU / 3.0)) * 0.1;
            vec2 end = vec2(cos(float(i) * TAU / 3.0 + PI), sin(float(i) * TAU / 3.0 + PI)) * 0.8;
            
            vec2 lightningDir = normalize(end - start);
            vec2 toPoint = uv - start;
            float projLength = dot(toPoint, lightningDir);
            vec2 closestPoint = start + lightningDir * clamp(projLength, 0.0, length(end - start));
            
            float dist = length((uv - closestPoint) * u_treble);
            if(u_treble > 0.25){
            lightning = exp(-dist * 100.0) * u_treble * .70;
            
            color += vec3(1.0, 1.0, 0.8) * lightning;
        }}
    }
    
    // Final color enhancement
    color *= .50 + u_bass * 0.5;
    color = pow(color, vec3(0.9)); // Slight gamma correction
    
    // Vignette effect
    float vignette = 1.0 - smoothstep(0.5, 1.2, length(uv));
    color *= vignette;
    
    fragColor = vec4(color, 1.0);
}`;
    }
}
const BLEND_MODE_COUNT = 8;

const TRANSITION_SMOOTHNESS = 4.0;

class BlendShaders {
    static getBlendModes() {
        return [
            {
                id: 'luma_flow',
                name: 'Luma Flow',
                durationHint: 4200,
                params: { threshold: 0.1, softness: 0.4, flow: 1.0 },
                blendFunction: this.getLumaFlowBlend()
            },
            {
                id: 'exposure',
                name: 'Exposure Flash',
                durationHint: 2700,
                params: { intensity: 1.0, colorize: 0.50, zoom: 0.4 },
                blendFunction: this.getExposureBlend()
            },
            {
                id: 'liquid',
                name: 'Liquid Morph',
                durationHint: 4500,
                params: { scale: 5.0, power: 0.5, speed: 1.0 },
                blendFunction: this.getLiquidBlend()
            },
            {
                id: 'glitch',
                name: 'Data Glitch',
                durationHint: 2250,
                params: { blockSize: 15.0, jitter: 0.5, colorSplit: 0.05 },
                blendFunction: this.getGlitchBlend()
            },
            {
                id: 'warp',
                name: 'Chromatic Warp',
                durationHint: 3300,
                params: { strength: 2.0, aberration: 0.1, rotation: 1.0 },
                blendFunction: this.getWarpBlend()
            },
            {
                id: 'melt',
                name: 'Pixel Melter',
                durationHint: 3000,
                params: { dripSpeed: 2.0, segments: 50.0, threshold: 0.5 },
                blendFunction: this.getMeltBlend()
            },
            {
                id: 'kaleido',
                name: 'Kaleido-Morph',
                durationHint: 3600,
                params: { segments: 6.0, spin: 2.0, zoom: 1.5 },
                blendFunction: this.getKaleidoBlend()
            },
            {
                id: 'burn',
                name: 'Burn Through',
                durationHint: 3000,
                params: { noiseScale: 8.0, edgeWidth: 0.2, intensity: 2.0 },
                blendFunction: this.getBurnBlend()
            }
        ];
    }

    static createTransitionShader(fromShader, toShader, blendMode) {
        const uniforms = this.extractUniforms(fromShader, toShader);
        const helperFunctions = this.getHelperFunctions();
        
        const processedFrom = this.processShaderSource(fromShader, 'from');
        const processedTo = this.processShaderSource(toShader, 'to');

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

uniform float u_transitionProgress;
uniform float u_blendParam1;
uniform float u_blendParam2;
uniform float u_blendParam3;
uniform float u_blendParam4;

${uniforms}

out vec4 fragColor;

// Global Helpers
${helperFunctions}

// --- FORWARD DECLARATIONS ---
vec4 getShaderColor_from(vec2 incomingUV);
vec4 getShaderColor_to(vec2 incomingUV);

// Blend Function
${blendMode.blendFunction}

// === FROM SHADER LOGIC ===
${processedFrom.code}

// === TO SHADER LOGIC ===
${processedTo.code}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // --- AUDIO REACTIVE TRANSITION PHYSICS ---
    float audioIntensity = smoothstep(0.3, 0.8, u_bass);
    float shake = audioIntensity * 0.025 * sin(u_transitionProgress * 3.14159);
    uv += vec2(random(uv + u_time) - 0.5) * shake;

    vec4 blendedColor = blendColors(u_transitionProgress, uv);

    // --- DRIVER INTENSITY ---
    float midTransition = 1.0 - abs(u_transitionProgress * 2.0 - 1.0);
    float beatBoost = u_beat * smoothstep(0.4, 0.9, u_beat);
    blendedColor.rgb += midTransition * beatBoost * 0.12;

    fragColor = blendedColor;
}`;
    }

    static processShaderSource(source, suffix) {
        let code = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        code = code.replace(/\bgl_FragCoord\b/g, 'local_FragCoord');

        // Include Blend functions here to avoid redefinition errors
        const functionsToScope = [
            'palette', 'fbm', 'applyGlobalEffects', 'rotate', 'random', 'noise', 
            'energyBeam', 'vortexParticles', 'energyCore', 
            'drawNode', 'drawConnection', 'getNodePos', 'getWave', 'getPattern',
            'getFreq',
            'blend_Add', 'blend_Screen', 'blend_Overlay', 
            'blend_SoftLight', 'blend_Difference', 'blend_Exclusion'
        ];

        functionsToScope.forEach(func => {
            const definitionRegex = new RegExp(`\\b[a-zA-Z0-9_]+\\s+${func}\\s*\\(`, 'g');
            if (definitionRegex.test(code)) {
                const globalRegex = new RegExp(`\\b${func}\\b`, 'g');
                code = code.replace(globalRegex, `${func}_${suffix}`);
            }
        });

        const mainRegex = /void\s+main\s*\(\s*(?:void)?\s*\)\s*{/;
        
        if (!mainRegex.test(code)) {
             return { code: `vec4 getShaderColor_${suffix}(vec2 incomingUV) { return vec4(0.0); }` };
        }

        code = code.replace(mainRegex, `vec4 getShaderColor_${suffix}(vec2 incomingUV) {
            vec4 local_FragCoord = vec4(incomingUV * u_resolution, 0.0, 1.0);
            vec4 fragColor = vec4(0.0);
        `);

        const lastBraceIndex = code.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            code = code.substring(0, lastBraceIndex) + 
                   `    return fragColor;\n}` + 
                   code.substring(lastBraceIndex + 1);
        }

        const lines = code.split('\n');
        const filteredLines = lines.filter(line => {
            const trimmed = line.trim();
            return !trimmed.startsWith('precision') && 
                   !trimmed.startsWith('uniform') && 
                   !trimmed.startsWith('layout') && 
                   !trimmed.startsWith('in ') && 
                   !trimmed.startsWith('out ') &&
                   !trimmed.startsWith('#version');
        });

        return { code: filteredLines.join('\n') };
    }

    // ==========================================
    // BLEND MODES
    // ==========================================

    /* 1. LUMA FLOW - FIXED LOGIC */
    static getLumaFlowBlend() {
        return `
vec4 blendColors(float progress, vec2 uv) {
    float flow = u_blendParam3;
    vec2 distortion = vec2(
        noise(uv * 4.0 + u_time),
        noise(uv * 4.0 - u_time)
    ) * 0.1 * sin(progress * 3.14);
    
    vec2 uvDistorted = uv + distortion * flow;

    vec4 colFrom = getShaderColor_from(uvDistorted);
    vec4 colTo = getShaderColor_to(uvDistorted);

    // Calculate brightness of the INCOMING shader
    float lumaTo = dot(colTo.rgb, vec3(0.299, 0.587, 0.114));
    
    // Inverse logic from before:
    // We want mask to be 1.0 (show "To") when progress > luma.
    // Darker pixels (low luma) appear first. Brighter pixels appear later.
    
    float softness = u_blendParam2;
    // Expand progress range to accommodate softness so it completes fully
    float time = progress * (1.0 + softness) - softness;
    
    // smoothstep(edge0, edge1, x) -> 0 if x < edge0, 1 if x > edge1
    // We check if 'time' has passed 'lumaTo'.
    float mask = smoothstep(lumaTo - softness, lumaTo, time);

    // Add burn edge
    float edge = 1.0 - abs(mask - 0.5) * 2.0;
    edge = pow(edge, 2.5);
    
    vec4 result = mix(colFrom, colTo, mask);
    result.rgb += vec3(1.0, 0.8, 0.5) * edge * u_blendParam1 * 0.5; 
    
    return result;
}`;
    }

    static getExposureBlend() { return `
vec4 blendColors(float progress, vec2 uv) {
    float intensity = u_blendParam1;
    float basePeak = sin(progress * 3.14159);
    float peak = pow(basePeak, 8.0);
    vec2 center = vec2(0.5);
    vec2 zoomedUV = (uv - center) * (1.0 - peak * u_blendParam3) + center;
    vec4 colFrom = getShaderColor_from(zoomedUV);
    vec4 colTo = getShaderColor_to(zoomedUV);
    vec4 baseColor = mix(colFrom, colTo, smoothstep(0.3, 0.7, progress));
    vec3 flash = vec3(1.0) * peak * intensity;
    return baseColor + vec4(flash, 0.0);
}`; }

    static getLiquidBlend() { return `
vec4 blendColors(float progress, vec2 uv) {
    float scale = u_blendParam1;
    float distortStr = u_blendParam2 * sin(progress * 3.14159) * (1.0 + u_bass);
    float n = noise(uv * scale + u_time * 0.5);
    vec2 flow = vec2(cos(n * 6.28), sin(n * 6.28));
    vec2 uvFrom = uv + flow * distortStr * progress;
    vec2 uvTo = uv - flow * distortStr * (1.0 - progress);
    vec4 colFrom = getShaderColor_from(uvFrom);
    vec4 colTo = getShaderColor_to(uvTo);
    return mix(colFrom, colTo, smoothstep(0.0, 1.0, progress));
}`; }

    static getGlitchBlend() { return `
vec4 blendColors(float progress, vec2 uv) {
    float blockSize = u_blendParam1;
    float jitter = u_blendParam2 * sin(progress * 3.14159) * (1.0 + u_treble);
    float split = u_blendParam3 * sin(progress * 3.14159);
    vec2 blockUV = floor(uv * blockSize) / blockSize;
    float blockNoise = random(blockUV + floor(u_time * 10.0));
    vec2 offset = vec2(0.0);
    if (blockNoise > 0.8) { offset.x = (random(vec2(u_time)) - 0.5) * jitter; }
    vec2 uvR = uv + offset + vec2(split, 0.0);
    vec2 uvG = uv + offset;
    vec2 uvB = uv + offset - vec2(split, 0.0);
    vec4 fromR = getShaderColor_from(uvR);
    vec4 fromG = getShaderColor_from(uvG);
    vec4 fromB = getShaderColor_from(uvB);
    vec4 colFrom = vec4(fromR.r, fromG.g, fromB.b, 1.0);
    vec4 toR = getShaderColor_to(uvR);
    vec4 toG = getShaderColor_to(uvG);
    vec4 toB = getShaderColor_to(uvB);
    vec4 colTo = vec4(toR.r, toG.g, toB.b, 1.0);
    float cut = smoothstep(progress - 0.15, progress + 0.15, random(vec2(uv.y * 10.0, u_time)));
    return mix(colTo, colFrom, cut);
}`; }

    static getWarpBlend() { return `
vec4 blendColors(float progress, vec2 uv) {
    vec2 center = vec2(0.5);
    vec2 dir = uv - center;
    float dist = length(dir);
    float strength = u_blendParam1 * sin(progress * 3.14159);
    float rotation = strength * u_blendParam3 * (1.0 - dist);
    float c = cos(rotation);
    float s = sin(rotation);
    mat2 rot = mat2(c, -s, s, c);
    vec2 warpedUV = center + rot * dir * (1.0 - strength * 0.5);
    float shift = u_blendParam2 * strength;
    vec4 colFrom;
    colFrom.r = getShaderColor_from(warpedUV + vec2(shift, 0.0)).r;
    colFrom.g = getShaderColor_from(warpedUV).g;
    colFrom.b = getShaderColor_from(warpedUV - vec2(shift, 0.0)).b;
    colFrom.a = 1.0;
    vec4 colTo;
    colTo.r = getShaderColor_to(warpedUV + vec2(shift, 0.0)).r;
    colTo.g = getShaderColor_to(warpedUV).g;
    colTo.b = getShaderColor_to(warpedUV - vec2(shift, 0.0)).b;
    colTo.a = 1.0;
    return mix(colFrom, colTo, progress);
}`; }

    static getMeltBlend() { return `
vec4 blendColors(float progress, vec2 uv) {
    float segments = u_blendParam2;
    float dripSpeed = u_blendParam1;
    float xID = floor(uv.x * segments);
    float offset = random(vec2(xID, 0.0));
    float drip = offset * progress * dripSpeed;
    vec2 uvFrom = uv + vec2(0.0, drip * progress);
    vec2 uvTo = uv - vec2(0.0, drip * (1.0 - progress));
    vec4 colFrom = getShaderColor_from(uvFrom);
    vec4 colTo = getShaderColor_to(uvTo);
    float mixVal = smoothstep(0.1, 0.9, progress + (noise(uv*10.0) - 0.5) * 0.6);
    return mix(colFrom, colTo, mixVal);
}`; }

    static getKaleidoBlend() { return `
vec4 blendColors(float progress, vec2 uv) {
    float intensity = pow(sin(progress * 3.14159), 0.7);
    vec2 p = uv - 0.5;
    float r = length(p);
    float a = atan(p.y, p.x);
    float segments = u_blendParam1;
    float spin = u_blendParam2 * intensity;
    a = mod(a + u_time * 0.2, 6.28318 / segments);
    a = abs(a - 3.14159 / segments);
    vec2 kUV = 0.5 + r * vec2(cos(a + spin), sin(a + spin));
    vec2 finalUV = mix(uv, kUV, intensity);
    finalUV = (finalUV - 0.5) * (1.0 - intensity * 0.5) + 0.5;
    vec4 colFrom = getShaderColor_from(finalUV);
    vec4 colTo = getShaderColor_to(finalUV);
    return mix(colFrom, colTo, progress);
}`; }

    static getBurnBlend() { return `
vec4 blendColors(float progress, vec2 uv) {
    float noiseScale = u_blendParam1;
    float n = noise(uv * noiseScale + u_time * 0.1);
    n += noise(uv * noiseScale * 2.0 - u_time * 0.2) * 0.5;
    n /= 1.5;
    float burnPath = progress * 1.5 - 0.25;
    float edgeWidth = max(0.03, u_blendParam2 * 0.5);
    float mask = smoothstep(burnPath - edgeWidth, burnPath, n);
    vec4 colFrom = getShaderColor_from(uv);
    vec4 colTo = getShaderColor_to(uv);
    vec3 fireColor = vec3(1.0, 0.5, 0.1) * u_blendParam3;
    vec4 result = mix(colTo, colFrom, mask);
    if(n > burnPath - u_blendParam2 && n < burnPath) {
         result.rgb += fireColor;
    }
    return result;
}`; }

    static getHelperFunctions() {
        return `
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
float getFreq(float f) {
    return texture(u_spectrum, vec2(clamp(f, 0.01, 0.99), 0.0)).r;
}`;
    }

    static extractUniforms(fromShader, toShader) {
        const uniformRegex = /uniform\s+(\w+)\s+(\w+)(\[\d+\])?\s*;/g;
        const uniforms = new Map();

        const extractFromCode = (code) => {
            let match;
            const regex = new RegExp(uniformRegex.source, 'g');
            while ((match = regex.exec(code)) !== null) {
                const uniformType = match[1];
                const uniformName = match[2];
                const arraySize = match[3] || '';
                
                if (['u_time', 'u_resolution', 'u_bass', 'u_mid', 'u_treble', 'u_beat', 
                     'u_prev_frame', 'u_spectrum', 'u_transitionProgress', 'u_blendParam1', 'u_blendParam2', 
                     'u_blendParam3', 'u_blendParam4'].includes(uniformName)) {
                    continue;
                }
                
                if (!uniforms.has(uniformName)) {
                    uniforms.set(uniformName, `uniform ${uniformType} ${uniformName}${arraySize};`);
                }
            }
        };

        extractFromCode(fromShader);
        extractFromCode(toShader);

        return Array.from(uniforms.values()).join('\n');
    }

    static getRandomBlendMode() {
        const blendModes = this.getBlendModes();
        const weights = blendModes.map(m => {
            if (['luma_flow', 'liquid'].includes(m.id)) return 2.0;
            if (m.id === 'glitch') return 0.6;
            if (m.id === 'burn') return 0.7;
            return 1.0;
        });
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let roll = Math.random() * totalWeight;
        for (let i = 0; i < blendModes.length; i++) {
            roll -= weights[i];
            if (roll <= 0) return blendModes[i];
        }
        return blendModes[blendModes.length - 1];
    }

    static randomizeBlendParams(blendMode) {
        const params = { ...blendMode.params };
        Object.keys(params).forEach(key => {
            params[key] = params[key] * (0.8 + Math.random() * 0.4);
        });
        if(blendMode.id === 'kaleido') params.segments = Math.floor(3.0 + Math.random() * 5.0);
        if(blendMode.id === 'glitch') params.blockSize = 10.0 + Math.random() * 20.0;
        return params;
    }
}

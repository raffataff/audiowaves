class ShaderGeneratorCompiler {
    static TRANSITION_SMOOTHNESS = 2.0;
    static DEFAULT_GENERATION_INTENSITY = 1.0;

    static generateShaderCode(shaderData) {
        const { effects, controls, palette } = shaderData;
        
        // 1. BUILD UNIFORMS
        const uniforms = new Set(['u_time', 'u_resolution', 'u_bass', 'u_mid', 'u_treble', 'u_prev_frame', 'u_spectrum']);
        
        effects.forEach(effect => {
            if(effect.uniforms) effect.uniforms.forEach(uniform => uniforms.add(uniform));
        });
        controls.forEach(control => {
            uniforms.add(control.uniform);
        });

        const uniformDeclarations = Array.from(uniforms)
            .filter(u => !['u_time', 'u_resolution', 'u_bass', 'u_mid', 'u_treble', 'u_prev_frame', 'u_spectrum'].includes(u))
            .map(uniform => `uniform float ${uniform};`)
            .join('\n');

        // 2. GENERATE DEFAULT CONSTANTS FOR MISSING CONTROLS
        const controlIds = controls.map(c => c.id);
        let defaultConstants = '';
        
        if (!controlIds.includes('speed')) defaultConstants += '#define u_speed 1.0\n';
        if (!controlIds.includes('intensity')) defaultConstants += '#define u_intensity 1.0\n';
        if (!controlIds.includes('amplitude')) defaultConstants += '#define u_amplitude 1.0\n';
        if (!controlIds.includes('glow')) defaultConstants += '#define u_glow 1.0\n';
        if (!controlIds.includes('complexity')) defaultConstants += '#define u_complexity 1.0\n';
        if (!controlIds.includes('colorShift')) defaultConstants += '#define u_colorShift 0.0\n';
        if (!controlIds.includes('distortion')) defaultConstants += '#define u_distortion 0.0\n';
        if (!controlIds.includes('rotation')) defaultConstants += '#define u_rotation 0.0\n';
        if (!controlIds.includes('scale')) defaultConstants += '#define u_scale 1.0\n';
        if (!controlIds.includes('frequency')) defaultConstants += '#define u_frequency 1.0\n';
        if (!controlIds.includes('symmetry')) defaultConstants += '#define u_symmetry 0.0\n';
        if (!controlIds.includes('turbulence')) defaultConstants += '#define u_turbulence 0.0\n';
        if (!controlIds.includes('feedback')) defaultConstants += '#define u_feedback 0.0\n';
        if (!controlIds.includes('decay')) defaultConstants += '#define u_decay 0.95\n';

        // 3. GENERATE LOGIC BLOCKS
        const dynamicParams = this.generateDynamicParameters(controls);
        const globalTransform = this.generateGlobalTransforms(controls);
        const pipelineCode = this.generateRenderPipeline(effects, controls);
        const postProcessing = this.generatePostProcessing(controls);
        const feedbackCode = this.generateFeedbackLogic(controls);

        return `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform sampler2D u_prev_frame;
uniform sampler2D u_spectrum;
${uniformDeclarations}

// Defaults for missing sliders
${defaultConstants}

out vec4 fragColor;

${ShaderGeneratorEffects.getHelperFunctions()}
${ShaderPalettes.getPaletteFunction(palette)}
${this.generateBlendFunctions()} 
${this.generateAdvancedHelpers(controls)}

void main() {
    // 1. Base Coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 initialUV = uv; 

    // 2. Global Camera Transforms
    ${globalTransform}
    
    // Dynamic Param modifiers
    ${dynamicParams}

    vec2 currentUV = uv; 

    vec3 finalColor = vec3(0.0);
    vec3 layerColor = vec3(0.0);

    // 3. Render Pipeline
    ${pipelineCode}

    // 4. Post Processing
    ${postProcessing}

    // 5. Feedback Trail (Fixed Box & Brightness)
    ${feedbackCode}

    fragColor = vec4(max(vec3(0.0), finalColor), 1.0);
}`;
    }

    /* SEMANTIC LAYER 1: GLOBAL TRANSFORMS */
    static generateGlobalTransforms(controls) {
        const transformations = [];
        const controlIds = controls.map(c => c.id);

        if (controlIds.includes('rotation')) {
            transformations.push('uv = rotate(uv, u_rotation * u_time * 0.2);');
        }
        if (controlIds.includes('scale')) {
            transformations.push('uv /= (u_scale * 0.5 + 0.1 + u_bass * 0.05);'); 
        }
        if (controlIds.includes('distortion')) {
            transformations.push(`
                uv += (vec2(
                    noise(uv * 2.0 + u_time * 0.2),
                    noise(uv * 2.0 - u_time * 0.2)
                ) - 0.5) * u_distortion * 0.5;
            `);
        }
        if (controlIds.includes('symmetry')) {
            transformations.push(`
                if (u_symmetry > 0.5) {
                    float sides = floor(u_symmetry * 2.0 + 2.0);
                    float a = atan(uv.y, uv.x);
                    float r = length(uv);
                    a = mod(a, 6.28318 / sides);
                    a = abs(a - 3.14159 / sides);
                    uv = r * vec2(cos(a), sin(a));
                }
            `);
        }
        return transformations.join('\n    ');
    }

    /* SEMANTIC LAYER 2: RENDER PIPELINE */
    static generateRenderPipeline(effects, controls) {
        let code = '';
        const controlIds = controls.map(c => c.id);
        const hasSpeed = controlIds.includes('speed');
        const hasFreq = controlIds.includes('frequency');
        const hasTurbulence = controlIds.includes('turbulence');
        const hasComplexity = controlIds.includes('complexity');
        const hasAmplitude = controlIds.includes('amplitude');

        const availableUniforms = controls
            .filter(c => !['speed', 'feedback', 'decay'].includes(c.id))
            .map(c => c.uniform);

        const audioUniforms = ['u_bass', 'u_mid', 'u_treble'];

        effects.forEach((effect, index) => {
            // Get variant name for this effect
            let variantName = 'Default';
            if (effect.selectedVariant) {
                variantName = effect.selectedVariant;
            } else if (effect.variantNames) {
                const variantNames = effect.variantNames();
                variantName = variantNames[Math.floor(Math.random() * variantNames.length)] || 'Default';
            }
            code += `\n    // --- Layer ${index + 1}: ${effect.name} [${variantName}] ---\n    {\n`;

            if (index === 0) {
                code += `        currentUV = uv;\n`; 
            } else {
                const strategy = Math.random();
                if (strategy < 0.3) {
                    code += `        currentUV = initialUV;\n`;
                } else if (strategy > 0.6) {
                    code += `        currentUV += (vec2(finalColor.r, finalColor.g) - 0.5) * 0.1 * (1.0 + u_bass);\n`;
                }
            }

            const audioDriver = audioUniforms[Math.floor(Math.random() * audioUniforms.length)];
            
            code += `        vec2 layerUV = currentUV;\n`;
            
            if (hasFreq) {
                code += `        layerUV *= u_frequency;\n`;
            }
            if (hasTurbulence) {
                code += `        layerUV += vec2(noise(layerUV*3.0+u_time*0.5), noise(layerUV*3.0-u_time*0.5)) * u_turbulence * 0.2;\n`;
            }
            
            const timeScale = (0.5 + Math.random() * 1.5).toFixed(2);
            const speedCalc = hasSpeed ? `u_speed * ${timeScale}` : `${timeScale}`;
            code += `        float localTime = u_time * ${speedCalc};\n`;

            let effectCode = effect.code
                .replace(/u_time/g, 'localTime')
                .replace(/uv/g, 'layerUV')
                .replace(/vec3\s+effectColor\s*=/g, 'layerColor =')
                .replace(/effectColor/g, 'layerColor');

            effectCode = effectCode.replace(/u_bass|u_mid|u_treble/g, audioDriver);

            if (effect.id !== 'biomath' && availableUniforms.length > 0) {
                effectCode = effectCode.replace(/\b\d+\.\d+\b/g, (match) => {
                    const val = parseFloat(match);
                    if (val === 0.0 || val === 1.0) return match; 

                    const rand = Math.random();
                    if (rand < 0.15) { 
                        return `(${match} * (0.8 + ${audioDriver} * 0.5))`;
                    } else if (rand < 0.30) {
                        const uniform = availableUniforms[Math.floor(Math.random() * availableUniforms.length)];
                        return `(${match} * ${uniform})`;
                    }
                    return match;
                });
            }

            if (hasComplexity) {
                effectCode = effectCode.replace(/for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*(\d+)/g, (match, varName, limit) => {
                    return `for(int ${varName}=0; ${varName} < int(float(${limit}) * u_complexity)`;
                });
            }

            code += `        ${effectCode}\n`;

            code += `        layerColor *= u_amplitude * (0.8 + ${audioDriver} * 0.4);\n`;

            if (index === 0) {
                 code += `        finalColor = layerColor;\n`;
            } else {
                const blendMode = this.getRandomBlendFunction();
                code += `        finalColor = blend_${blendMode}(finalColor, layerColor, 0.5 + ${audioDriver} * 0.2);\n`;
            }

            code += `    }\n`;
        });

        return code;
    }

    /* SEMANTIC LAYER 3: POST PROCESSING */
    static generatePostProcessing(controls) {
        const transformations = [];
        
        transformations.push('finalColor *= 1.0 + u_bass * 0.15;'); 
        transformations.push('finalColor += max(vec3(0.0), finalColor * finalColor) * u_glow * 0.5;');
        transformations.push('finalColor.rgb = mix(finalColor.rgb, finalColor.gbr, sin(u_colorShift * 2.0 + u_time) * 0.5 + 0.5);');
        transformations.push('finalColor *= u_intensity;');

        return transformations.join('\n    ');
    }

    /* SEMANTIC LAYER 4: REACTIVE LIGHT TRAILS */
    static generateFeedbackLogic(controls) {
        return `
    vec2 screenUV = gl_FragCoord.xy / u_resolution.xy;
    
    // 1. STATIONARY SAMPLING (Attached Trails)
    // No zoom, just a tiny bit of bass-driven diffusion to smooth the light
    vec2 diff = (vec2(random(screenUV + u_time), random(screenUV - u_time)) - 0.5) * 0.002 * u_bass;
    vec3 prevColor = texture(u_prev_frame, screenUV + diff).rgb;

    // 2. BORDER FADE (Fix Grey Box)
    vec2 border = smoothstep(vec2(0.0), vec2(0.02), screenUV) * (1.0 - smoothstep(vec2(0.98), vec2(1.0), screenUV));
    prevColor *= border.x * border.y;

    // 3. DECAY
    float dcAmount = u_decay;

    // 4. FEEDBACK AMOUNT
    float fbAmount = u_feedback;

    // --- RESTORED TRIGGER LOGIC ---
    // Automatically enable trails on high energy
    float volume = (u_bass + u_mid + u_treble) / 3.0;
    
    if(volume > 0.7) {
        // Force feedback ON during high energy
        fbAmount = max(fbAmount, 0.85);
        // Make trails last slightly longer during the hit
        dcAmount = max(dcAmount, 0.96);
    }

    // Apply Decay
    prevColor *= dcAmount;

    // 5. BLEND (Max = Light Painting)
    vec3 trails = max(finalColor, prevColor);
    finalColor = mix(finalColor, trails, clamp(fbAmount, 0.0, 1.0));
        `;
    }

    static getRandomBlendFunction() {
        const modes = ['Add', 'Screen', 'Overlay', 'SoftLight', 'Difference', 'Exclusion'];
        return modes[Math.floor(Math.random() * modes.length)];
    }

    static generateBlendFunctions() {
        return `
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
        `;
    }

    static generateAdvancedHelpers(selectedControls) {
        const controlIds = selectedControls.map(c => c.id);
        const complexityParam = controlIds.includes('complexity') ? 'int(u_complexity * 4.0 + 2.0)' : '4';
        
        return `
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
            return fbm(p, ${complexityParam});
        }
        `;
    }
    
    static generateDynamicParameters(controls) { return ''; }
}

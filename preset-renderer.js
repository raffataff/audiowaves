/* @tweakable number of built-in presets that cannot be deleted for UI rendering */
const BUILT_IN_PRESET_COUNT = 6;

class PresetRenderer {
    constructor(presetManager) {
        this.presetManager = presetManager;
    }

    render() {
        const container = document.getElementById('preset-grid');
        container.innerHTML = '';

        this.presetManager.shaderPresets.forEach((preset, index) => {
            const item = document.createElement('div');
            item.className = 'preset-item' + (index === this.presetManager.currentPreset ? ' active' : '');

            const isCustomPreset = index >= BUILT_IN_PRESET_COUNT;

            /* @tweakable preset tooltip with detailed information */
            const tooltipText = `${preset.name}${isCustomPreset ? ' (Custom)' : ' (Built-in)'}`;
            item.setAttribute('data-tooltip', tooltipText);

            item.innerHTML = `
                <img src="${preset.thumbnail}" alt="${preset.name}" class="preset-thumbnail">
                <div class="preset-name">${preset.name}</div>
                ${isCustomPreset ? `
                    <button class="preset-export-btn" data-index="${index}" data-tooltip="Export shader">📤</button>
                    <button class="preset-delete-btn" data-index="${index}" data-tooltip="Delete custom preset">✖</button>
                ` : ''}
            `;

            // Add click handler for preset selection (excluding delete button)
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('preset-delete-btn')) {
                    this.presetManager.selectPreset(index);
                }
            });

            // Add export button handler for custom presets
            const exportBtn = item.querySelector('.preset-export-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.presetManager.exporter.exportShader(index);
                });
            }

            // Add delete button handler for custom presets
            const deleteBtn = item.querySelector('.preset-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.presetManager.removePreset(index);
                });
            }

            container.appendChild(item);
        });

        this.renderPresetParams();
    }

    renderPresetParams() {
        const container = document.getElementById('preset-params');
        container.innerHTML = '';

        if (this.presetManager.currentPreset >= 0 && this.presetManager.currentPreset < this.presetManager.shaderPresets.length) {
            const preset = this.presetManager.shaderPresets[this.presetManager.currentPreset];

            Object.entries(preset.params).forEach(([key, value]) => {
                const group = document.createElement('div');
                group.className = 'param-group';

                /* @tweakable parameter slider range for generated shaders using correct control lookup */
                const control = ShaderGeneratorControls.getAvailableControls().find(c => c.id === key);
                const min = control?.min || 0;
                const max = control?.max || 2;
                const step = (max - min) > 2 ? 0.1 : 0.01;

                /* @tweakable parameter tooltip with value and range information */
                const tooltipText = `${this.formatParamName(key)}: ${value.toFixed(2)} (Range: ${min}-${max})`;

                group.innerHTML = `
                    <label class="param-label">${this.formatParamName(key)}</label>
                    <input type="range" class="param-input" min="${min}" max="${max}" step="${step}" value="${value}" data-param="${key}" data-tooltip="${tooltipText}">
                `;

                const input = group.querySelector('.param-input');
                input.addEventListener('input', (e) => {
                    const newValue = parseFloat(e.target.value);
                    preset.params[key] = newValue;
                    /* @tweakable update tooltip with new value */
                    const newTooltipText = `${this.formatParamName(key)}: ${e.target.value} (Range: ${min}-${max})`;
                    e.target.setAttribute('data-tooltip', newTooltipText);
                    
                    // FIX: Immediately propagate param change to shader engine
                    // This ensures slider changes actually affect the rendered shader
                    this.presetManager.shaderEngine.setPresetParams(preset.params);
                    
                    this.presetManager.saveState();
                });

                container.appendChild(group);
            });
        }
    }

    /* @tweakable parameter name formatting for display in UI */
    formatParamName(name) {
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
}
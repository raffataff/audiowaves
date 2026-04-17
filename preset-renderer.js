const BUILT_IN_PRESET_COUNT = ShaderDefinitions.shaderFiles.length;

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

            const tooltipText = `${preset.name}${isCustomPreset ? ' (Custom)' : ' (Built-in)'}`;
            item.setAttribute('data-tooltip', tooltipText);

            item.innerHTML = `
                <img src="${preset.thumbnail}" alt="${preset.name}" class="preset-thumbnail">
                <div class="preset-name">${preset.name}</div>
                ${isCustomPreset ? `
                    <button class="preset-rename-btn" data-index="${index}" data-tooltip="Rename shader">✏️</button>
                    <button class="preset-export-btn" data-index="${index}" data-tooltip="Export shader">📤</button>
                    <button class="preset-delete-btn" data-index="${index}" data-tooltip="Delete custom preset">✖</button>
                ` : ''}
            `;

            // Add click handler for preset selection (excluding action buttons)
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('preset-delete-btn') &&
                    !e.target.classList.contains('preset-rename-btn') &&
                    !e.target.classList.contains('preset-export-btn')) {
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

            // Add rename button handler for custom presets
            const renameBtn = item.querySelector('.preset-rename-btn');
            if (renameBtn) {
                renameBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.presetManager.showRenameDialog(index);
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

                const control = ShaderGeneratorControls.getAvailableControls().find(c => c.id === key);
                const min = control?.min || 0;
                const max = control?.max || 2;
                const step = (max - min) > 2 ? 0.1 : 0.01;

                const tooltipText = `${this.formatParamName(key)}: ${value.toFixed(2)} (Range: ${min}-${max})`;

                group.innerHTML = `
                    <div class="param-row">
                        <label class="param-label">${this.formatParamName(key)}</label>
                        <div class="param-slider-container">
                            <input type="range" class="param-input" min="${min}" max="${max}" step="${step}" value="${value}" data-param="${key}" data-tooltip="${tooltipText}">
                            <input type="number" class="param-value-input" min="${min}" max="${max}" step="${step}" value="${value.toFixed(2)}" data-param="${key}">
                        </div>
                    </div>
                `;

                const slider = group.querySelector('.param-input');
                const valueInput = group.querySelector('.param-value-input');
                
                slider.addEventListener('input', (e) => {
                    const newValue = parseFloat(e.target.value);
                    preset.params[key] = newValue;
                    valueInput.value = newValue.toFixed(2);
                    const newTooltipText = `${this.formatParamName(key)}: ${e.target.value} (Range: ${min}-${max})`;
                    e.target.setAttribute('data-tooltip', newTooltipText);
                    this.presetManager.shaderEngine.setPresetParams(preset.params);
                    this.presetManager.saveState();
                });
                
                valueInput.addEventListener('change', (e) => {
                    let newValue = parseFloat(e.target.value);
                    newValue = Math.max(min, Math.min(max, newValue));
                    preset.params[key] = newValue;
                    slider.value = newValue;
                    valueInput.value = newValue.toFixed(2);
                    const newTooltipText = `${this.formatParamName(key)}: ${newValue.toFixed(2)} (Range: ${min}-${max})`;
                    slider.setAttribute('data-tooltip', newTooltipText);
                    this.presetManager.shaderEngine.setPresetParams(preset.params);
                    this.presetManager.saveState();
                });

                container.appendChild(group);
            });
        }
    }

    formatParamName(name) {
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
}

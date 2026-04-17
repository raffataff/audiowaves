class ShaderGeneratorUI {
    constructor(shaderGenerator) {
        this.shaderGenerator = shaderGenerator;
        
        this.maxEffects = 5;
        
        this.animationDuration = 1000;
        
        /* Track the order in which effects are selected */
        this.effectSelectionOrder = [];
    }

    createFormHTML() {
        const availableEffects = ShaderGeneratorEffects.getAvailableEffects();
        const availableControls = ShaderGeneratorControls.getAvailableControls();
        const palettes = ShaderPalettes.getAvailablePalettes();
        
        return `
            <div class="generator-form">
                <div class="form-header">
                    <h2>Create New Shader</h2>
                    <button class="close-btn" id="close-generator">✖</button>
                </div>

                <div class="form-content-wrapper">
                    <div class="form-main">
                        <div class="form-section" style="flex-direction: row; align-items: center; gap: 16px;">
                            <label class="section-label" style="margin: 0; white-space: nowrap;">Shader Name</label>
                            <input type="text" id="shader-name" class="shader-name-input" style="flex: 1;" placeholder="Enter shader name..." maxlength="20">
                        </div>

                        <div class="form-section">
                            <label class="section-label">Select Effects (Max ${this.maxEffects})</label>
                            <div class="effects-grid">
                                ${this.generateEffectOptions(availableEffects)}
                            </div>
                        </div>

                        <div class="form-section">
                            <label class="section-label">Control Sliders (Max ${ShaderGeneratorControls.MAX_SHADER_CONTROLS})</label>
                            <div class="controls-grid">
                                ${this.generateControlOptions(availableControls)}
                            </div>
                        </div>

                        <div class="form-section" style="flex-direction: row; align-items: center; gap: 16px;">
                            <label class="section-label" style="margin: 0; white-space: nowrap;">Color Palette</label>
                            <select id="color-palette" class="palette-select" style="flex: 1;">
                                ${palettes.map(palette => `
                                    <option value="${palette.id}">${palette.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="preview-panel visible" id="preview-panel">
                        <div class="preview-header">
                            <h3>Preview</h3>
                            <button class="close-preview-btn" id="close-preview">✖</button>
                        </div>
                        <div class="preview-canvas-wrapper" style="position: relative;">
                            <canvas id="preview-canvas" class="preview-canvas"></canvas>
                            <div class="variant-overlay" id="variant-overlay" style="display: none;">
                                <div class="variant-overlay-title">Variants</div>
                                <div id="variant-list"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button id="preview-shader" class="action-btn preview-btn">Preview</button>
                    <button id="generate-shader" class="action-btn generate-btn">Generate Shader</button>
                </div>
            </div>
        `;
    }

    generateEffectOptions(effects) {
        return effects.map(effect => `
            <div class="effect-option" data-effect="${effect.id}">
                <div class="effect-order-indicator" data-effect="${effect.id}"></div>
                <input type="checkbox" id="effect-${effect.id}" class="effect-checkbox">
                <label for="effect-${effect.id}" class="effect-label">
                    <div class="effect-name">${effect.name}</div>
                    <div class="effect-description">${effect.description}</div>
                </label>
            </div>
        `).join('');
    }

    generateControlOptions(controls) {
        return controls.map(control => `
            <div class="control-option" data-control="${control.id}">
                <input type="checkbox" id="control-${control.id}" class="control-checkbox">
                <label for="control-${control.id}" class="control-label">
                    <div class="control-name">${control.name}</div>
                    <div class="control-description">${control.description}</div>
                </label>
            </div>
        `).join('');
    }

    setupFormEventListeners(modal) {
        const closeBtn = modal.querySelector('#close-generator');
        const generateBtn = modal.querySelector('#generate-shader');
        const previewBtn = modal.querySelector('#preview-shader');
        const closePreviewBtn = modal.querySelector('#close-preview');

        closeBtn.addEventListener('click', () => this.closeForm(modal));
        generateBtn.addEventListener('click', () => this.handleGenerate(modal));
        previewBtn.addEventListener('click', () => this.handlePreview(modal));
        
        if (closePreviewBtn) {
            closePreviewBtn.addEventListener('click', () => this.closePreview(modal));
        }

        // Effect and control selection limiting
        this.setupSelectionLimiting(modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeForm(modal);
            }
        });
    }

    setupSelectionLimiting(modal) {
        // Reset selection order when opening a new form
        this.effectSelectionOrder = [];
        
        const effectCheckboxes = modal.querySelectorAll('.effect-checkbox');
        const controlCheckboxes = modal.querySelectorAll('.control-checkbox');

        effectCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleEffectSelectionChange(modal, e.target);
                this.limitSelection(modal, '.effect-checkbox', this.maxEffects);
            });
        });

        controlCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.limitSelection(modal, '.control-checkbox', ShaderGeneratorControls.MAX_SHADER_CONTROLS));
        });
    }
    
    handleEffectSelectionChange(modal, checkbox) {
        const effectId = checkbox.id.replace('effect-', '');
        
        if (checkbox.checked) {
            // Add to selection order if not already present
            if (!this.effectSelectionOrder.includes(effectId)) {
                this.effectSelectionOrder.push(effectId);
            }
        } else {
            // Remove from selection order
            const index = this.effectSelectionOrder.indexOf(effectId);
            if (index > -1) {
                this.effectSelectionOrder.splice(index, 1);
            }
        }
        
        // Update all order indicators
        this.updateOrderIndicators(modal);
    }
    
    updateOrderIndicators(modal) {
        // Clear all indicators first
        const indicators = modal.querySelectorAll('.effect-order-indicator');
        indicators.forEach(indicator => {
            indicator.textContent = '';
            indicator.classList.remove('active');
        });
        
        // Set order numbers based on selection order
        this.effectSelectionOrder.forEach((effectId, index) => {
            const indicator = modal.querySelector(`.effect-order-indicator[data-effect="${effectId}"]`);
            if (indicator) {
                indicator.textContent = index + 1;
                indicator.classList.add('active');
            }
        });
    }

    limitSelection(modal, selector, maxCount) {
        const checked = modal.querySelectorAll(`${selector}:checked`);
        const all = modal.querySelectorAll(selector);
        
        if (checked.length >= maxCount) {
            all.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.disabled = true;
                    checkbox.parentElement.style.opacity = '0.5';
                }
            });
        } else {
            all.forEach(checkbox => {
                checkbox.disabled = false;
                checkbox.parentElement.style.opacity = '1';
            });
        }
    }

    collectFormData(modal) {
        const name = modal.querySelector('#shader-name').value.trim();
        const palette = modal.querySelector('#color-palette').value;

        // Use selection order for effects instead of DOM order
        const selectedEffects = this.effectSelectionOrder
            .map(id => {
                const effect = ShaderGeneratorEffects.getAvailableEffects().find(effect => effect.id === id);
                if (effect) {
                    // Get the variant for this effect
                    const effectWithVariant = ShaderGeneratorEffects.getEffectWithVariant(id);
                    return {
                        ...effect,
                        code: effectWithVariant.code,
                        selectedVariant: effectWithVariant.variantName
                    };
                }
                return effect;
            })
            .filter(effect => effect !== undefined);

        const selectedControls = Array.from(modal.querySelectorAll('.control-checkbox:checked'))
            .map(checkbox => checkbox.id.replace('control-', ''))
            .map(id => ShaderGeneratorControls.getAvailableControls().find(control => control.id === id));

        return { name, palette, effects: selectedEffects, controls: selectedControls };
    }

    updateVariantOverlay(modal, effects) {
        const variantOverlay = modal.querySelector('#variant-overlay');
        const variantList = modal.querySelector('#variant-list');
        
        if (!variantOverlay || !variantList || !effects || effects.length === 0) {
            if (variantOverlay) {
                variantOverlay.style.display = 'none';
            }
            return;
        }
        
        // Build the variant list HTML
        let listHtml = '';
        effects.forEach((effect, index) => {
            const variantName = effect.selectedVariant || 'Default';
            listHtml += `<div class="variant-overlay-item">
                <span class="effect-name">${index + 1}. ${effect.name}</span>
                <span class="variant-name">[${variantName}]</span>
            </div>`;
        });
        
        variantList.innerHTML = listHtml;
        variantOverlay.style.display = 'block';
    }

    handlePreview(modal) {
        const shaderData = this.collectFormData(modal);
        
        if (!shaderData.name || shaderData.effects.length === 0) {
            alert('Please enter a name and select at least one effect.');
            return;
        }

        // Show preview panel first
        this.showPreviewPanel(modal);
        
        // Update variant overlay with selected effects and variants
        this.updateVariantOverlay(modal, shaderData.effects);
        
        // Then start preview
        this.shaderGenerator.previewShader(shaderData, modal);
    }

    handleGenerate(modal) {
        const shaderData = this.collectFormData(modal);

        if (!shaderData.name || shaderData.effects.length === 0) {
            alert('Please enter a name and select at least one effect.');
            return;
        }

        this.shaderGenerator.generateShader(shaderData);
        this.closeForm(modal);
    }

    closeForm(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.generator-form').style.transform = 'scale(0.9)';

        setTimeout(() => {
            document.body.removeChild(modal);
            this.shaderGenerator.isFormVisible = false;
            // Stop preview rendering if active and clear stored code
            this.shaderGenerator.stopPreview();
            this.shaderGenerator.lastGeneratedCode = null;
            this.shaderGenerator.lastShaderData = null;
        }, this.animationDuration);
    }
    
    showPreviewPanel(modal) {
        const previewPanel = modal.querySelector('#preview-panel');
        if (previewPanel) {
            previewPanel.classList.remove('hidden');
            // Trigger reflow for animation
            previewPanel.offsetHeight;
            previewPanel.classList.add('visible');
        }
    }
    
    closePreview(modal) {
        const previewPanel = modal.querySelector('#preview-panel');
        if (previewPanel) {
            previewPanel.classList.remove('visible');
            previewPanel.classList.add('hidden');
        }
        
        // Hide variant overlay
        const variantOverlay = modal.querySelector('#variant-overlay');
        if (variantOverlay) {
            variantOverlay.style.display = 'none';
        }
        
        // Stop the preview rendering
        this.shaderGenerator.stopPreview();
        
        // Reset preview button
        const previewBtn = modal.querySelector('.preview-btn');
        if (previewBtn) {
            previewBtn.textContent = 'Preview';
            previewBtn.style.background = '';
        }
    }
}

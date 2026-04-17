const PRESET_STORAGE_KEY = 'spectral-nexus-presets';

class PresetStorage {
    getDefaultCustomThumbnail() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DdXN0b208L3RleHQ+PC9zdmc+';
    }

    getBuiltInCount() {
        return ShaderDefinitions ? ShaderDefinitions.shaderFiles.length : 6;
    }

    saveState(shaderPresets, currentPreset, extendedState = null) {
        const state = {
            currentPreset: currentPreset,
            allPresets: shaderPresets.map(preset => ({
                name: preset.name,
                fragmentShader: preset.fragmentShader,
                params: preset.params,
                thumbnail: preset.thumbnail
            })),
            builtInPresetCount: this.getBuiltInCount(),
            extendedState: extendedState
        };
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(state));
    }

    loadSavedState() {
        try {
            const saved = localStorage.getItem(PRESET_STORAGE_KEY);
            if (saved) {
                const state = JSON.parse(saved);

                let restoredPresets = ShaderDefinitions.getPresetShaders();

                if (state.allPresets && Array.isArray(state.allPresets)) {
                    // Use CURRENT built-in count from shader files, not the saved one
                    const currentBuiltInCount = this.getBuiltInCount();
                    
                    // Restore built-in presets with any modifications
                    for (let i = 0; i < Math.min(currentBuiltInCount, restoredPresets.length); i++) {
                        if (state.allPresets[i]) {
                            // Only restore params that exist in the current shader definition
                            const currentParams = restoredPresets[i].params;
                            const savedParams = state.allPresets[i].params || {};
                            const filteredParams = {};
                            for (const key of Object.keys(currentParams)) {
                                if (savedParams.hasOwnProperty(key)) {
                                    filteredParams[key] = savedParams[key];
                                }
                            }
                            
                            restoredPresets[i] = {
                                ...restoredPresets[i],
                                fragmentShader: state.allPresets[i].fragmentShader || restoredPresets[i].fragmentShader,
                                params: { ...currentParams, ...filteredParams },
                                thumbnail: state.allPresets[i].thumbnail || restoredPresets[i].thumbnail
                            };
                        }
                    }

                    // Restore custom presets (avoid duplicates by name)
                    const existingNames = new Set(restoredPresets.map(p => p.name));
                    for (let i = currentBuiltInCount; i < state.allPresets.length; i++) {
                        if (state.allPresets[i] && !existingNames.has(state.allPresets[i].name)) {
                            restoredPresets.push({
                                name: state.allPresets[i].name,
                                fragmentShader: state.allPresets[i].fragmentShader,
                                params: state.allPresets[i].params,
                                thumbnail: state.allPresets[i].thumbnail || this.getDefaultCustomThumbnail()
                            });
                        }
                    }
                }

                return {
                    currentPreset: state.currentPreset || 0,
                    shaderPresets: restoredPresets,
                    extendedState: state.extendedState
                };
            }
        } catch (error) {
            console.error('Error loading preset state:', error);
        }

        return null;
    }

    getCustomPresets(shaderPresets) {
        const builtInCount = this.getBuiltInCount();
        return shaderPresets.slice(builtInCount).map(preset => ({
            name: preset.name,
            fragmentShader: preset.fragmentShader,
            params: preset.params,
            thumbnail: preset.thumbnail,
            isCustom: true
        }));
    }

    loadCustomPresets(customPresets, shaderPresets) {
        customPresets.forEach(preset => {
            shaderPresets.push({
                name: preset.name,
                fragmentShader: preset.fragmentShader,
                params: preset.params,
                thumbnail: preset.thumbnail || this.getDefaultCustomThumbnail()
            });
        });
    }
}

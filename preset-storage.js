/* @tweakable storage key prefix for preset data persistence */
const PRESET_STORAGE_KEY = 'spectral-nexus-presets';

class PresetStorage {
    /* @tweakable default thumbnail for custom shaders */
    getDefaultCustomThumbnail() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DdXN0b208L3RleHQ+PC9zdmc+';
    }

    saveState(shaderPresets, currentPreset, extendedState = null) {
        const state = {
            currentPreset: currentPreset,
            /* @tweakable save complete preset data including shader modifications */
            allPresets: shaderPresets.map(preset => ({
                name: preset.name,
                fragmentShader: preset.fragmentShader,
                params: preset.params,
                thumbnail: preset.thumbnail
            })),
            /* @tweakable number of built-in presets to distinguish from custom ones */
            builtInPresetCount: Math.min(6, shaderPresets.length),
            /* @tweakable extended state for additional features like shuffle */
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

                /* @tweakable restore all saved preset modifications including thumbnails */
                if (state.allPresets && Array.isArray(state.allPresets)) {
                    // Restore built-in presets with any modifications
                    const builtInCount = state.builtInPresetCount || 6;
                    for (let i = 0; i < Math.min(builtInCount, restoredPresets.length); i++) {
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
                                /* @tweakable restore custom thumbnails if available */
                                thumbnail: state.allPresets[i].thumbnail || restoredPresets[i].thumbnail
                            };
                        }
                    }

                    // Restore custom presets
                    for (let i = builtInCount; i < state.allPresets.length; i++) {
                        if (state.allPresets[i]) {
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
                    /* @tweakable return extended state for additional features */
                    extendedState: state.extendedState
                };
            }
        } catch (error) {
            console.error('Error loading preset state:', error);
        }

        return null;
    }

    /* @tweakable get all custom presets for persistence */
    getCustomPresets(shaderPresets) {
        return shaderPresets.slice(6).map(preset => ({
            name: preset.name,
            fragmentShader: preset.fragmentShader,
            params: preset.params,
            thumbnail: preset.thumbnail,
            isCustom: true
        }));
    }

    /* @tweakable load custom presets from saved data */
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
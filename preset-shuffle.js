/* @tweakable shader shuffle functionality for automatic preset switching */
class PresetShuffle {
    constructor(presetManager) {
        this.presetManager = presetManager;
        
        /* @tweakable shuffle configuration parameters */
        this.isShuffleEnabled = false;
        this.shuffleMinInterval = 15000; // 30 seconds
        this.shuffleMaxInterval = 60000; // 60 seconds
        this.shuffleTimer = null;
        this.excludeCurrentFromShuffle = true;
    }

    /* @tweakable toggle shuffle functionality on/off */
    toggleShaderShuffle() {
        this.isShuffleEnabled = !this.isShuffleEnabled;
        
        const shuffleBtn = document.getElementById('shuffle-shader-btn');
        
        /* @tweakable shuffle button active state styling */
        shuffleBtn.classList.toggle('shuffle-active', this.isShuffleEnabled);
        
        /* @tweakable shuffle button text content when active/inactive */
        if (this.isShuffleEnabled) {
            /* @tweakable The icon for the shuffle button when it is active */
            shuffleBtn.textContent = '🔄';
            shuffleBtn.title = 'Shuffle is ON - Click to disable';
            this.startShaderShuffle();
            console.log('Shader shuffle enabled');
        } else {
            /* @tweakable The icon for the shuffle button when it is inactive */
            shuffleBtn.textContent = '🔄';
            shuffleBtn.title = 'Shuffle is OFF - Click to enable';
            this.stopShaderShuffle();
            console.log('Shader shuffle disabled');
        }
        
        this.presetManager.saveState();
    }

    /* @tweakable start shader shuffle with random interval timing */
    startShaderShuffle() {
        this.stopShaderShuffle(); // Clear any existing timer
        
        /* @tweakable random interval calculation between min and max */
        const randomInterval = this.shuffleMinInterval + 
            Math.random() * (this.shuffleMaxInterval - this.shuffleMinInterval);
        
        this.shuffleTimer = setTimeout(() => {
            this.performRandomShaderSwitch();
            if (this.isShuffleEnabled) {
                this.startShaderShuffle(); // Schedule next shuffle
            }
        }, randomInterval);
        
        console.log(`Next shader shuffle in ${Math.round(randomInterval / 1000)} seconds`);
    }

    /* @tweakable stop shader shuffle and cleanup timer */
    stopShaderShuffle() {
        if (this.shuffleTimer) {
            clearTimeout(this.shuffleTimer);
            this.shuffleTimer = null;
        }
    }

    /* @tweakable random shader selection logic */
    performRandomShaderSwitch() {
        if (this.presetManager.shaderPresets.length <= 1) return;
        
        let availablePresets = [];
        for (let i = 0; i < this.presetManager.shaderPresets.length; i++) {
            if (!this.excludeCurrentFromShuffle || i !== this.presetManager.currentPreset) {
                availablePresets.push(i);
            }
        }
        
        if (availablePresets.length === 0) return;
        
        /* @tweakable random preset selection from available options */
        const randomIndex = Math.floor(Math.random() * availablePresets.length);
        const selectedPreset = availablePresets[randomIndex];
        
        console.log(`Shuffling to shader: ${this.presetManager.shaderPresets[selectedPreset].name}`);
        this.presetManager.selectPresetWithTransition(selectedPreset);
    }

    /* @tweakable get current shuffle state for persistence */
    getState() {
        return {
            isShuffleEnabled: this.isShuffleEnabled,
            shuffleMinInterval: this.shuffleMinInterval,
            shuffleMaxInterval: this.shuffleMaxInterval
        };
    }

    /* @tweakable restore shuffle state from saved data */
    setState(state) {
        this.isShuffleEnabled = state.isShuffleEnabled || false;
        this.shuffleMinInterval = state.shuffleMinInterval || this.shuffleMinInterval;
        this.shuffleMaxInterval = state.shuffleMaxInterval || this.shuffleMaxInterval;
        
        /* @tweakable restore shuffle button state and restart shuffle if needed */
        setTimeout(() => {
            const shuffleBtn = document.getElementById('shuffle-shader-btn');
            if (shuffleBtn) {
                shuffleBtn.classList.toggle('shuffle-active', this.isShuffleEnabled);
                
                /* @tweakable restore button text and tooltip based on state */
                if (this.isShuffleEnabled) {
                    shuffleBtn.title = 'Shuffle is ON - Click to disable';
                    this.startShaderShuffle();
                } else {
                    shuffleBtn.title = 'Shuffle is OFF - Click to enable';
                }
            }
        }, 100);
    }
}
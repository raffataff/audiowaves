class PresetShuffle {
    constructor(presetManager) {
        this.presetManager = presetManager;
        
        this.isShuffleEnabled = false;
        this.shuffleMinInterval = 15000; // 30 seconds
        this.shuffleMaxInterval = 60000; // 60 seconds
        this.shuffleTimer = null;
        this.excludeCurrentFromShuffle = true;
    }

    toggleShaderShuffle() {
        this.isShuffleEnabled = !this.isShuffleEnabled;
        
        const shuffleBtn = document.getElementById('shuffle-shader-btn');
        
        shuffleBtn.classList.toggle('shuffle-active', this.isShuffleEnabled);
        
        if (this.isShuffleEnabled) {
            shuffleBtn.textContent = '🔄';
            shuffleBtn.title = 'Shuffle is ON - Click to disable';
            this.startShaderShuffle();
            console.log('Shader shuffle enabled');
        } else {
            shuffleBtn.textContent = '🔄';
            shuffleBtn.title = 'Shuffle is OFF - Click to enable';
            this.stopShaderShuffle();
            console.log('Shader shuffle disabled');
        }
        
        this.presetManager.saveState();
    }

    startShaderShuffle() {
        this.stopShaderShuffle(); // Clear any existing timer
        
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

    stopShaderShuffle() {
        if (this.shuffleTimer) {
            clearTimeout(this.shuffleTimer);
            this.shuffleTimer = null;
        }
    }

    performRandomShaderSwitch() {
        if (this.presetManager.shaderPresets.length <= 1) return;
        
        let availablePresets = [];
        for (let i = 0; i < this.presetManager.shaderPresets.length; i++) {
            if (!this.excludeCurrentFromShuffle || i !== this.presetManager.currentPreset) {
                availablePresets.push(i);
            }
        }
        
        if (availablePresets.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * availablePresets.length);
        const selectedPreset = availablePresets[randomIndex];
        
        console.log(`Shuffling to shader: ${this.presetManager.shaderPresets[selectedPreset].name}`);
        this.presetManager.selectPresetWithTransition(selectedPreset);
    }

    getState() {
        return {
            isShuffleEnabled: this.isShuffleEnabled,
            shuffleMinInterval: this.shuffleMinInterval,
            shuffleMaxInterval: this.shuffleMaxInterval
        };
    }

    setState(state) {
        this.isShuffleEnabled = state.isShuffleEnabled || false;
        this.shuffleMinInterval = state.shuffleMinInterval || this.shuffleMinInterval;
        this.shuffleMaxInterval = state.shuffleMaxInterval || this.shuffleMaxInterval;
        
        setTimeout(() => {
            const shuffleBtn = document.getElementById('shuffle-shader-btn');
            if (shuffleBtn) {
                shuffleBtn.classList.toggle('shuffle-active', this.isShuffleEnabled);
                
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

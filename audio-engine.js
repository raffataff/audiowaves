class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.sourceNode1 = null;
        this.sourceNode2 = null;
        this.gainNode = null;
        this.crossfadeGain1 = null;
        this.crossfadeGain2 = null;
        
        this.frequencyData = null;
        this.timeDomainData = null;
        this.audioData = {
            bass: 0,
            mid: 0,
            treble: 0,
            beat: 0,
            beatCount: 0,
            volume: 0
        };
        
        // Use config constants if available, otherwise use defaults
        const config = window.Utils?.APP_CONFIG || {};
        this.beatDetection = {
            threshold: config.AUDIO_BEAT_THRESHOLD || 0.8,
            decay: config.AUDIO_BEAT_DECAY || 0.95,
            lastBeat: 0,
            history: []
        };
        
        this.isInitialized = false;
        this.currentPlayer = 1;
        this.crossfadeDuration = 2; // seconds
        this.isCrossfading = false;
        
        this.setupAudioPlayers();
    }
    
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser with config values
            const config = window.Utils?.APP_CONFIG || {};
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = config.AUDIO_FFT_SIZE || 512;
            this.analyser.smoothingTimeConstant = config.AUDIO_SMOOTHING || 0.8;
            
            // Create gain nodes
            this.gainNode = this.audioContext.createGain();
            this.crossfadeGain1 = this.audioContext.createGain();
            this.crossfadeGain2 = this.audioContext.createGain();
            
            // Initialize data arrays
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            this.timeDomainData = new Uint8Array(this.analyser.fftSize);
            
            // Connect nodes
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.isInitialized = true;
            console.log('Audio Engine initialized');
        } catch (error) {
            console.error('Failed to initialize audio engine:', error);
        }
    }
    
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('AudioContext resumed successfully.');
            } catch (error) {
                console.error('Failed to resume AudioContext:', error);
            }
        }
    }
    
    setupAudioPlayers() {
        this.audioPlayer1 = document.getElementById('audio-player');
        this.audioPlayer2 = document.getElementById('audio-player-next');
        
        // Setup crossfade gain initial values
        if (this.audioContext) {
            this.crossfadeGain1.gain.value = 1;
            this.crossfadeGain2.gain.value = 0;
        }
    }
    
    async connectAudioSource(audioElement) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const isPlayer1 = audioElement === this.audioPlayer1;
            let sourceNode = isPlayer1 ? this.sourceNode1 : this.sourceNode2;
            const gainToUse = isPlayer1 ? this.crossfadeGain1 : this.crossfadeGain2;

            if (sourceNode) {
                // Already connected
                return;
            }

            // Disconnect other source if it exists, to be safe
            if(isPlayer1 && this.sourceNode2) {
                this.sourceNode2.disconnect();
            } else if (!isPlayer1 && this.sourceNode1) {
                this.sourceNode1.disconnect();
            }

            sourceNode = this.audioContext.createMediaElementSource(audioElement);
            sourceNode.connect(gainToUse);
            gainToUse.connect(this.gainNode);

            if(isPlayer1) {
                this.sourceNode1 = sourceNode;
            } else {
                this.sourceNode2 = sourceNode;
            }
            
        } catch (error) {
            console.error('Failed to connect audio source:', error);
        }
    }
    
    async connectMicrophone() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            if (this.sourceNode) {
                this.sourceNode.disconnect();
            }
            
            this.sourceNode = this.audioContext.createMediaStreamSource(stream);
            this.sourceNode.connect(this.gainNode);
            
            console.log('Microphone connected');
        } catch (error) {
            console.error('Failed to connect microphone:', error);
        }
    }
    
    update() {
        if (!this.isInitialized || !this.analyser) return;
        
        // Get frequency and time domain data
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.timeDomainData);
        
        // Calculate frequency bands
        const dataLength = this.frequencyData.length;
        const bassEnd = Math.floor(dataLength * 0.1);
        const midEnd = Math.floor(dataLength * 0.4);
        
        let bassSum = 0, midSum = 0, trebleSum = 0;
        
        // Bass (0-10%)
        for (let i = 0; i < bassEnd; i++) {
            bassSum += this.frequencyData[i];
        }
        
        // Mid (10-40%)
        for (let i = bassEnd; i < midEnd; i++) {
            midSum += this.frequencyData[i];
        }
        
        // Treble (40-100%)
        for (let i = midEnd; i < dataLength; i++) {
            trebleSum += this.frequencyData[i];
        }
        
        // Normalize values
        this.audioData.bass = (bassSum / bassEnd) / 255;
        this.audioData.mid = (midSum / (midEnd - bassEnd)) / 255;
        this.audioData.treble = (trebleSum / (dataLength - midEnd)) / 255;
        
        // Calculate overall volume
        let volumeSum = 0;
        for (let i = 0; i < dataLength; i++) {
            volumeSum += this.frequencyData[i];
        }
        this.audioData.volume = (volumeSum / dataLength) / 255;
        
        // Beat detection
        this.detectBeat();
        
        // Smooth audio data
        this.smoothAudioData();
    }
    
    detectBeat() {
        const currentBass = this.audioData.bass;
        const now = Date.now();
        
        // Add to history
        this.beatDetection.history.push({
            value: currentBass,
            time: now
        });
        
        // Keep only recent history (last 2 seconds)
        this.beatDetection.history = this.beatDetection.history.filter(
            item => now - item.time < 2000
        );
        
        // Calculate average bass level
        const avgBass = this.beatDetection.history.reduce((sum, item) => sum + item.value, 0) / this.beatDetection.history.length;
        
        // Detect beat if current bass is significantly higher than average
        if (currentBass > avgBass * 1.5 && 
            currentBass > this.beatDetection.threshold &&
            now - this.beatDetection.lastBeat > 100) { // Minimum 100ms between beats
            
            this.audioData.beat = 1.0;
            this.audioData.beatCount++;
            this.beatDetection.lastBeat = now;
        } else {
            // Decay beat value
            this.audioData.beat *= this.beatDetection.decay;
        }
    }
    
    smoothAudioData() {
        // Apply smoothing to prevent jitter
        const smoothing = 0.7;
        
        this.audioData.bass = this.audioData.bass * (1 - smoothing) + (this.audioData.bass || 0) * smoothing;
        this.audioData.mid = this.audioData.mid * (1 - smoothing) + (this.audioData.mid || 0) * smoothing;
        this.audioData.treble = this.audioData.treble * (1 - smoothing) + (this.audioData.treble || 0) * smoothing;
    }
    
    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    }
    
    getAudioData() {
        return {
            ...this.audioData,
            frequencyData: this.frequencyData,
            timeDomainData: this.timeDomainData
        };
    }
    
    async crossfadeToNext() {
        if (!this.isInitialized || this.isCrossfading) return;
        
        this.isCrossfading = true;
        const currentGain = this.currentPlayer === 1 ? this.crossfadeGain1 : this.crossfadeGain2;
        const nextGain = this.currentPlayer === 1 ? this.crossfadeGain2 : this.crossfadeGain1;
        
        const fadeTime = this.crossfadeDuration;
        const now = this.audioContext.currentTime;
        
        // Start fade out current, fade in next
        currentGain.gain.setValueAtTime(1, now);
        currentGain.gain.linearRampToValueAtTime(0, now + fadeTime);
        
        nextGain.gain.setValueAtTime(0, now);
        nextGain.gain.linearRampToValueAtTime(1, now + fadeTime);
        
        // Switch current player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        
        setTimeout(() => {
            this.isCrossfading = false;
        }, fadeTime * 1000);
    }
    
    getCurrentPlayer() {
        return this.currentPlayer === 1 ? this.audioPlayer1 : this.audioPlayer2;
    }
    
    getNextPlayer() {
        return this.currentPlayer === 1 ? this.audioPlayer2 : this.audioPlayer1;
    }
    
    destroy() {
        // Close audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(err => {
                console.warn('Error closing AudioContext:', err);
            });
        }
        
        // Disconnect source nodes
        if (this.sourceNode1) {
            try {
                this.sourceNode1.disconnect();
            } catch (e) {
                // Already disconnected
            }
            this.sourceNode1 = null;
        }
        if (this.sourceNode2) {
            try {
                this.sourceNode2.disconnect();
            } catch (e) {
                // Already disconnected
            }
            this.sourceNode2 = null;
        }
        
        // Clear references
        this.analyser = null;
        this.gainNode = null;
        this.crossfadeGain1 = null;
        this.crossfadeGain2 = null;
        this.frequencyData = null;
        this.timeDomainData = null;
        this.beatDetection.history = [];
        this.isInitialized = false;
        
        console.log('Audio Engine destroyed');
    }
}
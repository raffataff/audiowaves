class AudioControls {
    constructor(audioEngine, playlistManager) {
        this.audioEngine = audioEngine;
        this.playlistManager = playlistManager;
        this.volume = 0.7;
        this.isMuted = false;

        // Store bound handlers for cleanup
        this._boundHandlers = {};

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Audio controls - store bound handlers
        this._boundHandlers.playPause = () => this.togglePlayPause();
        this._boundHandlers.prevTrack = () => this.playlistManager.previousTrack();
        this._boundHandlers.nextTrack = () => this.playlistManager.nextTrack();
        this._boundHandlers.shuffle = () => this.playlistManager.toggleShuffle();
        this._boundHandlers.repeat = () => this.playlistManager.toggleRepeat();

        document.getElementById('play-pause-btn').addEventListener('click', this._boundHandlers.playPause);
        document.getElementById('prev-btn').addEventListener('click', this._boundHandlers.prevTrack);
        document.getElementById('next-btn').addEventListener('click', this._boundHandlers.nextTrack);
        document.getElementById('shuffle-btn').addEventListener('click', this._boundHandlers.shuffle);
        document.getElementById('repeat-btn').addEventListener('click', this._boundHandlers.repeat);

        // Volume controls
        this._boundHandlers.volumeChange = (e) => this.setVolume(e.target.value / 100);
        this._boundHandlers.mute = () => this.toggleMute();
        
        document.getElementById('volume-slider').addEventListener('input', this._boundHandlers.volumeChange);
        document.getElementById('mute-btn').addEventListener('click', this._boundHandlers.mute);

        // Progress control
        this._boundHandlers.seek = (e) => this.seekTo(e.target.value / 100);
        document.getElementById('progress-slider').addEventListener('input', this._boundHandlers.seek);

        // Microphone input
        this._boundHandlers.mic = () => this.toggleMicrophone();
        document.getElementById('mic-input-btn').addEventListener('click', this._boundHandlers.mic);

        // Tab audio input
        this._boundHandlers.tabAudio = () => this.toggleTabAudio();
        document.getElementById('tab-audio-btn').addEventListener('click', this._boundHandlers.tabAudio);

        // Audio events for progress updates
        this._boundHandlers.updateProgress = () => this.updateProgress();
        this.audioEngine.audioPlayer1.addEventListener('timeupdate', this._boundHandlers.updateProgress);
        this.audioEngine.audioPlayer2.addEventListener('timeupdate', this._boundHandlers.updateProgress);
    }

    async togglePlayPause() {
        const player = this.audioEngine.getCurrentPlayer();
        
        const shouldResumeContext = true;
        if (shouldResumeContext) {
            await this.audioEngine.resumeContext();
        }

        if (this.playlistManager.isPlaying) {
            player.pause();
            this.playlistManager.isPlaying = false;
        } else {
            if (this.playlistManager.currentTrackIndex === -1 && this.playlistManager.playlist.length > 0) {
                this.playlistManager.playTrack(0);
                return;
            }
            try {
                await player.play();
                this.playlistManager.isPlaying = true;
            } catch (error) {
                console.error("Error playing audio:", error);
                this.playlistManager.isPlaying = false;
            }
        }

        this.updatePlayButton();
        this.playlistManager.updateCurrentTrackDisplay();
        this.playlistManager.saveState();
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audioEngine.setVolume(this.isMuted ? 0 : this.volume);
        document.getElementById('volume-slider').value = this.volume * 100;
        this.saveState();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audioEngine.setVolume(this.isMuted ? 0 : this.volume);
        document.getElementById('mute-btn').textContent = this.isMuted ? '🔇' : '🔊';
        this.saveState();
    }

    seekTo(position) {
        const player = this.audioEngine.getCurrentPlayer();
        if (player.duration) {
            player.currentTime = position * player.duration;
        }
    }

    updateProgress() {
        const player = this.audioEngine.getCurrentPlayer();
        if (player.duration && !isNaN(player.duration)) {
            const progress = (player.currentTime / player.duration) * 100;
            document.getElementById('progress-slider').value = progress;
            document.getElementById('current-time').textContent = this.formatTime(player.currentTime);
            document.getElementById('total-time').textContent = this.formatTime(player.duration);
        } else {
            document.getElementById('progress-slider').value = 0;
            document.getElementById('current-time').textContent = '0:00';
            document.getElementById('total-time').textContent = '0:00';
        }

        // Update level meter
        const audioData = this.audioEngine.getAudioData();
        if (audioData) {
            const levelBar = document.getElementById('level-bar');
            levelBar.style.width = (audioData.volume * 100) + '%';
        }
    }

    updatePlayButton() {
        document.getElementById('play-pause-btn').textContent = this.playlistManager.isPlaying ? '⏸️' : '▶️';
    }

    async toggleMicrophone() {
        try {
            await this.audioEngine.connectMicrophone();
            document.getElementById('mic-input-btn').classList.add('active');
        } catch (error) {
            console.error('Microphone access denied:', error);
            alert('Microphone access denied. Please check permissions.');
        }
    }

    async toggleTabAudio() {
        const tabAudioBtn = document.getElementById('tab-audio-btn');
        
        if (tabAudioBtn.classList.contains('active')) {
            this.audioEngine.disconnectTabAudio();
            tabAudioBtn.classList.remove('active');
        } else {
            const success = await this.audioEngine.connectTabAudio();
            if (success) {
                tabAudioBtn.classList.add('active');
            }
        }
    }

    formatTime(seconds) {
        // Use shared utility function when available
        return window.Utils ? window.Utils.formatTime(seconds) : this._formatTimeFallback(seconds);
    }

    
    _formatTimeFallback(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    saveState() {
        const state = {
            volume: this.volume,
            isMuted: this.isMuted
        };
        localStorage.setItem('spectral-nexus-audio', JSON.stringify(state));
    }

    loadSavedState() {
        try {
            const saved = localStorage.getItem('spectral-nexus-audio');
            if (saved) {
                const state = JSON.parse(saved);
                this.volume = state.volume || 0.7;
                this.isMuted = state.isMuted || false;

                // Update UI
                document.getElementById('volume-slider').value = this.volume * 100;
                document.getElementById('mute-btn').textContent = this.isMuted ? '🔇' : '🔊';

                this.audioEngine.setVolume(this.isMuted ? 0 : this.volume);
            }
        } catch (error) {
            console.error('Error loading audio state:', error);
        }
    }

    destroy() {
        // Remove all event listeners
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const shuffleBtn = document.getElementById('shuffle-btn');
        const repeatBtn = document.getElementById('repeat-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const muteBtn = document.getElementById('mute-btn');
        const progressSlider = document.getElementById('progress-slider');
        const micBtn = document.getElementById('mic-input-btn');
        const tabAudioBtn = document.getElementById('tab-audio-btn');

        if (playPauseBtn && this._boundHandlers.playPause) {
            playPauseBtn.removeEventListener('click', this._boundHandlers.playPause);
        }
        if (prevBtn && this._boundHandlers.prevTrack) {
            prevBtn.removeEventListener('click', this._boundHandlers.prevTrack);
        }
        if (nextBtn && this._boundHandlers.nextTrack) {
            nextBtn.removeEventListener('click', this._boundHandlers.nextTrack);
        }
        if (shuffleBtn && this._boundHandlers.shuffle) {
            shuffleBtn.removeEventListener('click', this._boundHandlers.shuffle);
        }
        if (repeatBtn && this._boundHandlers.repeat) {
            repeatBtn.removeEventListener('click', this._boundHandlers.repeat);
        }
        if (volumeSlider && this._boundHandlers.volumeChange) {
            volumeSlider.removeEventListener('input', this._boundHandlers.volumeChange);
        }
        if (muteBtn && this._boundHandlers.mute) {
            muteBtn.removeEventListener('click', this._boundHandlers.mute);
        }
        if (progressSlider && this._boundHandlers.seek) {
            progressSlider.removeEventListener('input', this._boundHandlers.seek);
        }
        if (micBtn && this._boundHandlers.mic) {
            micBtn.removeEventListener('click', this._boundHandlers.mic);
        }
        if (tabAudioBtn && this._boundHandlers.tabAudio) {
            tabAudioBtn.removeEventListener('click', this._boundHandlers.tabAudio);
        }
        
        // Remove audio player event listeners
        if (this.audioEngine.audioPlayer1 && this._boundHandlers.updateProgress) {
            this.audioEngine.audioPlayer1.removeEventListener('timeupdate', this._boundHandlers.updateProgress);
        }
        if (this.audioEngine.audioPlayer2 && this._boundHandlers.updateProgress) {
            this.audioEngine.audioPlayer2.removeEventListener('timeupdate', this._boundHandlers.updateProgress);
        }

        // Clear references
        this._boundHandlers = {};
        
        console.log('AudioControls destroyed');
    }
}

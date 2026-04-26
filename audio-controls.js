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

        // Device selector
        this._boundHandlers.toggleDeviceDropdown = () => this.toggleDeviceDropdown();
        document.getElementById('mic-device-btn').addEventListener('click', this._boundHandlers.toggleDeviceDropdown);
        
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('mic-device-dropdown');
            const btn = document.getElementById('mic-device-btn');
            if (!dropdown.contains(e.target) && e.target !== btn && !dropdown.classList.contains('hidden')) {
                this.closeDeviceDropdown();
            }
        });

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
            const success = await this.audioEngine.connectMicrophone();
            if (success) {
                document.getElementById('mic-input-btn').classList.add('active');
            }
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

    async toggleDeviceDropdown() {
        const dropdown = document.getElementById('mic-device-dropdown');
        const btn = document.getElementById('mic-device-btn');
        
        if (dropdown.classList.contains('hidden')) {
            btn.classList.add('active');
            dropdown.classList.remove('hidden');
            
            const btnRect = btn.getBoundingClientRect();
            dropdown.style.top = (btnRect.bottom + 8) + 'px';
            dropdown.style.left = btnRect.left + 'px';
            
            await this.populateDeviceList();
        } else {
            this.closeDeviceDropdown();
        }
    }

    closeDeviceDropdown() {
        document.getElementById('mic-device-dropdown').classList.add('hidden');
        document.getElementById('mic-device-btn').classList.remove('active');
    }

    async populateDeviceList() {
        const deviceList = document.getElementById('mic-device-list');
        deviceList.innerHTML = '';
        
        const devices = await this.audioEngine.enumerateAudioDevices();
        
        if (devices.length === 0) {
            deviceList.innerHTML = '<div class="mic-device-empty">No audio input devices found</div>';
            return;
        }
        
        const selectedDeviceId = this.audioEngine.selectedDeviceId || this.audioEngine.loadSelectedDevice();
        
        const defaultItem = this.createDeviceItem({
            deviceId: null,
            label: 'Default Device',
            isLoopback: false,
            type: 'default'
        }, !selectedDeviceId);
        deviceList.appendChild(defaultItem);
        
        devices.forEach(device => {
            const isSelected = device.deviceId === selectedDeviceId;
            const item = this.createDeviceItem(device, isSelected);
            deviceList.appendChild(item);
        });
        
        const refreshBtn = document.createElement('div');
        refreshBtn.className = 'mic-device-refresh';
        refreshBtn.innerHTML = '<span>🔄</span><span>Refresh Devices</span>';
        refreshBtn.addEventListener('click', async () => {
            await this.populateDeviceList();
        });
        deviceList.appendChild(refreshBtn);
    }

    createDeviceItem(device, isSelected) {
        const item = document.createElement('div');
        item.className = 'mic-device-item' + (isSelected ? ' selected' : '');
        
        const icon = document.createElement('span');
        icon.className = 'mic-device-icon';
        icon.textContent = device.isLoopback ? '🔊' : '🎤';
        
        const name = document.createElement('span');
        name.className = 'mic-device-name';
        name.textContent = device.label;
        
        if (device.type !== 'default') {
            const type = document.createElement('span');
            type.className = 'mic-device-type' + (device.isLoopback ? ' loopback' : '');
            type.textContent = device.type;
            item.appendChild(icon);
            item.appendChild(name);
            item.appendChild(type);
        } else {
            item.appendChild(icon);
            item.appendChild(name);
        }
        
        item.addEventListener('click', async (e) => {
            await this.selectDevice(device.deviceId, e.currentTarget);
            this.closeDeviceDropdown();
        });
        
        return item;
    }

    async selectDevice(deviceId, itemElement) {
        this.audioEngine.setSelectedDevice(deviceId);
        
        const deviceList = document.getElementById('mic-device-list');
        const items = deviceList.querySelectorAll('.mic-device-item');
        items.forEach(item => {
            item.classList.remove('selected');
        });
        
        if (itemElement) {
            itemElement.classList.add('selected');
        }
        
        if (this.audioEngine.externalInputType) {
            const currentType = this.audioEngine.externalInputType;
            this.audioEngine.disconnectExternalInput();
            
            document.getElementById('mic-input-btn').classList.remove('active');
            document.getElementById('tab-audio-btn').classList.remove('active');
            
            if (currentType === 'microphone') {
                const success = await this.audioEngine.connectMicrophone(deviceId);
                if (success) {
                    document.getElementById('mic-input-btn').classList.add('active');
                }
            } else if (currentType === 'loopback') {
                const success = await this.audioEngine.connectSystemLoopback(deviceId);
                if (success) {
                    document.getElementById('mic-input-btn').classList.add('active');
                }
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
            
            const savedDevice = this.audioEngine.loadSelectedDevice();
            if (savedDevice) {
                this.audioEngine.selectedDeviceId = savedDevice;
                console.log('Loaded saved audio device:', savedDevice);
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
        const micDeviceBtn = document.getElementById('mic-device-btn');

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
        if (micDeviceBtn && this._boundHandlers.toggleDeviceDropdown) {
            micDeviceBtn.removeEventListener('click', this._boundHandlers.toggleDeviceDropdown);
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

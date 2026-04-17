class PlaylistManager {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 'off'; // 'off', 'all', 'one'

        // Store bound handlers for cleanup
        this._boundHandlers = {};

        this.setupEventListeners();
    }

    setupEventListeners() {
        // File input - store bound handlers
        this._boundHandlers.addFiles = () => document.getElementById('file-input').click();
        this._boundHandlers.fileChange = (e) => this.handleFileSelection(e.target.files);
        this._boundHandlers.clearPlaylist = () => this.clearPlaylist();

        document.getElementById('add-files-btn').addEventListener('click', this._boundHandlers.addFiles);
        document.getElementById('file-input').addEventListener('change', this._boundHandlers.fileChange);
        document.getElementById('clear-playlist-btn').addEventListener('click', this._boundHandlers.clearPlaylist);

        // Audio events
        this._boundHandlers.trackEnded = () => this.onTrackEnded();
        this._boundHandlers.updateTrackInfo = () => this.updateTrackInfo();
        
        this.audioEngine.audioPlayer1.addEventListener('ended', this._boundHandlers.trackEnded);
        this.audioEngine.audioPlayer2.addEventListener('ended', this._boundHandlers.trackEnded);
        this.audioEngine.audioPlayer1.addEventListener('loadedmetadata', this._boundHandlers.updateTrackInfo);
        this.audioEngine.audioPlayer2.addEventListener('loadedmetadata', this._boundHandlers.updateTrackInfo);
    }

    async handleFileSelection(files) {
        for (let file of files) {
            if (file.type.startsWith('audio/')) {
                await this.addTrackToPlaylist(file);
            }
        }
        this.render();
        this.saveState();
    }

    async addTrackToPlaylist(file) {
        try {
            const track = {
                id: Date.now() + Math.random(),
                file: file,
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Unknown Artist',
                duration: 0,
                url: URL.createObjectURL(file)
            };

            // Try to extract metadata
            try {
                const metadata = await this.extractMetadata(file);
                if (metadata.title) track.title = metadata.title;
                if (metadata.artist) track.artist = metadata.artist;
                if (metadata.duration) track.duration = metadata.duration;
            } catch (e) {
                console.log('Could not extract metadata for', file.name);
            }

            this.playlist.push(track);
        } catch (error) {
            console.error('Error adding track:', error);
        }
    }

    async extractMetadata(file) {
        // Simple metadata extraction - in a real app you'd use a library like jsmediatags
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.addEventListener('loadedmetadata', () => {
                resolve({
                    duration: audio.duration,
                    title: null,
                    artist: null
                });
            });
            audio.addEventListener('error', () => resolve({}));
            audio.src = URL.createObjectURL(file);
        });
    }

    /**
     * Sanitize user-provided text to prevent XSS attacks
     * @param {string} text - The text to sanitize
     * @returns {string} - Sanitized text safe for HTML display
     */
    sanitizeText(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render() {
        const container = document.getElementById('playlist-items');
        
        const virtualScrollThreshold = 50;
        const useVirtualScrolling = this.playlist.length > virtualScrollThreshold;
        
        if (useVirtualScrolling) {
            this.renderVirtual(container);
        } else {
            this.renderFull(container);
        }

        // Update playlist info
        document.getElementById('playlist-count').textContent = `${this.playlist.length} tracks`;
        const totalDuration = this.playlist.reduce((sum, track) => sum + (track.duration || 0), 0);
        document.getElementById('playlist-duration').textContent = this.formatTime(totalDuration);
    }

    renderFull(container) {
        container.innerHTML = '';
        // Remove virtual scroll listener if it was added
        if (this._virtualScrollHandler) {
            container.removeEventListener('scroll', this._virtualScrollHandler);
            this._virtualScrollHandler = null;
        }

        this.playlist.forEach((track, index) => {
            const item = this.createPlaylistItem(track, index);
            container.appendChild(item);
        });
    }

    renderVirtual(container) {
        const itemHeight = window.Utils?.APP_CONFIG?.PLAYLIST_ITEM_HEIGHT || 60;
        const bufferSize = 5; // Extra items to render above/below viewport
        
        const containerHeight = container.clientHeight;
        const scrollTop = container.scrollTop;
        
        // Calculate visible range
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
        const endIndex = Math.min(
            this.playlist.length,
            Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize
        );
        
        // Set container height for scrollbar
        container.innerHTML = '';
        container.style.height = 'auto';
        
        // Create spacer for items above viewport
        if (startIndex > 0) {
            const topSpacer = document.createElement('div');
            topSpacer.className = 'playlist-spacer';
            topSpacer.style.height = `${startIndex * itemHeight}px`;
            container.appendChild(topSpacer);
        }
        
        // Render visible items
        for (let index = startIndex; index < endIndex; index++) {
            const track = this.playlist[index];
            const item = this.createPlaylistItem(track, index);
            container.appendChild(item);
        }
        
        // Create spacer for items below viewport
        if (endIndex < this.playlist.length) {
            const bottomSpacer = document.createElement('div');
            bottomSpacer.className = 'playlist-spacer';
            bottomSpacer.style.height = `${(this.playlist.length - endIndex) * itemHeight}px`;
            container.appendChild(bottomSpacer);
        }
        
        // Setup scroll handler if not already done
        if (!this._virtualScrollHandler) {
            this._virtualScrollHandler = () => {
                // Debounce render on scroll
                if (this._virtualScrollTimeout) {
                    clearTimeout(this._virtualScrollTimeout);
                }
                this._virtualScrollTimeout = setTimeout(() => {
                    this.renderVirtual(container);
                }, 16); // ~60fps
            };
            container.addEventListener('scroll', this._virtualScrollHandler, { passive: true });
        }
    }

    createPlaylistItem(track, index) {
        const item = document.createElement('div');
        item.className = 'playlist-item' + (index === this.currentTrackIndex ? ' playing' : '');
        
        const allowDeleteCurrentTrack = true;
        const showDeleteButton = allowDeleteCurrentTrack || index !== this.currentTrackIndex;

        const showDragHandle = true;

        // Build the item structure safely using DOM methods to prevent XSS
        if (showDragHandle) {
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.setAttribute('data-tooltip', 'Drag to reorder');
            dragHandle.textContent = '⋮⋮';
            item.appendChild(dragHandle);
        }

        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';
        
        const trackTitle = document.createElement('div');
        trackTitle.className = 'track-title';
        trackTitle.textContent = track.title; // Safe: textContent escapes HTML
        
        const trackArtist = document.createElement('div');
        trackArtist.className = 'track-artist';
        trackArtist.textContent = track.artist; // Safe: textContent escapes HTML
        
        trackInfo.appendChild(trackTitle);
        trackInfo.appendChild(trackArtist);
        item.appendChild(trackInfo);

        const trackControls = document.createElement('div');
        trackControls.className = 'track-controls';
        
        const trackDuration = document.createElement('div');
        trackDuration.className = 'track-duration';
        trackDuration.textContent = this.formatTime(track.duration);
        trackControls.appendChild(trackDuration);
        
        if (showDeleteButton) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'track-delete-btn';
            deleteBtn.setAttribute('data-index', index);
            deleteBtn.setAttribute('data-tooltip', 'Remove from playlist');
            deleteBtn.textContent = '✖';
            trackControls.appendChild(deleteBtn);
        }
        
        item.appendChild(trackControls);

        // Use sanitized text for tooltip to prevent XSS
        const sanitizedTitle = this.sanitizeText(track.title);
        const sanitizedArtist = this.sanitizeText(track.artist);
        item.setAttribute('data-tooltip', `${sanitizedTitle} - ${sanitizedArtist} (${this.formatTime(track.duration)})`);

        const enableDragReorder = true;
        if (enableDragReorder) {
            item.draggable = true;
            item.dataset.index = index;
            this.setupDragEvents(item);
        }

        // Add click handler for track selection (excluding delete button and drag handle)
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('track-delete-btn') && 
                !e.target.classList.contains('drag-handle')) {
                this.playTrack(index);
            }
        });

        // Add delete button handler
        const deleteBtn = item.querySelector('.track-delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeTrack(index);
            });
        }

        return item;
    }

    setupDragEvents(item) {
        item.addEventListener('dragstart', (e) => {
            const dragOpacity = 0.5;
            
            item.style.opacity = dragOpacity;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', item.outerHTML);
            e.dataTransfer.setData('text/plain', item.dataset.index);
        });

        item.addEventListener('dragend', (e) => {
            item.style.opacity = '1';
            item.classList.remove('dragging');
            this.clearDragVisualFeedback();
        });

        item.addEventListener('dragover', (e) => {
            if (e.preventDefault) {
                e.preventDefault();
            }
            
            const dragOverClass = 'drag-over';
            if (!item.classList.contains('dragging')) {
                item.classList.add(dragOverClass);
            }
            
            e.dataTransfer.dropEffect = 'move';
            return false;
        });

        item.addEventListener('dragenter', (e) => {
            if (!item.classList.contains('dragging')) {
                item.classList.add('drag-over');
            }
        });

        item.addEventListener('dragleave', (e) => {
            item.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const targetIndex = parseInt(item.dataset.index);

            if (draggedIndex !== targetIndex) {
                this.reorderTrack(draggedIndex, targetIndex);
            }

            this.clearDragVisualFeedback();
            return false;
        });
    }

    reorderTrack(fromIndex, toIndex) {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || 
            fromIndex >= this.playlist.length || toIndex >= this.playlist.length) {
            return;
        }

        // Remove the track from its current position
        const [movedTrack] = this.playlist.splice(fromIndex, 1);
        
        // Insert it at the new position
        this.playlist.splice(toIndex, 0, movedTrack);

        // Adjust current track index if necessary
        if (this.currentTrackIndex === fromIndex) {
            // Currently playing track was moved
            this.currentTrackIndex = toIndex;
        } else if (fromIndex < this.currentTrackIndex && toIndex >= this.currentTrackIndex) {
            // Track moved from before current to after current
            this.currentTrackIndex--;
        } else if (fromIndex > this.currentTrackIndex && toIndex <= this.currentTrackIndex) {
            // Track moved from after current to before current
            this.currentTrackIndex++;
        }

        this.render();
        this.saveState();
    }

    clearDragVisualFeedback() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach(item => {
            item.classList.remove('drag-over', 'dragging');
            item.style.opacity = '1';
        });
    }

    removeTrack(index) {
        const showConfirmation = true;
        const track = this.playlist[index];
        
        if (showConfirmation) {
            const confirmMessage = `Remove "${track.title}" from playlist?`;
            if (!confirm(confirmMessage)) {
                return;
            }
        }

        // Clean up object URL
        if (track.url) {
            URL.revokeObjectURL(track.url);
        }

        // Remove track from playlist
        this.playlist.splice(index, 1);

        // Handle current track index adjustment
        if (index === this.currentTrackIndex) {
            // Currently playing track is being removed
            this.audioEngine.getCurrentPlayer().pause();
            this.audioEngine.getCurrentPlayer().src = '';
            this.isPlaying = false;
            
            const autoPlayNext = true;
            if (autoPlayNext && this.playlist.length > 0) {
                // Play the next track (or the one that takes its place)
                const nextIndex = Math.min(index, this.playlist.length - 1);
                setTimeout(() => this.playTrack(nextIndex), 100);
            } else {
                this.currentTrackIndex = -1;
                this.updateCurrentTrackDisplay();
            }
        } else if (index < this.currentTrackIndex) {
            // Track before current track was removed, adjust index
            this.currentTrackIndex--;
        }

        this.render();
        this.saveState();
        
        // Update audio controls
        if (window.spectralNexus && window.spectralNexus.uiManager) {
            window.spectralNexus.uiManager.audioControls.updatePlayButton();
        }
    }

    async playTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentTrackIndex = index;
        const track = this.playlist[index];

        const player = this.audioEngine.getCurrentPlayer();
        player.src = track.url;

        try {
            await this.audioEngine.resumeContext();
            await this.audioEngine.connectAudioSource(player);
            await player.play();
            this.isPlaying = true;

            // Update UI after successful play
            if (window.spectralNexus && window.spectralNexus.uiManager) {
                window.spectralNexus.uiManager.audioControls.updatePlayButton();
            }

            this.render();
            this.updateCurrentTrackDisplay();
            this.saveState();
        } catch (error) {
            console.error('Error playing track:', error);
            this.isPlaying = false;
             if (window.spectralNexus && window.spectralNexus.uiManager) {
                window.spectralNexus.uiManager.audioControls.updatePlayButton();
            }
        }
    }

    /**
     * Update the current track display in the playlist panel header
     * This is shown when the playlist panel is collapsed
     */
    updateCurrentTrackDisplay() {
        const displayEl = document.getElementById('current-track-title');
        const iconEl = document.querySelector('.current-track-icon');
        if (!displayEl) return;

        if (this.currentTrackIndex >= 0 && this.playlist[this.currentTrackIndex]) {
            const track = this.playlist[this.currentTrackIndex];
            displayEl.textContent = track.title || 'Unknown Track';
            if (iconEl) iconEl.textContent = this.isPlaying ? '▶' : '⏸';
        } else {
            displayEl.textContent = 'No track playing';
            if (iconEl) iconEl.textContent = '▶';
        }
    }

    nextTrack() {
        if (this.playlist.length === 0) return;

        let nextIndex;
        if (this.repeatMode === 'one') {
            nextIndex = this.currentTrackIndex;
        } else if (this.isShuffle) {
            nextIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        }

        this.playTrack(nextIndex);
    }

    previousTrack() {
        if (this.playlist.length === 0) return;

        let prevIndex;
        if (this.isShuffle) {
            prevIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            prevIndex = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : this.playlist.length - 1;
        }

        this.playTrack(prevIndex);
    }

    onTrackEnded() {
        if (this.repeatMode === 'one') {
            this.playTrack(this.currentTrackIndex);
        } else if (this.repeatMode === 'all' || this.currentTrackIndex < this.playlist.length - 1 || this.isShuffle) {
            this.nextTrack();
        } else {
            this.isPlaying = false;
            this.updateCurrentTrackDisplay();
        }
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        document.getElementById('shuffle-btn').classList.toggle('active', this.isShuffle);
        this.saveState();
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];

        const button = document.getElementById('repeat-btn');
        button.classList.toggle('active', this.repeatMode !== 'off');
        button.textContent = this.repeatMode === 'one' ? '🔂' : '🔁';

        this.saveState();
    }

    updateTrackInfo() {
        const player = this.audioEngine.getCurrentPlayer();
        if (this.currentTrackIndex >= 0 && player.duration) {
            this.playlist[this.currentTrackIndex].duration = player.duration;
            this.render();
        }
    }

    clearPlaylist() {
        const stopOnClear = true;
        if (stopOnClear) {
            // Pause both players
            this.audioEngine.audioPlayer1.pause();
            this.audioEngine.audioPlayer2.pause();
            
            const clearSrc = true;
            if (clearSrc) {
                // Clear the src to release resources, but keep source nodes connected
                this.audioEngine.audioPlayer1.src = '';
                this.audioEngine.audioPlayer2.src = '';
            }
            
            this.audioEngine.audioPlayer1.currentTime = 0;
            this.audioEngine.audioPlayer2.currentTime = 0;

            // DO NOT disconnect source nodes - they need to stay connected for future playback
            // The MediaElementSourceNode can only be created once per audio element
        }
        
        this.playlist.forEach(track => {
            if (track.url) {
                URL.revokeObjectURL(track.url);
            }
        });

        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.updateCurrentTrackDisplay();
        this.render();
        this.saveState();

        if (window.spectralNexus && window.spectralNexus.uiManager) {
            const audioControls = window.spectralNexus.uiManager.audioControls;
            audioControls.updatePlayButton();
            audioControls.updateProgress();
        }
    }

    formatTime(seconds) {
        // Use shared utility function if available, otherwise fallback
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
            currentTrackIndex: this.currentTrackIndex,
            playlistCount: this.playlist.length,
            isShuffle: this.isShuffle,
            repeatMode: this.repeatMode
        };
        localStorage.setItem('spectral-nexus-playlist', JSON.stringify(state));
    }

    loadSavedState() {
        try {
            const saved = localStorage.getItem('spectral-nexus-playlist');
            if (saved) {
                const state = JSON.parse(saved);
                this.isShuffle = state.isShuffle || false;
                this.repeatMode = state.repeatMode || 'off';

                // Update UI
                document.getElementById('shuffle-btn').classList.toggle('active', this.isShuffle);
                document.getElementById('repeat-btn').classList.toggle('active', this.repeatMode !== 'off');
                document.getElementById('repeat-btn').textContent = this.repeatMode === 'one' ? '🔂' : '🔁';
            }
        } catch (error) {
            console.error('Error loading playlist state:', error);
        }
    }

    destroy() {
        // Remove event listeners
        const addFilesBtn = document.getElementById('add-files-btn');
        const fileInput = document.getElementById('file-input');
        const clearPlaylistBtn = document.getElementById('clear-playlist-btn');
        const container = document.getElementById('playlist-items');

        if (addFilesBtn && this._boundHandlers.addFiles) {
            addFilesBtn.removeEventListener('click', this._boundHandlers.addFiles);
        }
        if (fileInput && this._boundHandlers.fileChange) {
            fileInput.removeEventListener('change', this._boundHandlers.fileChange);
        }
        if (clearPlaylistBtn && this._boundHandlers.clearPlaylist) {
            clearPlaylistBtn.removeEventListener('click', this._boundHandlers.clearPlaylist);
        }

        // Remove virtual scroll handler
        if (container && this._virtualScrollHandler) {
            container.removeEventListener('scroll', this._virtualScrollHandler);
            this._virtualScrollHandler = null;
        }
        
        // Clear virtual scroll timeout
        if (this._virtualScrollTimeout) {
            clearTimeout(this._virtualScrollTimeout);
            this._virtualScrollTimeout = null;
        }

        // Remove audio player event listeners
        if (this.audioEngine.audioPlayer1) {
            if (this._boundHandlers.trackEnded) {
                this.audioEngine.audioPlayer1.removeEventListener('ended', this._boundHandlers.trackEnded);
            }
            if (this._boundHandlers.updateTrackInfo) {
                this.audioEngine.audioPlayer1.removeEventListener('loadedmetadata', this._boundHandlers.updateTrackInfo);
            }
        }
        if (this.audioEngine.audioPlayer2) {
            if (this._boundHandlers.trackEnded) {
                this.audioEngine.audioPlayer2.removeEventListener('ended', this._boundHandlers.trackEnded);
            }
            if (this._boundHandlers.updateTrackInfo) {
                this.audioEngine.audioPlayer2.removeEventListener('loadedmetadata', this._boundHandlers.updateTrackInfo);
            }
        }

        // Revoke all object URLs to prevent memory leaks
        this.playlist.forEach(track => {
            if (track.url) {
                URL.revokeObjectURL(track.url);
            }
        });

        // Clear references
        this.playlist = [];
        this._boundHandlers = {};
        
        console.log('PlaylistManager destroyed');
    }
}

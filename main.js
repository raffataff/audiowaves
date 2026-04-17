class TooltipManager {
    constructor() {
        this.showDelay = 500;
        
        this.hideDelay = 100;
        
        this.offset = 8;
        
        this.currentTooltip = null;
        this.showTimeout = null;
        this.hideTimeout = null;
        
        // Store bound handlers for cleanup
        this._boundHandlers = {
            mouseover: null,
            mouseout: null,
            mousemove: null,
            scroll: null,
            resize: null
        };
        
        this.init();
    }
    
    init() {
        const usePassive = true;
        const eventOptions = usePassive ? { passive: true } : false;
        
        // Create bound handlers for proper cleanup
        this._boundHandlers.mouseover = (e) => this.handleMouseOver(e);
        this._boundHandlers.mouseout = (e) => this.handleMouseOut(e);
        this._boundHandlers.mousemove = (e) => this.handleMouseMove(e);
        this._boundHandlers.scroll = () => this.hideTooltip();
        this._boundHandlers.resize = () => this.hideTooltip();
        
        document.addEventListener('mouseover', this._boundHandlers.mouseover, eventOptions);
        document.addEventListener('mouseout', this._boundHandlers.mouseout, eventOptions);
        document.addEventListener('mousemove', this._boundHandlers.mousemove, eventOptions);
        
        document.addEventListener('scroll', this._boundHandlers.scroll, eventOptions);
        window.addEventListener('resize', this._boundHandlers.resize, eventOptions);
    }
    
    destroy() {
        // Remove all event listeners
        const eventOptions = { passive: true };
        
        document.removeEventListener('mouseover', this._boundHandlers.mouseover, eventOptions);
        document.removeEventListener('mouseout', this._boundHandlers.mouseout, eventOptions);
        document.removeEventListener('mousemove', this._boundHandlers.mousemove, eventOptions);
        document.removeEventListener('scroll', this._boundHandlers.scroll, eventOptions);
        window.removeEventListener('resize', this._boundHandlers.resize, eventOptions);
        
        // Clear any pending timeouts
        this.clearTimeouts();
        
        // Remove current tooltip if exists
        if (this.currentTooltip && this.currentTooltip.parentNode) {
            document.body.removeChild(this.currentTooltip);
        }
        this.currentTooltip = null;
        
        console.log('TooltipManager destroyed');
    }
    
    handleMouseOver(e) {
        const element = e.target.closest('[data-tooltip]');
        if (!element) return;
        
        this.clearTimeouts();
        
        this.showTimeout = setTimeout(() => {
            this.showTooltip(element, element.dataset.tooltip);
        }, this.showDelay);
    }
    
    handleMouseOut(e) {
        const element = e.target.closest('[data-tooltip]');
        if (!element) return;
        
        this.clearTimeouts();
        
        this.hideTimeout = setTimeout(() => {
            this.hideTooltip();
        }, this.hideDelay);
    }
    
    handleMouseMove(e) {
        if (this.currentTooltip) {
            const followMouse = false;
            if (followMouse) {
                this.positionTooltip(this.currentTooltip, e.pageX, e.pageY);
            }
        }
    }
    
    showTooltip(element, text) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
        
        // Position tooltip
        this.positionTooltipRelativeToElement(tooltip, element);
        
        // Show tooltip with animation
        setTimeout(() => {
            tooltip.classList.add('visible');
        }, 10);
    }
    
    positionTooltipRelativeToElement(tooltip, element) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let position = 'bottom';
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.bottom + this.offset;
        
        // Check if tooltip would go off-screen and adjust position
        if (top + tooltipRect.height > viewportHeight) {
            position = 'top';
            top = rect.top - tooltipRect.height - this.offset;
        }
        
        if (left < 0) {
            position = 'right';
            left = rect.right + this.offset;
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        } else if (left + tooltipRect.width > viewportWidth) {
            position = 'left';
            left = rect.left - tooltipRect.width - this.offset;
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        }
        
        if (position === 'left' || position === 'right') {
            top = Math.max(this.offset, Math.min(top, viewportHeight - tooltipRect.height - this.offset));
        } else {
            left = Math.max(this.offset, Math.min(left, viewportWidth - tooltipRect.width - this.offset));
            top = Math.max(this.offset, Math.min(top, viewportHeight - tooltipRect.height - this.offset));
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.className = `tooltip ${position}`;
    }
    
    positionTooltip(tooltip, x, y) {
        tooltip.style.left = (x + this.offset) + 'px';
        tooltip.style.top = (y + this.offset) + 'px';
    }
    
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible');
            
            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    document.body.removeChild(this.currentTooltip);
                }
                this.currentTooltip = null;
            }, 200);
        }
        this.clearTimeouts();
    }
    
    clearTimeouts() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
}

/**
 * Keyboard navigation manager for accessibility and power users
 */
class KeyboardManager {
    constructor(spectralNexus) {
        this.spectralNexus = spectralNexus;
        this.enabled = true;
        
        // Store bound handler for cleanup
        this._boundHandler = null;
        
        // Define keyboard shortcuts
        this.shortcuts = {
            // Playback controls
            'Space': () => this.togglePlayPause(),
            ' ': () => this.togglePlayPause(),
            'ArrowLeft': () => this.seekBackward(),
            'ArrowRight': () => this.seekForward(),
            'ArrowUp': () => this.volumeUp(),
            'ArrowDown': () => this.volumeDown(),
            'MediaTrackPrevious': () => this.previousTrack(),
            'MediaTrackNext': () => this.nextTrack(),
            
            // With modifiers
            'Shift+ArrowLeft': () => this.previousTrack(),
            'Shift+ArrowRight': () => this.nextTrack(),
            'KeyM': () => this.toggleMute(),
            'KeyF': () => this.toggleFullscreen(),
            'KeyS': () => this.toggleShuffle(),
            'KeyR': () => this.toggleRepeat(),
            
            // Preset navigation
            'KeyN': () => this.nextPreset(),
            'KeyP': () => this.previousPreset(),
            
            // Help
            'Slash': () => this.showHelp(),
            '?': () => this.showHelp()
        };
        
        this.init();
    }
    
    init() {
        this._boundHandler = (e) => this.handleKeyDown(e);
        document.addEventListener('keydown', this._boundHandler);
    }
    
    handleKeyDown(e) {
        // Don't handle if typing in an input field
        if (this.isInputFocused()) return;
        
        // Build the key combination string
        const key = [];
        if (e.ctrlKey) key.push('Ctrl');
        if (e.altKey) key.push('Alt');
        if (e.shiftKey) key.push('Shift');
        key.push(e.code || e.key);
        
        const combo = key.join('+');
        
        // Check for matching shortcut
        const handler = this.shortcuts[combo] || this.shortcuts[e.code] || this.shortcuts[e.key];
        
        if (handler) {
            e.preventDefault();
            handler();
        }
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
        
        // Check if we're in an input field
        if (inputTypes.includes(activeElement.tagName)) {
            return true;
        }
        
        // Check if we're in a contenteditable element
        if (activeElement.isContentEditable) {
            return true;
        }
        
        // Check if we're in the CodeMirror editor
        if (activeElement.closest('.cm-editor')) {
            return true;
        }
        
        return false;
    }
    
    // Playback actions
    togglePlayPause() {
        if (this.spectralNexus.uiManager?.audioControls) {
            this.spectralNexus.uiManager.audioControls.togglePlayPause();
        }
    }
    
    seekBackward() {
        const player = this.spectralNexus.audioEngine?.getCurrentPlayer();
        if (player && player.duration) {
            player.currentTime = Math.max(0, player.currentTime - 5);
        }
    }
    
    seekForward() {
        const player = this.spectralNexus.audioEngine?.getCurrentPlayer();
        if (player && player.duration) {
            player.currentTime = Math.min(player.duration, player.currentTime + 5);
        }
    }
    
    volumeUp() {
        const audioControls = this.spectralNexus.uiManager?.audioControls;
        if (audioControls) {
            audioControls.setVolume(Math.min(1, audioControls.volume + 0.1));
        }
    }
    
    volumeDown() {
        const audioControls = this.spectralNexus.uiManager?.audioControls;
        if (audioControls) {
            audioControls.setVolume(Math.max(0, audioControls.volume - 0.1));
        }
    }
    
    previousTrack() {
        if (this.spectralNexus.uiManager?.playlistManager) {
            this.spectralNexus.uiManager.playlistManager.previousTrack();
        }
    }
    
    nextTrack() {
        if (this.spectralNexus.uiManager?.playlistManager) {
            this.spectralNexus.uiManager.playlistManager.nextTrack();
        }
    }
    
    toggleMute() {
        const audioControls = this.spectralNexus.uiManager?.audioControls;
        if (audioControls) {
            audioControls.toggleMute();
        }
    }
    
    toggleFullscreen() {
        if (this.spectralNexus.uiManager) {
            this.spectralNexus.uiManager.toggleFullscreen();
        }
    }
    
    toggleShuffle() {
        if (this.spectralNexus.uiManager?.playlistManager) {
            this.spectralNexus.uiManager.playlistManager.toggleShuffle();
        }
    }
    
    toggleRepeat() {
        if (this.spectralNexus.uiManager?.playlistManager) {
            this.spectralNexus.uiManager.playlistManager.toggleRepeat();
        }
    }
    
    nextPreset() {
        const presetManager = this.spectralNexus.uiManager?.presetManager;
        if (presetManager) {
            const nextIndex = (presetManager.currentPreset + 1) % presetManager.shaderPresets.length;
            presetManager.selectPreset(nextIndex);
        }
    }
    
    previousPreset() {
        const presetManager = this.spectralNexus.uiManager?.presetManager;
        if (presetManager) {
            const prevIndex = presetManager.currentPreset === 0 
                ? presetManager.shaderPresets.length - 1 
                : presetManager.currentPreset - 1;
            presetManager.selectPreset(prevIndex);
        }
    }
    
    showHelp() {
        // Create or toggle help dialog
        let helpDialog = document.getElementById('keyboard-help');
        
        if (helpDialog) {
            helpDialog.remove();
            return;
        }
        
        helpDialog = document.createElement('div');
        helpDialog.id = 'keyboard-help';
        helpDialog.className = 'keyboard-help-dialog';
        helpDialog.innerHTML = `
            <div class="keyboard-help-content">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-grid">
                    <div class="shortcut-category">
                        <h4>Playback</h4>
                        <div class="shortcut"><kbd>Space</kbd> Play/Pause</div>
                        <div class="shortcut"><kbd>←</kbd> <kbd>→</kbd> Seek ±5s</div>
                        <div class="shortcut"><kbd>↑</kbd> <kbd>↓</kbd> Volume</div>
                        <div class="shortcut"><kbd>M</kbd> Mute</div>
                        <div class="shortcut"><kbd>Shift+←</kbd> Previous track</div>
                        <div class="shortcut"><kbd>Shift+→</kbd> Next track</div>
                    </div>
                    <div class="shortcut-category">
                        <h4>Visuals</h4>
                        <div class="shortcut"><kbd>N</kbd> Next preset</div>
                        <div class="shortcut"><kbd>P</kbd> Previous preset</div>
                        <div class="shortcut"><kbd>S</kbd> Toggle shuffle</div>
                        <div class="shortcut"><kbd>R</kbd> Toggle repeat</div>
                        <div class="shortcut"><kbd>F</kbd> Fullscreen</div>
                    </div>
                </div>
                <div class="help-footer">Press <kbd>?</kbd> to close</div>
            </div>
        `;
        
        // Add click handler to close
        helpDialog.addEventListener('click', (e) => {
            if (e.target === helpDialog) {
                helpDialog.remove();
            }
        });
        
        document.body.appendChild(helpDialog);
    }
    
    destroy() {
        if (this._boundHandler) {
            document.removeEventListener('keydown', this._boundHandler);
            this._boundHandler = null;
        }
        
        // Remove help dialog if open
        const helpDialog = document.getElementById('keyboard-help');
        if (helpDialog) {
            helpDialog.remove();
        }
        
        console.log('KeyboardManager destroyed');
    }
}

class SpectralNexus {
    constructor() {
        this.canvas = document.getElementById('visualizer-canvas');
        this.audioEngine = new AudioEngine();
        this.shaderEngine = new ShaderEngine(this.canvas);
        this.uiManager = new UIManager(this.audioEngine, this.shaderEngine);
        
        this.tooltipManager = new TooltipManager();
        
        this.isRunning = false;
        this.rafId = null;
        this.lastTime = 0;
        this.frameCount = 0;
        
        this.perfMonitor = {
            fpsCounter: document.getElementById('fps-counter'),
            qualityIndicator: document.getElementById('quality-indicator'),
            lastUpdate: 0
        };
        
        this.resizeObserver = null;
        
        this.initialize();
    }
    
    async initialize() {
        try {
            // Initialize audio engine
            await this.audioEngine.initialize();
            
            // Setup canvas resize using ResizeObserver for robust fullscreen handling
            this.handleResize();
            
            if (window.ResizeObserver) {
                this.resizeObserver = new ResizeObserver(() => {
                    this.handleResize();
                });
                this.resizeObserver.observe(this.canvas);
            } else {
                // Fallback for older browsers
                const usePassiveListener = true;
                window.addEventListener('resize', () => this.handleResize(), usePassiveListener ? { passive: true } : false);
            }
            
            // Setup visibility change handling
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                } else {
                    this.resume();
                }
            });
            
            // Start render loop
            this.start();
            
            console.log('Spectral Nexus initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Spectral Nexus:', error);
        }
    }
    
    handleResize() {
        const useDebouncing = true;
        
        if (useDebouncing) {
            // Use debounced resize for better performance
            this.shaderEngine.debouncedResize();
        } else {
            // Direct resize call without debouncing
            this.shaderEngine.resize();
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.render();
    }
    
    pause() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
    
    resume() {
        if (!this.isRunning) {
            this.start();
        }
    }
    
    render(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.frameCount++;
        
        // Update audio analysis
        this.audioEngine.update();
        const audioData = this.audioEngine.getAudioData();
        
        if (this.uiManager.presetManager.isTransitioning) {
            this.uiManager.presetManager.updateTransition();
        }
        
        // Render visualization
        this.shaderEngine.render(audioData);
        
        // Update performance monitor
        this.updatePerformanceMonitor(deltaTime);
        
        // Schedule next frame
        this.rafId = requestAnimationFrame((time) => this.render(time));
    }
    
    updatePerformanceMonitor(deltaTime) {
        const now = performance.now();
        
        // Update every 500ms
        if (now - this.perfMonitor.lastUpdate > 500) {
            const fps = this.shaderEngine.getFPS();
            const quality = this.shaderEngine.getRenderScale();
            
            this.perfMonitor.fpsCounter.textContent = fps;
            this.perfMonitor.qualityIndicator.textContent = quality + '%';
            
            // Color code FPS
            if (fps >= 55) {
                this.perfMonitor.fpsCounter.style.color = '#00ff00';
            } else if (fps >= 30) {
                this.perfMonitor.fpsCounter.style.color = '#ffff00';
            } else {
                this.perfMonitor.fpsCounter.style.color = '#ff0000';
            }
            
            this.perfMonitor.lastUpdate = now;
        }
    }
    
    destroy() {
        this.pause();
        
        // Remove event listeners
        if (this._boundHandlers.visibilityChange) {
            document.removeEventListener('visibilitychange', this._boundHandlers.visibilityChange);
        }
        if (this._boundHandlers.resize) {
            window.removeEventListener('resize', this._boundHandlers.resize);
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        
        // Destroy keyboard manager
        if (this.keyboardManager) {
            this.keyboardManager.destroy();
        }
        
        // Destroy tooltip manager
        if (this.tooltipManager) {
            this.tooltipManager.destroy();
        }
        
        // Destroy UI manager (cleans up its event listeners)
        if (this.uiManager && this.uiManager.destroy) {
            this.uiManager.destroy();
        }
        
        // Clean up audio resources
        if (this.audioEngine && this.audioEngine.destroy) {
            this.audioEngine.destroy();
        } else if (this.audioEngine && this.audioEngine.audioContext) {
            this.audioEngine.audioContext.close();
        }
        
        // Clean up WebGL
        if (this.shaderEngine && this.shaderEngine.destroy) {
            this.shaderEngine.destroy();
        } else if (this.shaderEngine && this.shaderEngine.gl) {
            this.shaderEngine.gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
        
        console.log('Spectral Nexus destroyed');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for WebGL2 support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        alert('WebGL2 is required but not supported in your browser. Please use a modern browser.');
        return;
    }

    // Show splash screen for 3 seconds, then fade out and initialize app
    const splashScreen = document.getElementById('splash-screen');
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            // Initialize the app after splash screen fades out
            window.spectralNexus = new SpectralNexus();
        }, 1000); // Wait for fade-out animation to complete
    }, 3000); // Show splash for 3 seconds
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.spectralNexus) {
        window.spectralNexus.destroy();
    }
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

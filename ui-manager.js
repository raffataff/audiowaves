/* @tweakable UI management system for coordinating all interface components */
class UIManager {
    constructor(audioEngine, shaderEngine) {
        this.audioEngine = audioEngine;
        this.shaderEngine = shaderEngine;

        // Initialize specialized managers
        this.playlistManager = new PlaylistManager(audioEngine);
        this.presetManager = new PresetManager(shaderEngine);
        this.audioControls = new AudioControls(audioEngine, this.playlistManager);
        this.shaderEditor = new ShaderEditor(shaderEngine);

        // Connect shader editor to preset manager
        this.shaderEditor.setPresetManager(this.presetManager);

        /* @tweakable time in milliseconds before UI auto-hides on mouse inactivity */
        this.autoHideDelay = 6000;
        
        /* @tweakable transition duration for UI show/hide animations */
        this.transitionDuration = 300;
        
        this.mouseInactivityTimer = null;
        this.isUIVisible = true;
        this.isFilePickerOpen = false;
        this.panelStates = {
            playlist: true,
            presets: true,
            editor: false
        };

        // Store bound handlers for cleanup
        this._boundHandlers = {};
        this._dragDropHandlers = [];

        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupUIAutoHide();
        this.setupPanelResize();
        this.loadSavedState();
        this.renderUI();
    }

    setupPanelResize() {
        const editorPanel = document.getElementById('editor-panel');
        if (!editorPanel) return;

        let startX, startWidth;
        
        const onMouseDown = (e) => {
            // Only trigger resize when clicking on the left edge (within 10px of left border)
            // This prevents text selection in the editor from triggering resize
            const panelRect = editorPanel.getBoundingClientRect();
            const clickX = e.clientX;
            const isOnLeftEdge = clickX <= panelRect.left + 10;
            
            if (!isOnLeftEdge) return;
            
            startX = e.clientX;
            startWidth = editorPanel.offsetWidth;
            editorPanel.classList.add('resizing');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
            e.stopPropagation();
        };

        const onMouseMove = (e) => {
            // Dragging left (toward edge) makes wider, dragging right (toward center) makes narrower
            const delta = e.clientX - startX;
            const newWidth = Math.min(800, Math.max(300, startWidth - delta));
            editorPanel.style.width = newWidth + 'px';
        };

        const onMouseUp = () => {
            editorPanel.classList.remove('resizing');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        editorPanel.addEventListener('mousedown', onMouseDown);
    }

    setupEventListeners() {
        // Fullscreen
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            this._boundHandlers.fullscreen = () => this.toggleFullscreen();
            fullscreenBtn.addEventListener('click', this._boundHandlers.fullscreen);
        }

        // Panel toggle buttons
        this.setupPanelToggles();

        // Track file picker dialog state
        this.setupFilePickerTracking();

        /* @tweakable whether to handle window resize in UI manager (handled by main.js now) */
        // Resize handling is delegated to main.js for proper canvas resizing
    }

    setupFilePickerTracking() {
        const addFilesBtn = document.getElementById('add-files-btn');
        const fileInput = document.getElementById('file-input');

        if (addFilesBtn) {
            // Set flag when file picker is about to open
            this._boundHandlers.addFilesClick = () => {
                this.isFilePickerOpen = true;
            };
            addFilesBtn.addEventListener('click', this._boundHandlers.addFilesClick);
        }

        if (fileInput) {
            // Clear flag when file selection is complete (files selected or cancelled)
            this._boundHandlers.fileInputChange = () => {
                this.isFilePickerOpen = false;
            };
            fileInput.addEventListener('change', this._boundHandlers.fileInputChange);
        }

        // Also clear flag on window focus (in case dialog was cancelled)
        this._boundHandlers.windowFocus = () => {
            // Small delay to ensure change event fires first if files were selected
            setTimeout(() => {
                this.isFilePickerOpen = false;
            }, 100);
        };
        window.addEventListener('focus', this._boundHandlers.windowFocus);
    }

    setupDragAndDrop() {
        const dropZone = document.getElementById('drop-zone');
        /* @tweakable playlist panel as a drop target for audio files */
        const playlistPanel = document.getElementById('playlist-panel');
        
        /* @tweakable drag and drop visual feedback opacity */
        const dragOpacity = 0.9;
        
        /* @tweakable drag and drop border animation duration in ms */
        const borderAnimationDuration = 300;

        // Store handlers for cleanup
        const preventDefaultsHandler = (e) => this.preventDefaults(e);
        this._boundHandlers.preventDefaults = preventDefaultsHandler;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, preventDefaultsHandler, false);
            document.body.addEventListener(eventName, preventDefaultsHandler, false);
        });

        // Highlight drop zone when item is dragged over it
        const showDropZoneHandler = () => {
            dropZone.classList.remove('hidden');
            dropZone.style.opacity = dragOpacity;
            dropZone.style.transition = `opacity ${borderAnimationDuration}ms ease`;
        };
        const hideDropZoneHandler = () => {
            dropZone.classList.add('hidden');
            dropZone.style.opacity = '0';
        };
        
        this._boundHandlers.showDropZone = showDropZoneHandler;
        this._boundHandlers.hideDropZone = hideDropZoneHandler;
        
        ['dragenter', 'dragover'].forEach(eventName => {
            document.addEventListener(eventName, showDropZoneHandler, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, hideDropZoneHandler, false);
        });

        // Handle dropped files
        const dropHandler = (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                this.playlistManager.handleFileSelection(files);
            }
        };
        this._boundHandlers.drop = dropHandler;
        document.addEventListener('drop', dropHandler, false);

        /* @tweakable playlist panel drop zone styling and behavior */
        if (playlistPanel) {
            /* @tweakable visual highlight color when dragging over playlist panel */
            const playlistHighlightColor = 'rgba(0, 255, 255, 0.2)';
            /* @tweakable border highlight color for playlist drop area */
            const playlistBorderColor = 'rgba(0, 255, 255, 0.5)';

            // Prevent default on playlist panel
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                playlistPanel.addEventListener(eventName, preventDefaultsHandler, false);
            });

            // Highlight playlist panel when dragging over it
            const playlistDragEnterHandler = (e) => {
                /* @tweakable check if dragged items are files */
                if (e.dataTransfer.types.includes('Files')) {
                    playlistPanel.style.backgroundColor = playlistHighlightColor;
                    playlistPanel.style.borderColor = playlistBorderColor;
                    playlistPanel.style.transition = `all ${borderAnimationDuration}ms ease`;
                }
            };
            this._boundHandlers.playlistDragEnter = playlistDragEnterHandler;
            playlistPanel.addEventListener('dragenter', playlistDragEnterHandler);

            const playlistDragOverHandler = (e) => {
                /* @tweakable ensure files can be dropped by setting dropEffect */
                if (e.dataTransfer.types.includes('Files')) {
                    e.dataTransfer.dropEffect = 'copy';
                    playlistPanel.style.backgroundColor = playlistHighlightColor;
                    playlistPanel.style.borderColor = playlistBorderColor;
                }
            };
            this._boundHandlers.playlistDragOver = playlistDragOverHandler;
            playlistPanel.addEventListener('dragover', playlistDragOverHandler);

            const playlistDragLeaveHandler = (e) => {
                /* @tweakable only remove highlight if leaving the panel completely */
                if (e.target === playlistPanel || !playlistPanel.contains(e.relatedTarget)) {
                    playlistPanel.style.backgroundColor = '';
                    playlistPanel.style.borderColor = '';
                }
            };
            this._boundHandlers.playlistDragLeave = playlistDragLeaveHandler;
            playlistPanel.addEventListener('dragleave', playlistDragLeaveHandler);

            const playlistDropHandler = (e) => {
                /* @tweakable handle file drop on playlist panel */
                const dt = e.dataTransfer;
                const files = dt.files;
                
                if (files.length > 0) {
                    this.playlistManager.handleFileSelection(files);
                }

                /* @tweakable remove visual highlight after drop */
                playlistPanel.style.backgroundColor = '';
                playlistPanel.style.borderColor = '';
                
                /* @tweakable hide global drop zone when dropping on playlist */
                dropZone.classList.add('hidden');
                dropZone.style.opacity = '0';
            };
            this._boundHandlers.playlistDrop = playlistDropHandler;
            playlistPanel.addEventListener('drop', playlistDropHandler);
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    setupPanelToggles() {
        // Add collapse/expand buttons to panel headers
        const playlistHeader = document.querySelector('#playlist-panel .panel-header');
        const presetsHeader = document.querySelector('#presets-panel .panel-header');
        
        // Helper to create the toggle button
        const createToggle = (panelName, container) => {
            const toggle = document.createElement('button');
            toggle.className = 'icon-btn panel-toggle';
            // Use a Down Chevron. CSS rotation will turn it Up when collapsed.
            toggle.textContent = '▼'; 
            toggle.setAttribute('data-tooltip', 'Collapse panel');
            
            const handler = () => this.togglePanel(panelName);
            toggle.addEventListener('click', handler);
            
            // Store for cleanup
            this._boundHandlers[`toggle_${panelName}`] = handler;
            
            // Insert as the last item in the header controls
            container.querySelector('.panel-controls').appendChild(toggle);
        };

        if (playlistHeader) createToggle('playlist', playlistHeader);
        if (presetsHeader) createToggle('presets', presetsHeader);

        // Editor toggle from existing button (keep logic, just ensure it works)
        const editBtn = document.getElementById('edit-shader-btn');
        if (editBtn) {
            const handler = () => this.togglePanel('editor');
            this._boundHandlers.toggleEditor = handler;
            editBtn.addEventListener('click', handler);
        }

        // Also handle the X (close) button in the editor panel
        const closeEditorBtn = document.getElementById('close-editor-btn');
        if (closeEditorBtn) {
            const closeHandler = () => this.togglePanel('editor');
            this._boundHandlers.toggleCloseEditor = closeHandler;
            closeEditorBtn.addEventListener('click', closeHandler);
        }
    }

    setupUIAutoHide() {
        const uiOverlay = document.getElementById('ui-overlay');
        
        // Track mouse movement
        const mouseMoveHandler = () => {
            this.resetAutoHideTimer();
            if (!this.isUIVisible) {
                this.showUI();
            }
        };
        this._boundHandlers.mouseMove = mouseMoveHandler;
        document.addEventListener('mousemove', mouseMoveHandler);

        // Track mouse enter/leave on UI elements
        const mouseEnterHandler = () => this.clearAutoHideTimer();
        const mouseLeaveHandler = () => this.resetAutoHideTimer();
        
        this._boundHandlers.uiMouseEnter = mouseEnterHandler;
        this._boundHandlers.uiMouseLeave = mouseLeaveHandler;
        
        uiOverlay.addEventListener('mouseenter', mouseEnterHandler);
        uiOverlay.addEventListener('mouseleave', mouseLeaveHandler);

        // Start the timer
        this.resetAutoHideTimer();
    }

    resetAutoHideTimer() {
        this.clearAutoHideTimer();
        this.mouseInactivityTimer = setTimeout(() => {
            this.hideUI();
        }, this.autoHideDelay);
    }

    clearAutoHideTimer() {
        if (this.mouseInactivityTimer) {
            clearTimeout(this.mouseInactivityTimer);
            this.mouseInactivityTimer = null;
        }
    }

    showUI() {
        if (this.isUIVisible) return;
        
        this.isUIVisible = true;
        const uiOverlay = document.getElementById('ui-overlay');
        uiOverlay.classList.remove('ui-hidden');
        uiOverlay.style.transition = `opacity ${this.transitionDuration}ms ease`;
    }

    hideUI() {
        if (!this.isUIVisible) return;
        
        // Don't auto-hide if shader editor panel is open
        if (this.panelStates.editor) return;
        
        // Don't auto-hide if file picker dialog is open
        if (this.isFilePickerOpen) return;
        
        this.isUIVisible = false;
        const uiOverlay = document.getElementById('ui-overlay');
        uiOverlay.classList.add('ui-hidden');
        uiOverlay.style.transition = `opacity ${this.transitionDuration}ms ease`;
    }

    togglePanel(panelName) {
        this.panelStates[panelName] = !this.panelStates[panelName];
        
        const panelMap = {
            playlist: 'playlist-panel',
            presets: 'presets-panel',
            editor: 'editor-panel'
        };

        const panel = document.getElementById(panelMap[panelName]);
        if (!panel) return;

        if (panelName === 'editor') {
            // Editor is now a side panel on the right - toggle hidden class
            panel.classList.toggle('hidden', !this.panelStates[panelName]);
            if (this.panelStates[panelName] && !this.shaderEditor.monacoEditor) {
                this.shaderEditor.initializeShaderEditor();
            }
        } else if (panelName === 'presets') {
            // Presets is now a bottom panel (horizontal) - use collapsed class
            panel.classList.toggle('collapsed', !this.panelStates[panelName]);
            // Update toggle button direction for horizontal panel
            const toggle = document.querySelector('#presets-panel .panel-toggle');
            if (toggle) {
                toggle.textContent = this.panelStates[panelName] ? '◀' : '▶';
            }
        } else {
            // Playlist is a side panel - use collapsed class (height-based, collapses upward)
            panel.classList.toggle('collapsed', !this.panelStates[panelName]);
            
            // Update toggle button text - up arrow when expanded (click to collapse up), down when collapsed
            if (panelName === 'playlist') {
                const toggle = document.querySelector('#playlist-panel .panel-toggle');
                toggle.textContent = this.panelStates[panelName] ? '▼' : '▲';
            }
        }

        this.saveUIState();
    }

    saveUIState() {
        const state = {
            panelStates: this.panelStates,
            isUIVisible: this.isUIVisible
        };
        localStorage.setItem('spectral-nexus-ui', JSON.stringify(state));
    }

    loadSavedState() {
        this.playlistManager.loadSavedState();
        this.presetManager.loadSavedState();
        this.audioControls.loadSavedState();
        
        // Load UI state
        try {
            const saved = localStorage.getItem('spectral-nexus-ui');
            if (saved) {
                const state = JSON.parse(saved);
                this.panelStates = { ...this.panelStates, ...state.panelStates };
                
                // Always keep editor closed by default
                this.panelStates.editor = false;
                
                // Apply saved panel states
                Object.keys(this.panelStates).forEach(panelName => {
                    if (!this.panelStates[panelName]) {
                        setTimeout(() => this.togglePanel(panelName), 100);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading UI state:', error);
        }
    }

    renderUI() {
        this.playlistManager.render();
        this.presetManager.render();
        this.audioControls.updatePlayButton();

        // Load the initial shader preset
        if (this.presetManager.shaderPresets.length > 0) {
            const initialPreset = this.presetManager.shaderPresets[this.presetManager.currentPreset];
            this.presetManager.loadPresetShader(initialPreset);
            
            /* @tweakable delay to ensure shader compilation before setting parameters */
            setTimeout(() => {
                this.shaderEngine.setPresetParams(initialPreset.params);
            }, 100);
        }
    }

    destroy() {
        // Clear auto-hide timer
        this.clearAutoHideTimer();
        
        // Remove document-level event listeners
        const preventDefaultsHandler = this._boundHandlers.preventDefaults;
        if (preventDefaultsHandler) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                document.removeEventListener(eventName, preventDefaultsHandler, false);
                document.body.removeEventListener(eventName, preventDefaultsHandler, false);
            });
        }
        
        if (this._boundHandlers.showDropZone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                document.removeEventListener(eventName, this._boundHandlers.showDropZone, false);
            });
        }
        
        if (this._boundHandlers.hideDropZone) {
            ['dragleave', 'drop'].forEach(eventName => {
                document.removeEventListener(eventName, this._boundHandlers.hideDropZone, false);
            });
        }
        
        if (this._boundHandlers.drop) {
            document.removeEventListener('drop', this._boundHandlers.drop, false);
        }
        
        if (this._boundHandlers.mouseMove) {
            document.removeEventListener('mousemove', this._boundHandlers.mouseMove);
        }
        
        // Remove fullscreen handler
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn && this._boundHandlers.fullscreen) {
            fullscreenBtn.removeEventListener('click', this._boundHandlers.fullscreen);
        }
        
        // Remove editor toggle handler
        const editBtn = document.getElementById('edit-shader-btn');
        if (editBtn && this._boundHandlers.toggleEditor) {
            editBtn.removeEventListener('click', this._boundHandlers.toggleEditor);
        }
        
        // Remove close editor button handler
        const closeEditorBtn = document.getElementById('close-editor-btn');
        if (closeEditorBtn && this._boundHandlers.toggleCloseEditor) {
            closeEditorBtn.removeEventListener('click', this._boundHandlers.toggleCloseEditor);
        }
        
        // Remove file picker tracking handlers
        const addFilesBtn = document.getElementById('add-files-btn');
        if (addFilesBtn && this._boundHandlers.addFilesClick) {
            addFilesBtn.removeEventListener('click', this._boundHandlers.addFilesClick);
        }
        
        const fileInput = document.getElementById('file-input');
        if (fileInput && this._boundHandlers.fileInputChange) {
            fileInput.removeEventListener('change', this._boundHandlers.fileInputChange);
        }
        
        if (this._boundHandlers.windowFocus) {
            window.removeEventListener('focus', this._boundHandlers.windowFocus);
        }
        
        // Destroy child managers if they have destroy methods
        if (this.playlistManager && this.playlistManager.destroy) {
            this.playlistManager.destroy();
        }
        if (this.audioControls && this.audioControls.destroy) {
            this.audioControls.destroy();
        }
        if (this.shaderEditor && this.shaderEditor.destroy) {
            this.shaderEditor.destroy();
        }
        
        // Clear references
        this._boundHandlers = {};
        
        console.log('UIManager destroyed');
    }
}
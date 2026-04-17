import { Visualizations } from './visualizations.js';
import { LoudnessMeter } from './loudness-meter.js';

class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.audioElement = null;
        this.source = null;
        this.analyzer = null;
        this.splitter = null;
        this.analyzerL = null;
        this.analyzerR = null;
        this.analyzerMid = null;
        this.analyzerSide = null;
        this.isPlaying = false;
        this.animationId = null;
        this.spectrumSlope = 0; 
        
        this.lowpassFilter = null;
        this.highpassFilter = null;
        this.isolationEnabled = false;
        this.lowCutoff = 5;
        this.highCutoff = 24000;

        this.spectrogramSettings = { min: -100, max: -5 };
        this.goniometerAutoGain = false;
        this.goniometerTrailLength = 0.3; // alpha for fade
        this.activeStream = null;
        
        // --- PEAK HOLD LOGIC ---
        this.peakStateL = { value: -140, lastPeakTime: 0 };
        this.peakStateR = { value: -140, lastPeakTime: 0 };
        this.PEAK_HOLD_TIME = 1500; 
        this.PEAK_DROP_RATE = 20;   

        this.meterState = {
            momentary: 0,
            shortTerm: 0
        };

        this.tonalStats = { low: 0, mid: 0, high: 0, count: 0 };

        this.psrSmoothed = 0; 
        this.psrAverage = 0;  

        this.thresholds = {
            bass: -27.0,
            mid: -29.0,
            high: -48.0
        };
        this.smoothing = 0.8;
        
        this.fps = 60; 
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        
        this.canvas = document.getElementById('visualizer');
        // Optimized context for frequent redraws
        this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });
        this.visualizations = new Visualizations(this.canvas, this.ctx, (type, val) => this.handleThresholdChange(type, val));
        
        this.currentMode = 'spectrum';
        this.currentFFTSize = 8192;
        this.spectrumStyle = 'bars';
        this.currentFileName = '';
        
        this.isSeeking = false;
        this.dragging = null; 
        this.dragStart = { x: 0, freq: 0, lowCutoff: 0, highCutoff: 0 };
        this.mousePos = null;

        this.metricBuffers = {
            dataArrayL: null, dataArrayR: null, dataArrayLTime: null, dataArrayRTime: null
        };

        this.colorCache = {};

        this.setupCanvas();
        this.setupEventListeners();
        this.setupColorCache(); // Initialize Cache
        this.updateControlVisibility();
      
        window.addEventListener('resize', () => this.setupCanvas());
    }

    setupColorCache() {
        const colorInputs = document.querySelectorAll('input[type="color"]');
        
        const updateCache = () => {
             this.colorCache = {
                spectrum: {
                    lowAmp: document.getElementById('colorSpecLow')?.value || '#0000ff',
                    midAmp: document.getElementById('colorSpecMid')?.value || '#00ff00',
                    highAmp: document.getElementById('colorSpecHigh')?.value || '#ff0000',
                    thresholdBass: document.getElementById('colorThreshBass')?.value,
                    thresholdMid: document.getElementById('colorThreshMid')?.value,
                    thresholdHigh: document.getElementById('colorThreshHigh')?.value,
                    midChan: document.getElementById('colorSpecMidChan')?.value || '#00ff88',
                    sideChan: document.getElementById('colorSpecSideChan')?.value || '#ffaa00'
                },
                loudness: {
                    momentary: document.getElementById('colorMomentary')?.value,
                    shortTerm: document.getElementById('colorShortTerm')?.value,
                    integrated: document.getElementById('colorIntegrated')?.value,
                    target: document.getElementById('colorTarget')?.value
                },
                stereo: {
                    balance: document.getElementById('colorBalance')?.value,
                    corrGood: document.getElementById('colorCorrGood')?.value,
                    corrWarn: document.getElementById('colorCorrWarn')?.value,
                    corrBad: document.getElementById('colorCorrBad')?.value
                },
                goniometer: {
                    trace: document.getElementById('colorGoniTrace')?.value,
                    trail: document.getElementById('colorGoniTrail')?.value
                },
                waveform: {
                    left: document.getElementById('colorWaveLeft')?.value,
                    right: document.getElementById('colorWaveRight')?.value,
                    diff: document.getElementById('colorWaveDiff')?.value
                },
                spectrogram: {
                    low: document.getElementById('colorSpecgramLow')?.value,
                    mid: document.getElementById('colorSpecgramMid')?.value,
                    high: document.getElementById('colorSpecgramHigh')?.value
                }
            };
        };

        // Initial Load
        updateCache();

        // Listen for changes
        colorInputs.forEach(input => {
            input.addEventListener('input', updateCache);
        });
        
        // Also listen to reset button
        const resetBtn = document.getElementById('resetColors');
        if(resetBtn) resetBtn.addEventListener('click', () => setTimeout(updateCache, 10));
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth * window.devicePixelRatio;
        this.canvas.height = container.clientHeight * window.devicePixelRatio;
        this.canvas.style.width = container.clientWidth + 'px';
        this.canvas.style.height = container.clientHeight + 'px';
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    handleThresholdChange(type, value) {
        if (this.thresholds[type] !== undefined) {
            this.thresholds[type] = value;
            const slider = document.getElementById(type === 'bass' ? 'thresholdBass' : type === 'mid' ? 'thresholdMid' : 'thresholdHigh');
            const valueDisplay = document.getElementById(slider.id + 'Value');
            if (slider) slider.value = value;
            if (valueDisplay) valueDisplay.textContent = `${value.toFixed(1)} dB`;
        }
    }
    
    updateControlVisibility() {
        const ctrls = {
            fft: document.getElementById('fftSize'),
            style: document.getElementById('spectrumStyle'),
            slope: document.getElementById('spectrumSlope'),
            iso: document.getElementById('toggleIsolation'),
            isoGroup: document.querySelector('.isolation-group'),
            thresholds: document.getElementById('spectrumControls'),
            smooth: document.getElementById('smoothingControl'),
            goniControls: document.getElementById('goniometerControls'),
            specRange: document.getElementById('spectrogramControls'),
            clearPeaks: document.getElementById('clearPeaks'),
            colorParent: document.getElementById('colorControls'),
            spectrumColors: document.getElementById('spectrumColors'),
            loudnessColors: document.querySelectorAll('.loudness-colors'),
            stereoColors: document.querySelectorAll('.stereo-colors'),
            goniometerColors: document.querySelectorAll('.goniometer-colors'),
            waveformColors: document.querySelectorAll('.waveform-colors'),
            spectrogramColors: document.querySelectorAll('.spectrogram-colors')
        };

        // 1. Hide Everything First
        if(ctrls.style) ctrls.style.style.display = 'none';
        if(ctrls.slope) ctrls.slope.style.display = 'none';
        if(ctrls.goniControls) ctrls.goniControls.style.display = 'none';
        if(ctrls.specRange) ctrls.specRange.style.display = 'none';
        if(ctrls.colorParent) ctrls.colorParent.style.display = 'none';
        if(ctrls.spectrumColors) ctrls.spectrumColors.style.display = 'none';
        
        ctrls.loudnessColors.forEach(el => el.style.display = 'none');
        ctrls.stereoColors.forEach(el => el.style.display = 'none');
        ctrls.goniometerColors.forEach(el => el.style.display = 'none');
        ctrls.waveformColors.forEach(el => el.style.display = 'none');
        ctrls.spectrogramColors.forEach(el => el.style.display = 'none');

        // 2. Show Defaults
        if(ctrls.fft) ctrls.fft.style.display = 'inline-flex';
        if(ctrls.iso) ctrls.iso.style.display = 'inline-flex';
        if(ctrls.isoGroup) ctrls.isoGroup.style.display = 'flex';
        if(ctrls.thresholds) ctrls.thresholds.style.display = 'flex';
        if(ctrls.smooth) ctrls.smooth.style.display = 'flex';
        if(ctrls.clearPeaks) ctrls.clearPeaks.style.display = 'inline-flex';

        // 3. Mode Specifics
        switch(this.currentMode) {
            case 'spectrum':
                if(ctrls.style) ctrls.style.style.display = 'inline-flex';
                if(ctrls.slope) ctrls.slope.style.display = 'inline-flex';
                if(ctrls.colorParent) ctrls.colorParent.style.display = 'flex';
                if(ctrls.spectrumColors) ctrls.spectrumColors.style.display = 'flex';
                break;
            case 'loudness':
                if(ctrls.fft) ctrls.fft.style.display = 'none';
                if(ctrls.iso) ctrls.iso.style.display = 'none';
                if(ctrls.isoGroup) ctrls.isoGroup.style.display = 'none';
                if(ctrls.thresholds) ctrls.thresholds.style.display = 'none';
                if(ctrls.smooth) ctrls.smooth.style.display = 'none';
                if(ctrls.colorParent) ctrls.colorParent.style.display = 'flex';
                ctrls.loudnessColors.forEach(el => el.style.display = 'flex');
                break;
            case 'stereo':
                if(ctrls.style) ctrls.style.display = 'none';
                if(ctrls.slope) ctrls.slope.style.display = 'none';
                if(ctrls.iso) ctrls.iso.style.display = 'none';
                if(ctrls.isoGroup) ctrls.isoGroup.style.display = 'none';
                if(ctrls.thresholds) ctrls.thresholds.style.display = 'none';
                if(ctrls.smooth) ctrls.smooth.style.display = 'none';
                if(ctrls.colorParent) ctrls.colorParent.style.display = 'flex';
                ctrls.stereoColors.forEach(el => el.style.display = 'flex');
                break;
            case 'goniometer':
                if(ctrls.goniControls) ctrls.goniControls.style.display = 'inline-flex';
                if(ctrls.iso) ctrls.iso.style.display = 'none';
                if(ctrls.isoGroup) ctrls.isoGroup.style.display = 'none';
                if(ctrls.thresholds) ctrls.thresholds.style.display = 'none';
                if(ctrls.smooth) ctrls.smooth.style.display = 'none';
                if(ctrls.colorParent) ctrls.colorParent.style.display = 'flex';
                ctrls.goniometerColors.forEach(el => el.style.display = 'flex');
                break;
            case 'waveform':
                if(ctrls.iso) ctrls.iso.style.display = 'none';
                if(ctrls.isoGroup) ctrls.isoGroup.style.display = 'none';
                if(ctrls.thresholds) ctrls.thresholds.style.display = 'none';
                if(ctrls.smooth) ctrls.smooth.style.display = 'none';
                if(ctrls.colorParent) ctrls.colorParent.style.display = 'flex';
                ctrls.waveformColors.forEach(el => el.style.display = 'flex');
                break;
            case 'spectrogram':
                if(ctrls.specRange) ctrls.specRange.style.display = 'flex';
                if(ctrls.iso) ctrls.iso.style.display = 'none';
                if(ctrls.isoGroup) ctrls.isoGroup.style.display = 'none';
                if(ctrls.thresholds) ctrls.thresholds.style.display = 'none';
                if(ctrls.smooth) ctrls.smooth.style.display = 'none';
                if(ctrls.colorParent) ctrls.colorParent.style.display = 'flex';
                ctrls.spectrogramColors.forEach(el => el.style.display = 'flex');
                break;
        }
    }

    setupEventListeners() {
        const fileInput = document.getElementById('audioFile');
        const liveInputBtn = document.getElementById('liveInput');
        const playPauseBtn = document.getElementById('playPause');
        const fullscreenBtn = document.getElementById('fullscreen');
        const modeSelect = document.getElementById('visualMode');
        const fftSizeSelect = document.getElementById('fftSize');
        const playbackRateSelect = document.getElementById('playbackRate');
        const screenshotBtn = document.getElementById('screenshot');
        const resetViewBtn = document.getElementById('resetView');
        const goniometerModeSelect = document.getElementById('goniometerMode');
        const clearPeaksBtn = document.getElementById('clearPeaks');
        const spectrumStyleSelect = document.getElementById('spectrumStyle');
        const spectrumSlopeSelect = document.getElementById('spectrumSlope');
        const seekBar = document.getElementById('seekBar');
        const toggleIsolationBtn = document.getElementById('toggleIsolation');
        const lowCutoffSlider = document.getElementById('lowCutoff');
        const highCutoffSlider = document.getElementById('highCutoff');
        const thresholdBassSlider = document.getElementById('thresholdBass');
        const thresholdMidSlider = document.getElementById('thresholdMid');
        const thresholdHighSlider = document.getElementById('thresholdHigh');
        
        // Spectrogram Controls
        const specMinSlider = document.getElementById('specMin');
        const specMaxSlider = document.getElementById('specMax');
        const goniAutoGainBtn = document.getElementById('goniAutoGain');
        if (goniAutoGainBtn) {
            goniAutoGainBtn.addEventListener('click', () => {
                this.goniometerAutoGain = !this.goniometerAutoGain;
                goniAutoGainBtn.textContent = this.goniometerAutoGain ? 'AGC ON' : 'AGC OFF';
                goniAutoGainBtn.classList.toggle('active');
            });
        }

        // Goniometer Trails Toggle
        const goniTrailLengthSlider = document.getElementById('goniTrailLength');
        if (goniTrailLengthSlider) {
            goniTrailLengthSlider.addEventListener('input', (e) => {
                // Invert slider: 5 (short/fast fade) to 95 (long/slow fade)
                // We convert to alpha for destination-out: 
                // high slider value = slow fade = low alpha removal
                const val = parseInt(e.target.value);
                this.goniometerTrailLength = (100 - val) / 100;
            });
        }

        const goniTrailsBtn = document.getElementById('goniTrails');
        if (goniTrailsBtn) {
            // Initialize text / state
            goniTrailsBtn.textContent = 'TRAILS ON';
            goniTrailsBtn.classList.remove('active');

            goniTrailsBtn.addEventListener('click', () => {
                // Toggle visual flag on the goniometer visualizer (if initialized)
                const vis = this.visualizations && this.visualizations.goniometerVis;
                if (vis) {
                    vis.setTrails(!vis.trailsEnabled);
                    goniTrailsBtn.textContent = vis.trailsEnabled ? 'TRAILS ON' : 'TRAILS OFF';
                    goniTrailsBtn.classList.toggle('active', vis.trailsEnabled);
                } else {
                    // if not ready yet, flip button appearance
                    const isActive = goniTrailsBtn.classList.toggle('active');
                    goniTrailsBtn.textContent = isActive ? 'TRAILS ON' : 'TRAILS OFF';
                }
            });
        }
        
        // Color Reset
        const resetColorsBtn = document.getElementById('resetColors');

        // Canvas Interactions
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => { this.handleMouseUp(); this.mousePos = null; });
        this.canvas.addEventListener('wheel', (e) => {
            if (this.currentMode === 'loudness' || this.currentMode === 'spectrum') {
                this.visualizations.handleWheel(e, this.currentMode);
            }
        }, { passive: false });
        
        fileInput.addEventListener('change', (e) => this.loadAudio(e));
        if (liveInputBtn) liveInputBtn.addEventListener('click', () => this.startLiveInput());
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        modeSelect.addEventListener('change', (e) => {
            this.currentMode = e.target.value;
            this.updateControlVisibility();
        });

        if (specMinSlider) specMinSlider.addEventListener('input', (e) => {
            this.spectrogramSettings.min = parseInt(e.target.value);
            document.getElementById('specMinValue').textContent = this.spectrogramSettings.min;
        });
        if (specMaxSlider) specMaxSlider.addEventListener('input', (e) => {
            this.spectrogramSettings.max = parseInt(e.target.value);
            document.getElementById('specMaxValue').textContent = this.spectrogramSettings.max;
        });
        
        if (resetColorsBtn) {
            resetColorsBtn.addEventListener('click', () => {
                // Reset all color inputs to defaults (simple hard reload style for now or map values)
                const defaults = {
                    colorSpecLow: '#0000ff', colorSpecMid: '#00ff00', colorSpecHigh: '#ff0000',
                    colorThreshBass: '#00ff88', colorThreshMid: '#00aaff', colorThreshHigh: '#ff00aa',
                    colorSpecMidChan: '#00ff88', colorSpecSideChan: '#ffaa00',
                    colorMomentary: '#00aaff', colorShortTerm: '#00ff88', colorIntegrated: '#ffffff', colorTarget: '#ff0055',
                    colorBalance: '#00aaff', colorCorrGood: '#00ff88', colorCorrWarn: '#ffaa00', colorCorrBad: '#ff3333',
                    colorGoniTrace: '#00ff88',
                    colorWaveLeft: '#00aaff', colorWaveRight: '#ff00aa', colorWaveDiff: '#00ff88',
                    colorSpecgramLow: '#000080', colorSpecgramMid: '#00ffff', colorSpecgramHigh: '#ff0000'
                };
                for (const [id, val] of Object.entries(defaults)) {
                    const el = document.getElementById(id);
                    if(el) el.value = val;
                }
            });
        }
      
        fftSizeSelect.addEventListener('change', (e) => {
            this.currentFFTSize = parseInt(e.target.value);
            if (this.analyzer) {
                this.analyzer.fftSize = this.currentFFTSize;
                this.analyzerL.fftSize = this.currentFFTSize;
                this.analyzerR.fftSize = this.currentFFTSize;
                if(this.analyzerMid) this.analyzerMid.fftSize = this.currentFFTSize;
                if(this.analyzerSide) this.analyzerSide.fftSize = this.currentFFTSize;
                this.initMetricBuffers();
            }
        });
        
        playbackRateSelect.addEventListener('change', (e) => {
            if (this.audioElement) this.audioElement.playbackRate = parseFloat(e.target.value);
        });
        
        if(seekBar) {
            seekBar.addEventListener('input', (e) => {
                const time = parseFloat(e.target.value);
                if (this.audioElement) {
                    this.audioElement.currentTime = time;
                    this.updateSeekProgress();
                }
            });
            seekBar.addEventListener('mousedown', () => this.isSeeking = true);
            seekBar.addEventListener('mouseup', () => this.isSeeking = false);
        }

        thresholdBassSlider.addEventListener('input', (e) => this.handleThresholdChange('bass', parseFloat(e.target.value)));
        thresholdMidSlider.addEventListener('input', (e) => this.handleThresholdChange('mid', parseFloat(e.target.value)));
        thresholdHighSlider.addEventListener('input', (e) => this.handleThresholdChange('high', parseFloat(e.target.value)));
        
        const smoothingSlider = document.getElementById('smoothing');
        smoothingSlider.addEventListener('input', (e) => {
            this.smoothing = parseInt(e.target.value) / 100;
            document.getElementById('smoothingValue').textContent = `${e.target.value}%`;
            if (this.analyzer) {
                this.analyzer.smoothingTimeConstant = this.smoothing;
                this.analyzerL.smoothingTimeConstant = this.smoothing;
                this.analyzerR.smoothingTimeConstant = this.smoothing;
                if(this.analyzerMid) this.analyzerMid.smoothingTimeConstant = this.smoothing;
                if(this.analyzerSide) this.analyzerSide.smoothingTimeConstant = this.smoothing;
            }
        });
        
        screenshotBtn.addEventListener('click', () => this.takeScreenshot());
        
        resetViewBtn.addEventListener('click', () => {
            this.visualizations.resetView();
        });

        clearPeaksBtn.addEventListener('click', () => {
            this.visualizations.reset();
            if (this.loudnessMeter) this.loudnessMeter.reset();
        });
        
        goniometerModeSelect.addEventListener('change', (e) => { this.visualizations.goniometerMode = e.target.value; });
        spectrumStyleSelect.addEventListener('change', (e) => { this.spectrumStyle = e.target.value; });
        spectrumSlopeSelect.addEventListener('change', (e) => { this.spectrumSlope = parseFloat(e.target.value); });
        
        toggleIsolationBtn.addEventListener('click', () => {
            this.isolationEnabled = !this.isolationEnabled;
            toggleIsolationBtn.classList.toggle('active');
            toggleIsolationBtn.textContent = this.isolationEnabled ? 'ISO ON' : 'ISO OFF';
            const controls = document.querySelectorAll('.isolation-control');
            controls.forEach(ctrl => { ctrl.style.display = this.isolationEnabled ? 'flex' : 'none'; });
            this.updateFilters();
        });
        
        lowCutoffSlider.addEventListener('input', (e) => {
            this.lowCutoff = parseInt(e.target.value);
            if (this.lowCutoff >= this.highCutoff) { this.lowCutoff = this.highCutoff - 10; lowCutoffSlider.value = this.lowCutoff; }
            document.getElementById('lowCutoffValue').textContent = this.lowCutoff >= 1000 ? `${(this.lowCutoff / 1000).toFixed(1)}k Hz` : `${this.lowCutoff} Hz`;
            this.updateFilters();
        });
        
        highCutoffSlider.addEventListener('input', (e) => {
            this.highCutoff = parseInt(e.target.value);
            if (this.highCutoff <= this.lowCutoff) { this.highCutoff = this.lowCutoff + 10; highCutoffSlider.value = this.highCutoff; }
            document.getElementById('highCutoffValue').textContent = this.highCutoff >= 1000 ? `${(this.highCutoff / 1000).toFixed(1)}k Hz` : `${this.highCutoff} Hz`;
            this.updateFilters();
        });
        
        const infoHeader = document.querySelector('.info-header');
        if (infoHeader) infoHeader.addEventListener('click', () => { document.getElementById('info').classList.toggle('collapsed'); });
    }
    
    handleMouseDown(e) {
        if (!this.isolationEnabled || this.currentMode !== 'spectrum') {
            // Pass through if not interacting with ISO
            if (this.currentMode === 'loudness' || this.currentMode === 'spectrum') {
                this.visualizations.handleMouseDown(e, this.currentMode);
            }
            return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const freq = this.xToFreq(x);
        
        const lowX = this.freqToX(this.lowCutoff);
        const highX = this.freqToX(this.highCutoff);
        const pixelTolerance = 10;
        
        if (Math.abs(x - lowX) < pixelTolerance) {
            this.dragging = 'low';
            this.dragStart = { x, freq, lowCutoff: this.lowCutoff, highCutoff: this.highCutoff };
        } else if (Math.abs(x - highX) < pixelTolerance) {
            this.dragging = 'high';
            this.dragStart = { x, freq, lowCutoff: this.lowCutoff, highCutoff: this.highCutoff };
        } else if (x > lowX && x < highX) {
            this.dragging = 'band';
            this.dragStart = { x, freq, lowCutoff: this.lowCutoff, highCutoff: this.highCutoff };
        } else {
            // Not clicking a handle, pass through
            this.visualizations.handleMouseDown(e, this.currentMode);
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.mousePos = { x, y };

        if (!this.dragging && (this.currentMode === 'loudness' || this.currentMode === 'spectrum')) {
             this.visualizations.handleMouseMove(e, this.currentMode);
        }

        if (!this.dragging) {
            if (!this.isolationEnabled || this.currentMode !== 'spectrum') return false;
            const lowX = this.freqToX(this.lowCutoff);
            const highX = this.freqToX(this.highCutoff);
            const pixelTolerance = 10;
            if (Math.abs(x - lowX) < pixelTolerance || Math.abs(x - highX) < pixelTolerance) {
                this.canvas.style.cursor = 'ew-resize';
                return true;
            } else if (x > lowX && x < highX) {
                this.canvas.style.cursor = 'move';
                return true;
            }
            this.canvas.style.cursor = 'default';
            return false;
        }
        
        const freq = this.xToFreq(x);
        
        if (this.dragging === 'low') {
            this.lowCutoff = Math.max(5, Math.min(freq, this.highCutoff - 5));
            document.getElementById('lowCutoff').value = this.lowCutoff;
            document.getElementById('lowCutoffValue').textContent = this.lowCutoff >= 1000 ? `${(this.lowCutoff / 1000).toFixed(1)}k Hz` : `${Math.round(this.lowCutoff)} Hz`;
        } else if (this.dragging === 'high') {
            this.highCutoff = Math.max(this.lowCutoff + 5, Math.min(24000, freq));
            document.getElementById('highCutoff').value = this.highCutoff;
            document.getElementById('highCutoffValue').textContent = this.highCutoff >= 1000 ? `${(this.highCutoff / 1000).toFixed(1)}k Hz` : `${Math.round(this.highCutoff)} Hz`;
        } else if (this.dragging === 'band') {
            const ratio = freq / this.dragStart.freq;
            let newLow = this.dragStart.lowCutoff * ratio;
            let newHigh = this.dragStart.highCutoff * ratio;
            if (newLow < 5) { newLow = 5; newHigh = 5 * (this.dragStart.highCutoff / this.dragStart.lowCutoff); }
            if (newHigh > 24000) { newHigh = 24000; newLow = 24000 * (this.dragStart.lowCutoff / this.dragStart.highCutoff); }
            this.lowCutoff = newLow;
            this.highCutoff = newHigh;
            document.getElementById('lowCutoff').value = this.lowCutoff;
            document.getElementById('highCutoff').value = this.highCutoff;
            document.getElementById('lowCutoffValue').textContent = this.lowCutoff >= 1000 ? `${(this.lowCutoff / 1000).toFixed(1)}k Hz` : `${Math.round(this.lowCutoff)} Hz`;
            document.getElementById('highCutoffValue').textContent = this.highCutoff >= 1000 ? `${(this.highCutoff / 1000).toFixed(1)}k Hz` : `${Math.round(this.highCutoff)} Hz`;
        }
        
        this.updateFilters();
        return true;
    }
    
    handleMouseUp() {
        this.dragging = null;
        if (this.currentMode === 'loudness' || this.currentMode === 'spectrum') {
            this.visualizations.handleMouseUp(this.currentMode);
        }
    }
    
    xToFreq(x) {
        const width = this.canvas.width / window.devicePixelRatio;
        if (this.visualizations && this.visualizations.spectrumVis) return this.visualizations.spectrumVis.getFreqFromX(x, width);
        return 20; // Fallback
    }
    
    freqToX(freq) {
        const width = this.canvas.width / window.devicePixelRatio;
        if (this.visualizations && this.visualizations.spectrumVis) return this.visualizations.spectrumVis.getXFromFreq(freq, width);
        return 0; // Fallback
    }

    initMetricBuffers() {
        if (!this.analyzerL) return;
        const freqBinCount = this.analyzerL.frequencyBinCount;
        const timeBinCount = this.analyzerL.fftSize;
        
        if (!this.metricBuffers.dataArrayL || this.metricBuffers.dataArrayL.length !== freqBinCount) {
            this.metricBuffers.dataArrayL = new Uint8Array(freqBinCount);
            this.metricBuffers.dataArrayR = new Uint8Array(freqBinCount);
            this.metricBuffers.dataArrayLTime = new Float32Array(timeBinCount);
            this.metricBuffers.dataArrayRTime = new Float32Array(timeBinCount);
        }
    }

    async cleanupAudioContext() {
        if (this.isPlaying) {
            if (this.audioElement) this.audioElement.pause();
            this.isPlaying = false;
            document.getElementById('playPause').classList.remove('playing');
        }
        if (this.animationId) cancelAnimationFrame(this.animationId);
        
        // Stop any active live streams to release resources/hardware
        if (this.activeStream) {
            this.activeStream.getTracks().forEach(track => {
                track.stop();
                track.onended = null; // Prevent handling 'ended' event during cleanup
            });
            this.activeStream = null;
        }

        if (this.source) this.source.disconnect();
        if (this.dryGain) this.dryGain.disconnect();
        if (this.wetGain) this.wetGain.disconnect();
        
        if (this.audioContext) await this.audioContext.close();
        
        // Clear Element
        this.audioElement = null;
    }

    setupAudioNodes(isLive = false) {
        // --- STANDARD ANALYZERS ---
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = this.currentFFTSize;
        this.analyzer.smoothingTimeConstant = this.smoothing;
        
        this.loudnessMeter = new LoudnessMeter(this.audioContext);
        this.source.connect(this.loudnessMeter.input);
        
        this.splitter = this.audioContext.createChannelSplitter(2);
        this.analyzerL = this.audioContext.createAnalyser();
        this.analyzerL.fftSize = this.currentFFTSize;
        this.analyzerL.smoothingTimeConstant = this.smoothing;
        
        this.analyzerR = this.audioContext.createAnalyser();
        this.analyzerR.fftSize = this.currentFFTSize;
        this.analyzerR.smoothingTimeConstant = this.smoothing;
        
        // --- MID / SIDE GRAPH ---
        this.analyzerMid = this.audioContext.createAnalyser();
        this.analyzerMid.fftSize = this.currentFFTSize;
        this.analyzerMid.smoothingTimeConstant = this.smoothing;
        
        this.analyzerSide = this.audioContext.createAnalyser();
        this.analyzerSide.fftSize = this.currentFFTSize;
        this.analyzerSide.smoothingTimeConstant = this.smoothing;
        
        // M/S ROUTING MATRIX
        const midGain = this.audioContext.createGain();
        midGain.gain.value = 0.5;
        
        const sideGainL = this.audioContext.createGain();
        sideGainL.gain.value = 0.5;
        const sideGainR = this.audioContext.createGain();
        sideGainR.gain.value = -0.5; // Invert Right Channel
        
        // Connect L
        this.splitter.connect(midGain, 0); 
        this.splitter.connect(sideGainL, 0); 
        
        // Connect R
        this.splitter.connect(midGain, 1);
        this.splitter.connect(sideGainR, 1);
        
        // Summing
        midGain.connect(this.analyzerMid);
        sideGainL.connect(this.analyzerSide);
        sideGainR.connect(this.analyzerSide);
        
        // --- FILTERS ---
        this.highpassFilter = this.audioContext.createBiquadFilter();
        this.highpassFilter.type = 'highpass';
        this.highpassFilter.frequency.value = this.lowCutoff;
        this.highpassFilter.Q.value = 0.7071;
        
        this.lowpassFilter = this.audioContext.createBiquadFilter();
        this.lowpassFilter.type = 'lowpass';
        this.lowpassFilter.frequency.value = this.highCutoff;
        this.lowpassFilter.Q.value = 0.7071;

        this.dryGain = this.audioContext.createGain();
        this.wetGain = this.audioContext.createGain();
        
        // --- WIRING ---
        this.source.connect(this.analyzer);
        this.source.connect(this.splitter);
        this.splitter.connect(this.analyzerL, 0);
        this.splitter.connect(this.analyzerR, 1);
        
        this.source.connect(this.dryGain);
        this.dryGain.connect(this.audioContext.destination);
        
        this.source.connect(this.highpassFilter);
        this.highpassFilter.connect(this.lowpassFilter);
        this.lowpassFilter.connect(this.wetGain);
        this.wetGain.connect(this.audioContext.destination);

        // Feedback Prevention for Live Input
        if (isLive) {
            this.dryGain.gain.value = 0; // Mute Monitor
        }

        this.initMetricBuffers();
        this.updateFilters();
    }
    
    async loadAudio(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        this.currentFileName = file.name;
        await this.cleanupAudioContext();
        this.visualizations.reset();

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.audioElement = new Audio();
        this.audioElement.addEventListener('timeupdate', () => this.updateTime());
        this.audioElement.addEventListener('ended', () => this.handleEnded());
        
        const url = URL.createObjectURL(file);
        this.audioElement.src = url;
        
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        this.setupAudioNodes(false);

        this.tonalStats = { low: 0, mid: 0, high: 0, count: 0 };
        this.animate();

        // UI Updates
        document.getElementById('playPause').disabled = false;
        const seekBar = document.getElementById('seekBar');
        if(seekBar) {
            seekBar.disabled = false;
            // Re-enable if disabled by Live mode
            seekBar.style.opacity = "1";
        }
        
        this.audioElement.addEventListener('loadedmetadata', () => {
            const duration = this.audioElement.duration;
            document.getElementById('duration').textContent = this.formatTime(duration);
            document.getElementById('songName').textContent = this.currentFileName;
            if(seekBar) { seekBar.max = duration; seekBar.value = 0; }
            this.updateSeekProgress();
        });
    }

    async startLiveInput() {
        try {
            // We use getDisplayMedia to capture system audio.
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { width: 1, height: 1, frameRate: 1 }, 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    channelCount: 2
                }
            });
            
            // Check if user actually shared audio
            if (stream.getAudioTracks().length === 0) {
                alert("No audio track detected. Please make sure to check 'Share tab audio' or 'Share system audio'.");
                stream.getTracks().forEach(t => t.stop());
                return;
            }

            this.currentFileName = "Live System Audio";
            await this.cleanupAudioContext();
            this.visualizations.reset();

            this.activeStream = stream; // Track stream for cleanup

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.source = this.audioContext.createMediaStreamSource(stream);
            
            this.setupAudioNodes(true);
            
            this.isPlaying = true; // Set playing state
            this.tonalStats = { low: 0, mid: 0, high: 0, count: 0 };
            this.animate();

            // UI Updates for Live Mode
            const playBtn = document.getElementById('playPause');
            const seekBar = document.getElementById('seekBar');
            
            if(playBtn) {
                playBtn.disabled = true;
                playBtn.classList.add('playing'); // Show pause icon as 'active' state indicator
            }
            if(seekBar) {
                seekBar.disabled = true;
                seekBar.value = 0;
                seekBar.style.opacity = "0.5";
            }
            
            document.getElementById('currentTime').textContent = "LIVE";
            document.getElementById('duration').textContent = "---";
            document.getElementById('songName').textContent = this.currentFileName;

            // Cleanup when user stops sharing via browser UI
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.onended = () => {
                    // Only cleanup if this is still the active session
                    if (this.activeStream === stream) {
                        alert("Live stream ended.");
                        this.cleanupAudioContext();
                        document.getElementById('currentTime').textContent = "0:00";
                        if(playBtn) playBtn.classList.remove('playing');
                    }
                };
            }

        } catch (err) {
            console.error("Error starting live input:", err);
            // alert("Could not start live input. See console.");
        }
    }

    // --- UTILITY METHODS ---
    togglePlayPause() {
        if (!this.audioElement) return;
        
        if (this.isPlaying) {
            this.audioElement.pause();
            this.isPlaying = false;
            document.getElementById('playPause').classList.remove('playing');
        } else {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            this.audioElement.play();
            this.isPlaying = true;
            document.getElementById('playPause').classList.add('playing');
        }
    }

    updateTime() {
        if (!this.audioElement) return;
        document.getElementById('currentTime').textContent = this.formatTime(this.audioElement.currentTime);
        
        if (!this.isSeeking) {
            const seekBar = document.getElementById('seekBar');
            if (seekBar) {
                seekBar.value = this.audioElement.currentTime;
                this.updateSeekProgress();
            }
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateSeekProgress() {
        const seekBar = document.getElementById('seekBar');
        if (!seekBar) return;
        const value = (seekBar.value / seekBar.max) * 100;
        seekBar.style.setProperty('--seek-before-width', `${value}%`);
    }

    handleEnded() {
        this.isPlaying = false;
        document.getElementById('playPause').classList.remove('playing');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.getElementById('app').requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    updateFilters() {
        if (!this.dryGain || !this.wetGain) return;
        const now = this.audioContext.currentTime;
        const rampTime = 0.1;
        if (this.isolationEnabled) {
            this.dryGain.gain.setTargetAtTime(0, now, rampTime);
            this.wetGain.gain.setTargetAtTime(1, now, rampTime);
            this.highpassFilter.frequency.setTargetAtTime(this.lowCutoff, now, rampTime);
            this.lowpassFilter.frequency.setTargetAtTime(this.highCutoff, now, rampTime);
        } else {
            this.dryGain.gain.setTargetAtTime(1, now, rampTime);
            this.wetGain.gain.setTargetAtTime(0, now, rampTime);
        }
    }

    animate() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;
        const instantFps = deltaTime > 0 ? (1000 / deltaTime) : 60;
        this.fps += (instantFps - this.fps) * 0.1;
        this.frameCount++;
        if (this.frameCount >= 10) { this.updateFPSDisplay(); this.frameCount = 0; }

        const loudnessData = this.loudnessMeter ? this.loudnessMeter.values : null;
        const audioTime = this.audioElement ? this.audioElement.currentTime : 0;

        // CHANGED: Use Cached Colors
        const colorSettings = this.colorCache;

        // NEW: Pass M/S Analysers and Goniometer Gain state
        this.visualizations.draw(
            this.analyzer, this.analyzerL, this.analyzerR, this.currentMode,
            this.thresholds, this.spectrumStyle, this.spectrumSlope,
            this.isolationEnabled ? { lowCutoff: this.lowCutoff, highCutoff: this.highCutoff, freqToX: (f)=>this.freqToX(f) } : null,
            this.mousePos, loudnessData, this.isPlaying, audioTime,
            this.spectrogramSettings.min, this.spectrogramSettings.max,
            colorSettings,
            this.analyzerMid, this.analyzerSide, // Pass M/S
            this.goniometerAutoGain, // Pass AGC
            this.goniometerTrailLength // Pass Trail Length
        );
        
        this.updateMetrics();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateFPSDisplay() {
        const fpsDisplay = document.getElementById('fpsDisplay');
        if (fpsDisplay) fpsDisplay.textContent = `${Math.round(this.fps)} FPS`;
    }

    updatePeakBallistics(state, currentDb, deltaTimeMs) {
        const now = performance.now();
        if (currentDb >= state.value) { state.value = currentDb; state.lastPeakTime = now; }
        else {
            const timeSincePeak = now - state.lastPeakTime;
            if (timeSincePeak > this.PEAK_HOLD_TIME) {
                const secondsSinceLastFrame = deltaTimeMs / 1000;
                state.value -= (this.PEAK_DROP_RATE * secondsSinceLastFrame);
            }
        }
        return state.value;
    }

    applyBallistics(current, target, attackFactor, releaseFactor) {
        return target > current ? current + (target - current) * attackFactor : current + (target - current) * releaseFactor;
    }
    
    updateMetrics() {
        if (!this.analyzerL || !this.analyzerR) return;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime; 
        const bufferLength = this.metricBuffers.dataArrayL.length;
        this.analyzerL.getByteFrequencyData(this.metricBuffers.dataArrayL);
        this.analyzerR.getByteFrequencyData(this.metricBuffers.dataArrayR);
        this.analyzerL.getFloatTimeDomainData(this.metricBuffers.dataArrayLTime);
        this.analyzerR.getFloatTimeDomainData(this.metricBuffers.dataArrayRTime);
        
        const peakL = Math.max(...this.metricBuffers.dataArrayLTime.map(Math.abs));
        const peakR = Math.max(...this.metricBuffers.dataArrayRTime.map(Math.abs));
        const peakLDb = 20 * Math.log10(peakL || 0.0000001);
        const peakRDb = 20 * Math.log10(peakR || 0.0000001);
        
        const holdL = this.updatePeakBallistics(this.peakStateL, peakLDb, deltaTime);
        const holdR = this.updatePeakBallistics(this.peakStateR, peakRDb, deltaTime);
        
        const peakPercentL = Math.max(0, Math.min(100, peakLDb + 100));
        const peakPercentR = Math.max(0, Math.min(100, peakRDb + 100));
        document.getElementById('peakL').style.setProperty('--level', `${peakPercentL}%`);
        document.getElementById('peakR').style.setProperty('--level', `${peakPercentR}%`);
        
        const peakHoldPercentL = Math.max(0, Math.min(100, holdL + 100));
        const peakHoldPercentR = Math.max(0, Math.min(100, holdR + 100));
        document.getElementById('peakHoldL').style.right = `${100 - peakHoldPercentL}%`;
        document.getElementById('peakHoldR').style.right = `${100 - peakHoldPercentR}%`;
        document.getElementById('peakLValue').textContent = holdL > -99 ? `${holdL.toFixed(1)} dB` : '-∞ dB';
        document.getElementById('peakRValue').textContent = holdR > -99 ? `${holdR.toFixed(1)} dB` : '-∞ dB';
        
        const lufs = this.loudnessMeter.values;
        const targetMomentary = Math.max(0, Math.min(100, (lufs.momentary + 60) / 60 * 100));
        const targetShortTerm = Math.max(0, Math.min(100, (lufs.shortTerm + 60) / 60 * 100));
        this.meterState.momentary = this.applyBallistics(this.meterState.momentary, targetMomentary, 0.5, 0.1);
        this.meterState.shortTerm = this.applyBallistics(this.meterState.shortTerm, targetShortTerm, 0.2, 0.05);
        document.getElementById('rmsL').style.setProperty('--level', `${this.meterState.momentary}%`);
        document.getElementById('rmsLValue').textContent = lufs.momentary > -99 ? `${lufs.momentary.toFixed(1)} LUFS` : '-∞';
        document.getElementById('rmsR').style.setProperty('--level', `${this.meterState.shortTerm}%`);
        document.getElementById('rmsRValue').textContent = lufs.shortTerm > -99 ? `${lufs.shortTerm.toFixed(1)} LUFS` : '-∞';

        if (lufs.shortTerm > -90 && lufs.truePeak > -90) {
            const instantPsr = lufs.truePeak - lufs.shortTerm;
            this.psrSmoothed += (instantPsr - this.psrSmoothed) * 0.1;
            if (this.psrAverage < 0.1) this.psrAverage = instantPsr;
            else this.psrAverage += (instantPsr - this.psrAverage) * 0.01;
            
            const psrPercent = Math.min(100, Math.max(0, (this.psrSmoothed / 20) * 100));
            const avgPercent = Math.min(100, Math.max(0, (this.psrAverage / 20) * 100));
            let psrColor = '#00ff88'; 
            if (this.psrSmoothed < 6) psrColor = '#ff3333'; 
            else if (this.psrSmoothed < 9) psrColor = '#ffaa00'; 
            else if (this.psrSmoothed > 16) psrColor = '#00aaff'; 

            const psrBar = document.getElementById('psrBar');
            const psrAvgMarker = document.getElementById('psrAvgMarker');
            if (psrBar && psrAvgMarker) {
                psrBar.style.width = `${psrPercent}%`;
                psrBar.style.backgroundColor = psrColor;
                psrAvgMarker.style.left = `${avgPercent}%`;
                const psrVal = document.getElementById('psrValue');
                if(psrVal) { psrVal.textContent = `${this.psrSmoothed.toFixed(1)} LU`; psrVal.style.color = psrColor; }
            }
        } else {
            this.psrSmoothed = 0; this.psrAverage = 0;
            const psrBar = document.getElementById('psrBar');
            if(psrBar) psrBar.style.width = '0%';
        }
      
        let sumL = 0, sumR = 0, sumLR = 0;
        for (let i = 0; i < this.metricBuffers.dataArrayLTime.length; i++) {
            const l = this.metricBuffers.dataArrayLTime[i];
            const r = this.metricBuffers.dataArrayRTime[i];
            sumL += l * l; sumR += r * r; sumLR += l * r;
        }
        const denominator = Math.sqrt(sumL * sumR);
        const correlation = denominator > 0 ? sumLR / denominator : 0;
        const correlationPercent = ((correlation + 1) / 2) * 100;
        document.getElementById('correlation').style.setProperty('--position', `${correlationPercent}%`);
        document.getElementById('correlationValue').textContent = correlation.toFixed(2);
        
        let midEnergy = 0, sideEnergy = 0;
        for (let i = 0; i < this.metricBuffers.dataArrayLTime.length; i++) {
            const mid = (this.metricBuffers.dataArrayLTime[i] + this.metricBuffers.dataArrayRTime[i]) / 2;
            const side = (this.metricBuffers.dataArrayLTime[i] - this.metricBuffers.dataArrayRTime[i]) / 2;
            midEnergy += mid * mid; sideEnergy += side * side;
        }
        midEnergy = Math.sqrt(midEnergy / this.metricBuffers.dataArrayLTime.length);
        sideEnergy = Math.sqrt(sideEnergy / this.metricBuffers.dataArrayLTime.length);
        const width = midEnergy > 0.0001 ? (sideEnergy / midEnergy) * 100 : 0;
        document.getElementById('widthMeter').style.setProperty('--width', `${Math.min(width, 100)}%`);
        document.getElementById('widthValue').textContent = `${Math.min(width, 100).toFixed(0)}%`;
        
        const lowEnd = Math.floor((250 / (this.audioContext.sampleRate / 2)) * bufferLength);
        const midEnd = Math.floor((4000 / (this.audioContext.sampleRate / 2)) * bufferLength);
        let lowSum = 0, midSum = 0, highSum = 0;
        for (let i = 0; i < lowEnd; i++) lowSum += (this.metricBuffers.dataArrayL[i] + this.metricBuffers.dataArrayR[i]) / 2;
        for (let i = lowEnd; i < midEnd; i++) midSum += (this.metricBuffers.dataArrayL[i] + this.metricBuffers.dataArrayR[i]) / 2;
        for (let i = midEnd; i < bufferLength; i++) highSum += (this.metricBuffers.dataArrayL[i] + this.metricBuffers.dataArrayR[i]) / 2;
        
        const lowAvg = lowSum / lowEnd;
        const midAvg = midSum / (midEnd - lowEnd);
        const highAvg = highSum / (bufferLength - midEnd);
        document.getElementById('balanceLow').style.setProperty('--level', `${(lowAvg / 255) * 100}%`);
        document.getElementById('balanceMid').style.setProperty('--level', `${(midAvg / 255) * 100}%`);
        document.getElementById('balanceHigh').style.setProperty('--level', `${(highAvg / 255) * 100}%`);

        if ((lowAvg + midAvg + highAvg) > 1) {
            this.tonalStats.low += lowAvg; this.tonalStats.mid += midAvg; this.tonalStats.high += highAvg;
            this.tonalStats.count++;
        }
        let pLow = 33, pMid = 33, pHigh = 34;
        if (this.tonalStats.count > 0) {
            const totalAccumulated = this.tonalStats.low + this.tonalStats.mid + this.tonalStats.high;
            if (totalAccumulated > 0) {
                pLow = (this.tonalStats.low / totalAccumulated) * 100;
                pMid = (this.tonalStats.mid / totalAccumulated) * 100;
                pHigh = (this.tonalStats.high / totalAccumulated) * 100;
            }
        } else {
            const totalInstant = lowAvg + midAvg + highAvg;
            if (totalInstant > 1) {
                pLow = (lowAvg / totalInstant) * 100;
                pMid = (midAvg / totalInstant) * 100;
                pHigh = (highAvg / totalInstant) * 100;
            }
        }
        const rBarLow = document.getElementById('ratioBarLow');
        const rBarMid = document.getElementById('ratioBarMid');
        const rBarHigh = document.getElementById('ratioBarHigh');
        if (rBarLow) {
            rBarLow.style.width = `${pLow}%`; rBarMid.style.width = `${pMid}%`; rBarHigh.style.width = `${pHigh}%`;
            document.getElementById('ratioTextLow').textContent = `L: ${pLow.toFixed(0)}%`;
            document.getElementById('ratioTextMid').textContent = `M: ${pMid.toFixed(0)}%`;
            document.getElementById('ratioTextHigh').textContent = `H: ${pHigh.toFixed(0)}%`;
            
            document.getElementById('ratioTextLow').style.fontWeight = pLow > 40 ? 'bold' : 'normal';
            document.getElementById('ratioTextMid').style.fontWeight = pMid > 40 ? 'bold' : 'normal';
            document.getElementById('ratioTextHigh').style.fontWeight = pHigh > 40 ? 'bold' : 'normal';
        }
    }
    
    takeScreenshot() {
        const originalCanvas = this.canvas;
        const width = originalCanvas.width;
        const height = originalCanvas.height;
        const dpr = window.devicePixelRatio || 1;
        
        // Create an offscreen canvas to combine the visualizer and the metrics report
        const reportHeight = 120 * dpr; 
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = width;
        combinedCanvas.height = height + reportHeight;
        const sctx = combinedCanvas.getContext('2d');

        // 1. Fill Background
        sctx.fillStyle = '#0a0a0a';
        sctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

        // 2. Draw Visualizer
        sctx.drawImage(originalCanvas, 0, 0);

        // 3. Draw Report Divider
        sctx.strokeStyle = '#222';
        sctx.lineWidth = 1 * dpr;
        sctx.beginPath();
        sctx.moveTo(0, height);
        sctx.lineTo(width, height);
        sctx.stroke();

        // 4. Render Information Labels
        const padding = 25 * dpr;
        const footerY = height + padding;
        const lufs = this.loudnessMeter ? this.loudnessMeter.values : {};
        const stats = this.tonalStats;
        const total = stats.low + stats.mid + stats.high || 1;
        const colWidth = (width - padding * 2) / 4;
        
        const drawColumn = (title, lines, x, color) => {
            sctx.fillStyle = color;
            sctx.font = `bold ${11 * dpr}px "Space Mono"`;
            sctx.fillText(title.toUpperCase(), x, footerY);
            
            sctx.fillStyle = '#888';
            sctx.font = `${10 * dpr}px "Space Mono"`;
            lines.forEach((line, i) => {
                sctx.fillText(line, x, footerY + (20 * dpr * (i + 1)));
            });
        };

        // Metadata Column
        drawColumn('OmniScope Report', [
            `Source: ${this.currentFileName || 'None'}`,
            `Mode: ${this.currentMode}`,
            `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        ], padding, '#00ff88');

        // Loudness Column
        drawColumn('Loudness (LUFS)', [
            `Integrated: ${lufs.integrated > -70 ? lufs.integrated.toFixed(1) : '-∞'}`,
            `Short-term Max: ${lufs.shortTermMax > -70 ? lufs.shortTermMax.toFixed(1) : '-∞'}`,
            `True Peak Max: ${lufs.truePeakMax > -70 ? lufs.truePeakMax.toFixed(1) : '-∞'} dB`
        ], padding + colWidth, '#00aaff');

        // Dynamics Column
        drawColumn('Dynamics', [
            `Avg PSR: ${this.psrAverage.toFixed(1)} LU`,
            `Peak L: ${this.peakStateL.value > -99 ? this.peakStateL.value.toFixed(1) : '-∞'} dB`,
            `Peak R: ${this.peakStateR.value > -99 ? this.peakStateR.value.toFixed(1) : '-∞'} dB`
        ], padding + colWidth * 2, '#ff00aa');

        // Tonal Balance Column
        drawColumn('Tonal Balance (Avg)', [
            `Low: ${((stats.low / total) * 100).toFixed(0)}%`,
            `Mid: ${((stats.mid / total) * 100).toFixed(0)}%`,
            `High: ${((stats.high / total) * 100).toFixed(0)}%`
        ], padding + colWidth * 3, '#00ff88');

        const link = document.createElement('a');
        const fileName = this.currentFileName ? this.currentFileName.split('.')[0].replace(/[^a-z0-9]/gi, '_') : 'session';
        link.download = `omniscope-${fileName}-${Date.now()}.png`;
        link.href = combinedCanvas.toDataURL('image/png');
        link.click();
    }
}

// Initialize
new AudioAnalyzer();
/**
 * Shared utility functions for the Spectral Nexus application
 * This module consolidates common functionality to reduce code duplication
 */

const APP_CONFIG = {
    // Audio Engine Settings
    AUDIO_FFT_SIZE: 1024,
    AUDIO_SMOOTHING: 0.8,
    AUDIO_BEAT_THRESHOLD: 0.8,
    AUDIO_BEAT_DECAY: 0.95,
    AUDIO_BEAT_MIN_INTERVAL: 100, // ms between beats
    
    // Performance Settings
    FPS_UPDATE_INTERVAL: 500, // ms
    QUALITY_ADJUST_INTERVAL: 60, // frames
    MIN_RENDER_SCALE: 0.5,
    MAX_RENDER_SCALE: 1.0,
    
    // UI Settings
    AUTO_HIDE_DELAY: 6000, // ms
    TRANSITION_DURATION: 300, // ms
    TOOLTIP_SHOW_DELAY: 400, // ms
    TOOLTIP_HIDE_DELAY: 100, // ms
    
    // Transition Settings
    DEFAULT_TRANSITION_DURATION: 2500, // ms
    
    // Canvas Settings
    MIN_CANVAS_WIDTH: 320,
    MIN_CANVAS_HEIGHT: 240,
    MAX_CANVAS_WIDTH: 4096,
    MAX_CANVAS_HEIGHT: 4096,
    
    // Playlist Settings
    MAX_PLAYLIST_HISTORY: 100, // items for beat detection history
    PLAYLIST_ITEM_HEIGHT: 60 // pixels (for virtual scrolling)
};

/**
 * Format seconds into a time string (M:SS format)
 * @param {number} seconds - The time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Sanitize user-provided text to prevent XSS attacks
 * @param {string} text - The text to sanitize
 * @returns {string} Sanitized text safe for HTML display
 */
function sanitizeText(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Create a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Create a throttled version of a function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Clamp a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Utils = {
        formatTime,
        sanitizeText,
        debounce,
        throttle,
        clamp,
        lerp,
        generateId,
        APP_CONFIG
    };
}

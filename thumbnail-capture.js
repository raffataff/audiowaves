/* @tweakable thumbnail capture quality from 0.1 to 1.0 */
const THUMBNAIL_QUALITY = 0.8;

/* @tweakable thumbnail dimensions in pixels */
const THUMBNAIL_SIZE = 100;

/* @tweakable delay before capture to allow rendering to complete */
const CAPTURE_DELAY = 16;

/* @tweakable number of frames to wait for stable rendering */
const FRAME_STABILIZATION = 3;

class ThumbnailCapture {
    constructor(presetManager, shaderEngine) {
        this.presetManager = presetManager;
        this.shaderEngine = shaderEngine;
        this.notifications = new PresetNotifications();
    }

    captureThumbnail() {
        // Show immediate visual feedback
        this.showThumbnailCaptureProgress();

        // Wait for multiple frames to ensure stable rendering
        let frameCount = 0;
        const waitForStableFrame = () => {
            frameCount++;
            if (frameCount < FRAME_STABILIZATION) {
                requestAnimationFrame(waitForStableFrame);
                return;
            }

            const canvas = document.getElementById('visualizer-canvas');

            /* @tweakable whether to preserve canvas drawing buffer for capture */
            const preserveDrawingBuffer = true;

            // Get WebGL context to read pixels directly
            const gl = canvas.getContext('webgl2', { preserveDrawingBuffer });
            if (!gl) {
                console.error('Could not get WebGL context for thumbnail capture');
                return;
            }

            // Create a temporary canvas for the thumbnail
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            tempCanvas.width = THUMBNAIL_SIZE;
            tempCanvas.height = THUMBNAIL_SIZE;

            // Read pixels from WebGL canvas
            const pixels = new Uint8Array(canvas.width * canvas.height * 4);
            gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            // Create ImageData from the pixels
            const imageData = new ImageData(new Uint8ClampedArray(pixels), canvas.width, canvas.height);

            // Create another canvas to flip the image (WebGL is upside down)
            const flipCanvas = document.createElement('canvas');
            const flipCtx = flipCanvas.getContext('2d');
            flipCanvas.width = canvas.width;
            flipCanvas.height = canvas.height;

            flipCtx.putImageData(imageData, 0, 0);

            // Flip vertically
            tempCtx.save();
            tempCtx.scale(1, -1);
            tempCtx.translate(0, -THUMBNAIL_SIZE);

            // Draw the flipped image to the thumbnail canvas (resized)
            tempCtx.drawImage(flipCanvas, 0, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
            tempCtx.restore();

            // Convert to data URL
            const thumbnailDataURL = tempCanvas.toDataURL('image/jpeg', THUMBNAIL_QUALITY);

            // Update the current preset's thumbnail
            if (this.presetManager.currentPreset >= 0 && this.presetManager.currentPreset < this.presetManager.shaderPresets.length) {
                this.presetManager.shaderPresets[this.presetManager.currentPreset].thumbnail = thumbnailDataURL;
                this.presetManager.render();

                /* @tweakable immediate save after thumbnail capture to ensure persistence */
                this.presetManager.saveState();

                /* @tweakable success notification duration in milliseconds */
                const notificationDuration = 2000;
                this.notifications.showThumbnailCaptureNotification(notificationDuration);
            }
        };

        requestAnimationFrame(waitForStableFrame);
    }

    /* @tweakable thumbnail capture progress indicator styling */
    showThumbnailCaptureProgress() {
        const notification = document.createElement('div');
        notification.id = 'capture-progress';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 165, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 300ms ease;
        `;
        notification.textContent = '📸 Capturing...';

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
    }
}
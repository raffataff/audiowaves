const NOTIFICATION_ANIMATION_DURATION = 300;

class PresetNotifications {
    showThumbnailCaptureNotification(duration) {
        // Remove progress indicator
        const progressNotification = document.getElementById('capture-progress');
        if (progressNotification) {
            progressNotification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (progressNotification.parentNode) {
                    document.body.removeChild(progressNotification);
                }
            }, NOTIFICATION_ANIMATION_DURATION);
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform ${NOTIFICATION_ANIMATION_DURATION}ms ease;
        `;
        notification.textContent = '✅ Thumbnail saved!';

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, NOTIFICATION_ANIMATION_DURATION);
        }, duration);
    }

    showPresetDeleteNotification(presetName, duration) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 100, 100, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform ${NOTIFICATION_ANIMATION_DURATION}ms ease;
        `;
        notification.textContent = `🗑️ Deleted "${presetName}"`;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, NOTIFICATION_ANIMATION_DURATION);
        }, duration);
    }

    showExportNotification(presetName, duration = 2000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(100, 150, 255, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform ${NOTIFICATION_ANIMATION_DURATION}ms ease;
        `;
        notification.textContent = `📤 Exported "${presetName}"`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, NOTIFICATION_ANIMATION_DURATION);
        }, duration);
    }

    showBulkExportNotification(count, duration = 2000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(100, 150, 255, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform ${NOTIFICATION_ANIMATION_DURATION}ms ease;
        `;
        notification.textContent = `📦 Exported ${count} shader${count !== 1 ? 's' : ''}`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, NOTIFICATION_ANIMATION_DURATION);
        }, duration);
    }

    showImportNotification(count, duration = 2000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(100, 200, 100, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            z-index: 1000;
            transform: translateX(100%)';
            transition: transform ${NOTIFICATION_ANIMATION_DURATION}ms ease;
        `;
        notification.textContent = `📥 Imported ${count} shader${count !== 1 ? 's' : ''}`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, NOTIFICATION_ANIMATION_DURATION);
        }, duration);
    }
}

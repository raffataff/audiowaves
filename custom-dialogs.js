
class DialogManager {
    constructor() {
        this.lastMouseX = window.innerWidth / 2;
        this.lastMouseY = window.innerHeight / 2;
        this.activeDialogs = [];
        
        document.addEventListener('mousemove', (e) => {
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeDialogs.length > 0) {
                const topDialog = this.activeDialogs[this.activeDialogs.length - 1];
                if (topDialog.type === 'alert') {
                    this.closeDialog(topDialog);
                } else if (topDialog.type === 'confirm') {
                    topDialog.reject(false);
                    this.closeDialog(topDialog);
                }
            }
        });
    }

    alert(message, title = 'Notice') {
        return new Promise((resolve) => {
            const dialog = this.createDialog('alert', message, title, resolve, null);
            this.activeDialogs.push(dialog);
        });
    }

    confirm(message, title = 'Confirm') {
        return new Promise((resolve, reject) => {
            const dialog = this.createDialog('confirm', message, title, resolve, reject);
            this.activeDialogs.push(dialog);
        });
    }

    createDialog(type, message, title, resolve, reject) {
        const backdrop = document.createElement('div');
        backdrop.className = 'custom-dialog-backdrop';
        
        const dialog = document.createElement('div');
        dialog.className = `custom-dialog ${type}-dialog`;
        
        let x = this.lastMouseX;
        let y = this.lastMouseY;
        
        requestAnimationFrame(() => {
            const dialogRect = dialog.getBoundingClientRect();
            const dialogWidth = dialogRect.width || 320;
            const dialogHeight = dialogRect.height || 150;
            
            x = Math.min(Math.max(x + 20, 10), window.innerWidth - dialogWidth - 10);
            y = Math.min(Math.max(y + 20, 10), window.innerHeight - dialogHeight - 10);
            
            dialog.style.left = `${x}px`;
            dialog.style.top = `${y}px`;
        });
        
        let buttonsHTML = '';
        if (type === 'alert') {
            buttonsHTML = `<button class="dialog-btn dialog-btn-primary" data-action="ok">OK</button>`;
        } else {
            buttonsHTML = `
                <button class="dialog-btn dialog-btn-cancel" data-action="cancel">Cancel</button>
                <button class="dialog-btn dialog-btn-confirm" data-action="confirm">Confirm</button>
            `;
        }
        
        dialog.innerHTML = `
            <div class="custom-dialog-header">
                <span class="custom-dialog-title">${title}</span>
                <button class="custom-dialog-close">&times;</button>
            </div>
            <div class="custom-dialog-body">
                <p>${message}</p>
            </div>
            <div class="custom-dialog-footer">
                ${buttonsHTML}
            </div>
        `;
        
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);
        
        requestAnimationFrame(() => {
            backdrop.classList.add('visible');
            dialog.classList.add('visible');
        });
        
        const dialogObj = { type, backdrop, dialog, resolve, reject };
        
        const closeDialog = () => this.closeDialog(dialogObj);
        
        dialog.querySelector('.custom-dialog-close').addEventListener('click', () => {
            if (type === 'confirm' && reject) {
                reject(false);
            }
            closeDialog();
        });
        
        if (type === 'alert') {
            dialog.querySelector('[data-action="ok"]').addEventListener('click', () => {
                resolve();
                closeDialog();
            });
        } else {
            dialog.querySelector('[data-action="confirm"]').addEventListener('click', () => {
                resolve(true);
                closeDialog();
            });
            dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                if (reject) reject(false);
                closeDialog();
            });
        }
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                if (type === 'alert') {
                    resolve();
                } else {
                    if (reject) reject(false);
                }
                closeDialog();
            }
        });
        
        return dialogObj;
    }

    closeDialog(dialogObj) {
        const { backdrop, dialog } = dialogObj;
        backdrop.classList.remove('visible');
        dialog.classList.remove('visible');
        
        setTimeout(() => {
            if (backdrop.parentNode) {
                document.body.removeChild(backdrop);
            }
            const index = this.activeDialogs.indexOf(dialogObj);
            if (index > -1) {
                this.activeDialogs.splice(index, 1);
            }
        }, 200);
    }
}

window.Dialogs = new DialogManager();

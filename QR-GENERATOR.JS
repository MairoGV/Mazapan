class QRCodeGenerator {
    constructor() {
        this.canvas = document.getElementById('qr-canvas');
        this.textInput = document.getElementById('text-input');
        this.sizeInput = document.getElementById('size-input');
        this.sizeValue = document.getElementById('size-value');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.status = document.getElementById('qr-status');
        
        this.setupEventListeners();
        this.generateQR();
    }
    
    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateQR());
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
        
        this.sizeInput.addEventListener('input', (e) => {
            this.sizeValue.textContent = e.target.value + 'px';
            if (this.textInput.value.trim()) {
                this.generateQR();
            }
        });
        
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateQR();
        });
        
        let timeout;
        this.textInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.textInput.value.trim()) {
                    this.generateQR();
                }
            }, 500);
        });
    }
    
    async generateQR() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showStatus('Por favor ingresa algún texto o URL', 'error');
            return;
        }
        
        const size = parseInt(this.sizeInput.value);
        
        try {
            this.showStatus('Generando código QR...', 'loading');
            
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            await QRCode.toCanvas(this.canvas, text, {
                width: size,
                margin: 4,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M'
            });
            
            this.downloadBtn.style.display = 'inline-block';
            this.showStatus('Código QR generado exitosamente', 'success');
            
            this.canvas.style.transform = 'scale(0.8)';
            this.canvas.style.opacity = '0.5';
            
            setTimeout(() => {
                this.canvas.style.transform = 'scale(1)';
                this.canvas.style.opacity = '1';
                this.canvas.style.transition = 'all 0.3s ease';
            }, 100);
            
        } catch (error) {
            console.error('Error al generar QR:', error);
            this.showStatus('Error al generar el código QR', 'error');
        }
    }
    
    downloadQR() {
        try {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            const size = parseInt(this.sizeInput.value);
            
            tempCanvas.width = size + 40;
            tempCanvas.height = size + 40;
            
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(this.canvas, 20, 20, size, size);
            
            const link = document.createElement('a');
            link.download = `qr-${Date.now()}.png`;
            link.href = tempCanvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showStatus('Imagen descargada exitosamente', 'success');
            
        } catch (error) {
            console.error('Error al descargar:', error);
            this.showStatus('Error al descargar la imagen', 'error');
        }
    }
    
    showStatus(message, type) {
        this.status.textContent = message;
        this.status.className = type;
        
        setTimeout(() => {
            this.status.textContent = '';
            this.status.className = '';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof QRCode !== 'undefined') {
        new QRCodeGenerator();
    } else {
        setTimeout(() => {
            if (typeof QRCode !== 'undefined') {
                new QRCodeGenerator();
            } else {
                console.error('QRCode library no cargada');
                alert('Error: No se pudo cargar la biblioteca de QR');
            }
        }, 1000);
    }
});

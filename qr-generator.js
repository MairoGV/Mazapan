class QRCodeGenerator {
    constructor() {
        this.canvas = document.getElementById('qr-canvas');
        this.textInput = document.getElementById('text-input');
        this.sizeInput = document.getElementById('size-input');
        this.sizeValue = document.getElementById('size-value');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        
        this.setupEventListeners();
        // Generar QR inicial al cargar
        this.generateQR();
    }
    
    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateQR());
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
        
        this.sizeInput.addEventListener('input', (e) => {
            this.sizeValue.textContent = e.target.value + 'px';
            // Regenerar QR cuando cambia el tamaño
            if (this.textInput.value.trim()) {
                this.generateQR();
            }
        });
        
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateQR();
        });
        
        // Generar QR automáticamente cuando se escribe
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
            alert('Por favor ingresa algún texto o URL');
            return;
        }
        
        const size = parseInt(this.sizeInput.value);
        
        try {
            // Limpiar canvas anterior
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Generar QR usando qrcode.js
            await QRCode.toCanvas(this.canvas, text, {
                width: size,
                margin: 4,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M'
            });
            
            // Mostrar botón de descarga
            this.downloadBtn.style.display = 'inline-block';
            
            // Añadir efecto visual
            this.canvas.style.transform = 'scale(0.8)';
            this.canvas.style.opacity = '0.5';
            
            setTimeout(() => {
                this.canvas.style.transform = 'scale(1)';
                this.canvas.style.opacity = '1';
                this.canvas.style.transition = 'all 0.3s ease';
            }, 100);
            
        } catch (error) {
            console.error('Error al generar QR:', error);
            alert('Error al generar el código QR. Por favor verifica el texto ingresado.');
        }
    }
    
    downloadQR() {
        try {
            // Crear un canvas temporal con fondo blanco
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            const size = parseInt(this.sizeInput.value);
            
            tempCanvas.width = size + 40;
            tempCanvas.height = size + 40;
            
            // Fondo blanco con bordes redondeados
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Copiar el QR al centro
            tempCtx.drawImage(this.canvas, 20, 20, size, size);
            
            // Descargar
            const link = document.createElement('a');
            link.download = `qr-${Date.now()}.png`;
            link.href = tempCanvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Error al descargar:', error);
            alert('Error al descargar la imagen');
        }
    }
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que QRCode esté disponible
    if (typeof QRCode !== 'undefined') {
        new QRCodeGenerator();
    } else {
        // Si no está cargado, esperar un momento
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
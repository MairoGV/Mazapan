// Versión mejorada usando qrcode.js
class QRCodeGenerator {
    constructor() {
        this.canvas = document.getElementById('qr-canvas');
        this.textInput = document.getElementById('text-input');
        this.sizeInput = document.getElementById('size-input');
        this.sizeValue = document.getElementById('size-value');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        
        this.init();
    }
    
    init() {
        // Cargar qrcode.js dinámicamente
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
        script.onload = () => this.setupEventListeners();
        document.head.appendChild(script);
    }
    
    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateQR());
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
        this.sizeInput.addEventListener('input', (e) => {
            this.sizeValue.textContent = e.target.value + 'px';
        });
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateQR();
        });
        
        // Generar QR inicial
        this.generateQR();
    }
    
    generateQR() {
        const text = this.textInput.value.trim();
        if (!text) {
            alert('Por favor ingresa algún texto o URL');
            return;
        }
        
        const size = parseInt(this.sizeInput.value);
        this.canvas.width = size;
        this.canvas.height = size;
        
        QRCode.toCanvas(this.canvas, text, {
            width: size,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, (error) => {
            if (error) {
                console.error('Error al generar QR:', error);
                alert('Error al generar el código QR');
            } else {
                this.downloadBtn.style.display = 'inline-block';
            }
        });
    }
    
    downloadQR() {
        const link = document.createElement('a');
        link.download = 'codigo-qr.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});
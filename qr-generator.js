// Implementación completa del generador de código QR
class QRCodeGenerator {
    constructor() {
        this.canvas = document.getElementById('qr-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.textInput = document.getElementById('text-input');
        this.sizeInput = document.getElementById('size-input');
        this.sizeValue = document.getElementById('size-value');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        
        this.init();
    }
    
    init() {
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
        
        // Generar el código QR
        this.drawQR(text, size);
        this.downloadBtn.style.display = 'inline-block';
    }
    
    drawQR(text, size) {
        // Limpiar canvas
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, size, size);
        
        // Crear la matriz QR (simplificado para este ejemplo)
        const qrData = this.createQRMatrix(text);
        const moduleSize = size / qrData.length;
        
        // Dibujar los módulos
        for (let row = 0; row < qrData.length; row++) {
            for (let col = 0; col < qrData[row].length; col++) {
                if (qrData[row][col]) {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(
                        col * moduleSize,
                        row * moduleSize,
                        moduleSize,
                        moduleSize
                    );
                }
            }
        }
    }
    
    createQRMatrix(text) {
        // Esta es una implementación simplificada
        // Para uso real, considera usar una biblioteca como qrcode.js
        const size = 21; // Tamaño fijo para este ejemplo
        const matrix = Array(size).fill().map(() => Array(size).fill(false));
        
        // Patrones de finder (esquinas)
        this.addFinderPatterns(matrix);
        
        // Información del texto (simplificado)
        this.addData(matrix, text);
        
        // Máscara y formato (simplificado)
        this.addFormatInfo(matrix);
        
        return matrix;
    }
    
    addFinderPatterns(matrix) {
        const pattern = [
            [1,1,1,1,1,1,1],
            [1,0,0,0,0,0,1],
            [1,0,1,1,1,0,1],
            [1,0,1,1,1,0,1],
            [1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1]
        ];
        
        // Esquina superior izquierda
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                matrix[i][j] = pattern[i][j] === 1;
            }
        }
        
        // Esquina superior derecha
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                matrix[i][matrix.length - 7 + j] = pattern[i][j] === 1;
            }
        }
        
        // Esquina inferior izquierda
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                matrix[matrix.length - 7 + i][j] = pattern[i][j] === 1;
            }
        }
    }
    
    addData(matrix, text) {
        // Codificación simplificada del texto
        const data = this.encodeText(text);
        let dataIndex = 0;
        
        // Recorrer la matriz en zigzag
        for (let col = matrix.length - 1; col > 0; col -= 2) {
            if (col === 6) col--; // Saltar columna de timing
            
            for (let row = 0; row < matrix.length; row++) {
                for (let c = 0; c < 2; c++) {
                    const currentCol = col - c;
                    const currentRow = (col + 1) % 4 < 2 ? matrix.length - 1 - row : row;
                    
                    if (matrix[currentRow] && !matrix[currentRow][currentCol] && 
                        currentRow < matrix.length && currentCol < matrix.length) {
                        if (dataIndex < data.length * 8) {
                            matrix[currentRow][currentCol] = (data[Math.floor(dataIndex / 8)] >> (7 - (dataIndex % 8))) & 1;
                            dataIndex++;
                        }
                    }
                }
            }
        }
    }
    
    encodeText(text) {
        // Codificación Byte simplificada
        const bytes = [];
        for (let i = 0; i < text.length; i++) {
            bytes.push(text.charCodeAt(i));
        }
        return bytes;
    }
    
    addFormatInfo(matrix) {
        // Información de formato simplificada
        // Líneas de timing
        for (let i = 8; i < matrix.length - 8; i++) {
            matrix[6][i] = i % 2 === 0;
            matrix[i][6] = i % 2 === 0;
        }
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
// app.js
document.getElementById('btn').addEventListener('click', generarQR);
document.getElementById('text').addEventListener('keyup', e => {
  if (e.key === 'Enter') generarQR();
});

function generarQR() {
  const texto = document.getElementById('text').value.trim();
  if (!texto) return alert('Escribe algo primero');

  const qr = new QRCode(-1, QRErrorCorrectLevel.H);
  qr.addData(texto);
  qr.make();

  const canvas = document.getElementById('qr');
  const ctx    = canvas.getContext('2d');
  const mod    = qr.getModuleCount();
  const px     = 6;                 // tamaño de cada módulo

  canvas.width  = mod * px;
  canvas.height = mod * px;

  for (let y = 0; y < mod; y++) {
    for (let x = 0; x < mod; x++) {
      ctx.fillStyle = qr.isDark(y, x) ? '#000' : '#fff';
      ctx.fillRect(x * px, y * px, px, px);
    }
  }
}

// genera uno al cargar
window.addEventListener('DOMContentLoaded', generarQR);

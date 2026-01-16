// Función para generar el QR
function generarQR(texto) {
  const contenedor = document.getElementById('qrcode');
  contenedor.innerHTML = ''; // Limpia el QR anterior

  new QRCode(contenedor, {
    text: texto,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

// Evento del botón
document.getElementById('btn').addEventListener('click', () => {
  const valor = document.getElementById('url').value.trim();
  if (!valor) {
    alert('Ingresa una URL o texto para generar el QR.');
    return;
  }
  generarQR(valor);
});

// Genera un QR inicial (opcional)
generarQR(document.getElementById('url').value);

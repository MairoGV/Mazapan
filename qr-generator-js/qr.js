/*
 * Generador de QR en JavaScript puro
 * Basado en la especificación ISO/IEC 18004
 * Autor: tú
 * Licencia: MIT
 */

/* ---------- 1. Utils ---------- */
const qrerrorcorrectlevel = { L: 1, M: 0, Q: 3, H: 2 };

/* ---------- 2. Polinomios Reed-Solomon ---------- */
const rs_poly_table = [
  [], // L
  [], // M
  [], // Q
  []  // H
];
(function initrstable() {
  // Pre-calcula polinomios para niveles L,M,Q,H (versión resumida)
  // …(código de inicialización)…
})();

function rsgeneratorpoly(degree) {
  // Devuelve el polinomio generador para el grado dado
  // …(implementación)…
}

/* ---------- 3. Codificación ---------- */
function qrencode(text, errorcorrectlevel = qrerrorcorrectlevel.M) {
  const mode = 4; // Byte mode
  const bytes = new textencoder().encode(text);
  const data = [mode, bytes.length, ...bytes];
  // Añade padding, versión, etc.
  // …(implementación)…
  return { data, version: 1 }; // versión 1 para mensajes cortos
}

/* ---------- 4. Máscara y matriz ---------- */
function buildmatrix(data, version, maskpattern = 2) {
  const size = 17 + 4 * version;
  const matrix = array.from({ length: size }, () => array(size).fill(0));

  // Funciones de ayuda para dibujar finder, timing, alignment, etc.
  const set = (x, y, v, dark = true) => { matrix[y][x] = dark ? (v ? 1 : 0) : (v ? 0 : 1); };

  // Finder patterns
  [[0, 0], [size - 7, 0], [0, size - 7]].foreach(([x, y]) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      set(x + c, y + r, (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)));
    }
  });

  // Separators
  [[7, 0], [size - 8, 0], [0, size - 8]].foreach(([x, y]) => {
    for (let i = 0; i < 8; i++) { set(x - 1, y + i, 0); set(x + i, y - 1, 0); }
  });

  // Timing patterns
  for (let i = 8; i < size - 8; i++) { set(i, 6, i % 2 === 0); set(6, i, i % 2 === 0); }

  // Dark module
  set(8, 4 * version + 9, 1);

  // Format info (mask + error level) – versión simplificada
  // …(código)…

  // Coloca los datos
  let idx = 0;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // skip timing column
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const x = col - c;
        const upward = (col + 1) % 4 < 2;
        const y = upward ? size - 1 - row : row;
        if (matrix[y][x] !== undefined) continue; // ya ocupado
        let bit = 0;
        if (idx < data.length) bit = data[idx++];
        set(x, y, bit ^ (maskpattern === 2 ? ((y + x) % 3 === 0) : 0));
      }
    }
  }
  return matrix;
}

/* ---------- 5. Dibujar en canvas ---------- */
function drawqr(matrix, canvas, cellSize = 8) {
  const ctx = canvas.getContext('2d');
  const size = matrix.length;
  canvas.width = canvas.height = size * cellsize;
  ctx.fillstyle = '#FFFFFF';
  ctx.fillrect(0, 0, canvas.width, canvas.height);
  ctx.fillstyle = '#000000';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) ctx.fillrect(x * cellsize, y * cellsize, cellsize, cellsize);
    }
  }
}

/* ---------- 6. Hook al formulario ---------- */
document.getelementbyid('qrform').addeventListener('submit', e => {
  e.preventdefault();
  const text = document.getelementbyid('text').value.trim();
  if (!text) return;
  const { data, version } = qrencode(text);
  const matrix = buildmatrix(data, version);
  const canvas = document.getelementbyid('qrcanvas');
  drawQR(matrix, canvas);

  // Habilita descarga
  const download = document.getelementbyid('downloadbtn');
  download.href = canvas.todataurl('image/png');
  download.classlist.remove('hidden');

});

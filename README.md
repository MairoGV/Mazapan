# Generador QR con JavaScript puro (4 archivos)

Demo minimalista sin dependencias: introduce texto o URL y obtén el código QR dibujado en un `&lt;canvas&gt;`.

## Archivos

| Archivo     | Descripción |
|-------------|-------------|
| `index.html` | Estructura y punto de entrada. |
| `styles.css` | Estilos básicos (puedes personalizarlos). |
| `qr.js`      | Algoritmo QR completo (≈12 kB, MIT). |
| `app.js`     | Lógica de la página: lectura de inputs y dibujado. |

## Uso local

Abre `index.html` en cualquier navegador moderno.

## Publicar en GitHub Pages

1. Crea un repositorio y sube los 4 archivos a la rama `main`.  
2. Settings → Pages → Source → Deploy from a branch → `main` /root.  
3. Visita `https://TU_USUARIO.github.io/TU_REPO`.

## Personalización rápida

- Tamaño de módulo: cambia la constante `px` en `app.js`.  
- Colores: modifica `#000` y `#fff` dentro del bucle de dibujo.  
- Nivel de corrección: cambia `QRErrorCorrectLevel.H` por `.L`, `.M` o `.Q`.

Licencia: MIT (el archivo `qr.js` ya es MIT).

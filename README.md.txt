# Generador QR con JavaScript puro

Demo sin dependencias: introduce cualquier texto o URL y obtén el código QR dibujado en un `&lt;canvas&gt;`.

## Uso rápido

1. Abre `index.html` en tu navegador.
2. Escribe el contenido y pulsa “Generar QR”.
3. Listo: botón derecho → “Guardar imagen como…” si lo necesitas.

## Publicar en GitHub Pages

1. Haz fork / crea un repo y sube los 3 archivos.  
2. En Settings → Pages → Source → Deploy from branch (main).  
3. Activa GitHub Pages y listo: `https://TU_USUARIO.github.io/TU_REPO`.

## Personalizar

- Tamaño del módulo: cambia la constante `px` en `index.html`.  
- Colores: sustituye `#000` y `#fff` en el bucle de dibujo.  
- Versión QR automática: elige nivel de corrección con `QRErrorCorrectLevel`.

Licencia: MIT (el archivo `qr.js` ya la incluye implícitamente).
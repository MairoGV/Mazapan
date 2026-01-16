// generador qr vanilla (minúsculas)
const nivel = {l:1,m:0,q:3,h:2};

function codificar(texto){
  const modo=4; // byte
  const bytes=new textencoder().encode(texto);
  const datos=[modo,bytes.length,...bytes];
  // padding simple para mensajes cortos
  while(datos.length<26) datos.push(0);
  return {datos,version:1};
}

function matriz(datos,version){
  const lado=21;
  const m=Array.from({length:lado},()=>Array(lado).fill(0));
  const pon=(x,y,v)=>m[y][x]=v?1:0;

  // patrones de posición
  const cuad=(ox,oy)=>{
    for(let r=0;r<7;r++)for(let c=0;c<7;c++){
      pon(ox+c,oy+r,(r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4)));
    }
  };
  cuad(0,0); cuad(lado-7,0); cuad(0,lado-7);

  // separadores
  for(let i=0;i<8;i++){
    pon(7,i,0); pon(i,7,0);
    pon(lado-8,i,0); pon(lado-8+i,7,0);
    pon(7,lado-8+i,0); pon(i,lado-8,0);
  }

  // timing
  for(let i=8;i<lado-8;i++){pon(i,6,i%2===0); pon(6,i,i%2===0);}

  // dark module
  pon(8,13,1);

  // datos (serpiente)
  let idx=0;
  for(let col=lado-1;col>0;col-=2){
    if(col===6)col--;
    for(let fila=0;fila<lado;fila++){
      for(let c=0;c<2;c++){
        const x=col-c;
        const sube=(col+1)%4<2;
        const y=sube?lado-1-fila:fila;
        if(m[y][x]!==0)continue;
        let bit=0;
        if(idx<datos.length)bit=datos[idx++];
        pon(x,y,bit^((y+x)%3===0));
      }
    }
  }
  return m;
}

function dibujar(matriz,lienzo,tam=8){
  const ctx=lienzo.getcontext('2d');
  const lado=matriz.length;
  lienzo.width=lienzo.height=lado*tam;
  ctx.fillstyle='#ffffff';
  ctx.fillrect(0,0,lienzo.width,lienzo.height);
  ctx.fillstyle='#000000';
  for(let y=0;y<lado;y++){
    for(let x=0;x<lado;x++){
      if(matriz[y][x])ctx.fillrect(x*tam,y*tam,tam,tam);
    }
  }
}

document.getElementById('form').addEventListener('submit',e=>{
  e.preventDefault();
  const texto=document.getElementById('texto').value.trim();
  if(!texto)return;
  const {datos,version}=codificar(texto);
  const m=matriz(datos,version);
  const lienzo=document.getElementById('lienzo');
  dibujar(m,lienzo);
  const link=document.getElementById('descarga');
  link.href=lienzo.todataurl('image/png');
  link.classList.remove('oculto');
});
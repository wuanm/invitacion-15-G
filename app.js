

/* ── CANVAS OCEAN ── */
(()=>{
  const c=document.getElementById('bg-canvas');
  const ctx=c.getContext('2d');
  let W,H,t=0;
  const particles=[];

  function resize(){ W=c.width=window.innerWidth; H=c.height=window.innerHeight; }
  resize(); window.addEventListener('resize',resize);

  // shimmer particles
  for(let i=0;i<100;i++) particles.push({
    x:Math.random()*2000, y:Math.random()*3000,
    r:Math.random()*1.8+.3,
    vx:(Math.random()-.5)*.25,
    vy:-Math.random()*.35-.08,
    a:Math.random(), da:(Math.random()-.5)*.008
  });

  function castleSilhouette(cx,cy){
    ctx.save();
    const pulse = .08 + Math.sin(t*.015)*.03;
    ctx.globalAlpha = pulse;

    // Glow
    const g=ctx.createRadialGradient(cx,cy-80,0,cx,cy-80,200);
    g.addColorStop(0,'rgba(201,168,76,.4)');
    g.addColorStop(.4,'rgba(0,153,168,.15)');
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(cx,cy-80,200,0,Math.PI*2); ctx.fill();

    // Body
    ctx.fillStyle='rgba(9,36,74,.7)';
    ctx.fillRect(cx-70,cy-110,140,110);

    // Towers
    [ [cx-80,cy-160,22,70], [cx+58,cy-160,22,70], [cx-28,cy-200,34,100] ].forEach(([x,y,w,h])=>{
      ctx.fillRect(x,y,w,h);
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+w/2,y-30); ctx.lineTo(x+w,y); ctx.fill();
    });

    // Windows (glow)
    ctx.fillStyle=`rgba(201,168,76,${.3+Math.sin(t*.03)*.1})`;
    [[cx-50,cy-80],[cx+30,cy-80],[cx-62,cy-130],[cx+42,cy-130],[cx-12,cy-165]].forEach(([x,y])=>{
      ctx.fillRect(x,y,11,14);
    });

    // Arches base
    ctx.fillStyle='rgba(7,24,48,.8)';
    ctx.fillRect(cx-70,cy-40,30,40); ctx.fillRect(cx+40,cy-40,30,40);
    ctx.beginPath(); ctx.arc(cx-55,cy-40,15,Math.PI,0); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+55,cy-40,15,Math.PI,0); ctx.fill();

    ctx.restore();
  }

  function draw(){
    ctx.clearRect(0,0,W,H); t++;

    // Bg gradient
    const bg=ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'rgba(5,14,31,0)');
    bg.addColorStop(.6,'rgba(3,9,20,.12)');
    bg.addColorStop(1,'rgba(0,0,0,.25)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // Light rays from top
    for(let r=0;r<5;r++){
      const rx=W*.2+r*(W*.15);
      ctx.save();
      ctx.globalAlpha=.025+Math.sin(t*.01+r)*.01;
      const rg=ctx.createLinearGradient(rx,0,rx+40,H);
      rg.addColorStop(0,'rgba(0,153,168,.8)');
      rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg;
      ctx.beginPath();
      ctx.moveTo(rx-20,0); ctx.lineTo(rx+60,0);
      ctx.lineTo(rx+80,H); ctx.lineTo(rx-40,H);
      ctx.fill(); ctx.restore();
    }

    castleSilhouette(W/2, H*.82);

    // Shimmer particles
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.a+=p.da;
      if(p.y<-10){ p.y=H+10; p.x=Math.random()*W; }
      if(p.a<0||p.a>1) p.da*=-1;
      ctx.save();
      ctx.globalAlpha=Math.max(0,Math.min(.5,p.a))*.4;
      const hue=180+Math.sin(t*.01+p.x)* 30;
      ctx.fillStyle=`hsl(${hue},70%,70%)`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── BUBBLES ── */
// (()=>{
//   const layer=document.getElementById('bubble-layer');
//   for(let i=0;i<22;i++){
//     const b=document.createElement('div');
//     b.className='bub';
//     const s=6+Math.random()*16;
//     b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${7+Math.random()*12}s;animation-delay:${Math.random()*9}s;`;
//     layer.appendChild(b);
//   }
// })();

/* ── BURBUJAS MEJORADAS ── */
(() => {
  const layer = document.getElementById('bubble-layer');
  if (!layer) return;

  // 🔥 Ajusta estos valores a tu gusto
  const TOTAL = 45;              // ← Más burbujas (antes 22)
  const TAMANO_MIN = 12;         // ← Más grandes (antes 6)
  const TAMANO_MAX = 32;         // ← Más grandes (antes 22)
  const DENSIDAD = 0.7;          // ← 0.5 = más dispersas, 1 = concentradas (más juntas)
  const DURACION_MIN = 8;        // ← Velocidad (segundos)
  const DURACION_MAX = 16;       // ← Velocidad (segundos)

  for (let i = 0; i < TOTAL; i++) {
    const b = document.createElement('div');
    b.className = 'bub';

    // Tamaño aleatorio entre TAMANO_MIN y TAMANO_MAX
    const size = TAMANO_MIN + Math.random() * (TAMANO_MAX - TAMANO_MIN);

    // Posición horizontal: concentración en el centro si DENSIDAD < 1
    // DENSIDAD = 1 → distribución uniforme, 0.5 → más concentradas en el centro
    const r = Math.random();
    const left = (r * DENSIDAD + (1 - DENSIDAD) * 0.5) * 100;

    const duration = DURACION_MIN + Math.random() * (DURACION_MAX - DURACION_MIN);
    const delay = Math.random() * 12;

    b.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${0.4 + Math.random() * 0.5};
    `;
    layer.appendChild(b);
  }
})();

/* ── SEA PARTICLES (fish/shells) ── */
(()=>{
   const symbols=['🐠','🐟','🐡','🐠','🐬','🐋','🐠'];
  for(let i=0;i<7;i++){
    const el=document.createElement('div');
    el.className='sea-particle';
    
    // Crear un contenedor interno para el volteo
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.style.transform = 'scaleX(-1)';
    inner.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.appendChild(inner);
    
    const dy=(Math.random()-.5)*140-80;
    el.style.cssText=`
      position: fixed;
      top: ${8+Math.random()*80}vh;
      --drift-y: ${dy}px;
      animation-duration: ${14+Math.random()*16}s;
      animation-delay: ${Math.random()*12}s;
      font-size: ${40+Math.random()*60}px;
    `;
    document.body.appendChild(el);
  }
})();


/* ── SCROLL REVEAL ── */
const revEls=document.querySelectorAll('.reveal');
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:.1});
revEls.forEach(r=>revObs.observe(r));

/* ── COUNTDOWN — Cambia esta fecha ── */
const EVENT=new Date('2026-10-03T18:00:00');
function tick(){
  const diff=EVENT-new Date();
  // if(diff<=0){ ['cd-d','cd-h','cd-m','cd-s'].forEach(id=>document.getElementById(id).textContent='00'); return; }
  if(diff<=0) {
    ['cd-d','cd-h','cd-m','cd-s'].forEach(id=>document.getElementById(id).textContent='00'); 
    const mensaje =document.getElementById('mensaje');
    if(mensaje){
      mensaje.style.display='block';
    }
    return;
  }

  document.getElementById('cd-d').textContent=String(Math.floor(diff/864e5)).padStart(2,'0');
  document.getElementById('cd-h').textContent=String(Math.floor(diff%864e5/36e5)).padStart(2,'0');
  document.getElementById('cd-m').textContent=String(Math.floor(diff%36e5/6e4)).padStart(2,'0');
  document.getElementById('cd-s').textContent=String(Math.floor(diff%6e4/1e3)).padStart(2,'0');
}
setInterval(tick,1000); tick();

/* ── PHOTO UPLOAD ── */
// document.getElementById('photo-input').addEventListener('change',function(e){
//   const f=e.target.files[0]; if(!f) return;
//   const r=new FileReader();
//   r.onload=ev=>{
//     document.getElementById('photo-frame').innerHTML=`<img src="${ev.target.result}" alt="Festejada">`;
//   };
//   r.readAsDataURL(f);
// });



// Envio de datos a hoja de calculo de google docs

// 🔥 URL de tu Web App
const GS_URL = 'https://script.google.com/macros/s/AKfycbwjlqYu35ygtsCZPtmjvMmAQrEVZSYq5bZn7FvKN09MPZYVZeKfz4u5dL7ct0nOSejF/exec';

const confirmo = localStorage.getItem('rsvp_confirmado');

//  evento trabaja cuando ya se hizo una confirmación
if(confirmo){
      bloquearBotonEnviar()
}



async function enviarRSVP(asiste) {
   
    // 📌 Obtener nombre
    const nombre = document.getElementById('f-name').value.trim();
    if (!nombre) {
        toast('⚠️ Por favor ingrese su nombre');
        return;
    }

    // 📌 Preparar datos
    const payload = {
        timestamp: new Date().toISOString(),
        nombre: nombre,
        asistencia: asiste ? 'Sí' : 'No',
        invitados: document.getElementById('f-guests').value || '1',
        telefono: document.getElementById('f-phone').value || '',
        menu: document.getElementById('f-menu')?.value || ''
    };

    // 📌 Enviar datos
    try {
        const response = await fetch(GS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

         localStorage.setItem('rsvp_confirmado','true');
          bloquearBotonEnviar();
       
        // 📌 Limpiar formulario
        document.getElementById('f-name').value = '';
        document.getElementById('f-guests').value = '1';
        document.getElementById('f-phone').value = '';

        // 📌 Mostrar mensaje de confirmación
        const fb = document.getElementById('form-feedback');
        fb.style.display = 'block';
        fb.innerHTML = asiste
            ? '🌊 ¡Gracias por confirmar su asistencia!'
            : '💙 Agradecemos su respuesta.';

    } catch (error) {
        console.error('❌ Error:', error);
        toast('❌ Error de conexión. Intente nuevamente.');
    }
}


// 📌 Función para mostrar notificaciones
function toast(mensaje) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        animation: fadeIn 0.3s ease;
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 📌 Estilos para la animación (opcional)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);




/* ── TOOLBAR PANELS ── */
function togglePanel(){
  const panel=document.getElementById('panel-music');

  if(panel.style.display === 'block'){
    panel.style.display = 'none'
  }else {
    panel.style.display = 'block'
  }
}



/* ── MUSIC ── */
const aud=document.getElementById('bg-audio');
// let playing=false;
let playing="";


function togglePlay(){
  if(playing){aud.pause();document.getElementById('play-btn').textContent='▶';}
  else{aud.play();document.getElementById('play-btn').textContent='⏸';}
  playing=!playing;
}
function stopAudio(){ aud.pause(); aud.currentTime=0; playing=false; document.getElementById('play-btn').textContent='▶'; }
function setVol(v){ aud.volume=v; }

/* ── TOAST ── */
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3200);
}


function  bloquearBotonEnviar(){
   const btnConfirmar = document.querySelector(".btn-primary");
        if (btnConfirmar) {
            btnConfirmar.innerHTML = ' ¡Confirmado!';
            btnConfirmar.disabled = true;
            btnConfirmar.style.cursor = 'none';
            btnConfirmar.style.opacity = '0.6';
        }

};


//  Boton de sobre de invitacion
function entrarInvitacion(){
  const aud=document.getElementById('bg-audio');
  const visibilidadDeContenedor = document.querySelector('.contenedor');
  const apagadoVisibilidadSobre = document.querySelector('.image-sobre');
 

  visibilidadDeContenedor.style.display='flex';
  apagadoVisibilidadSobre.style.display= 'none';

   playing=true;
    aud.play();
}


// <!--
// ════════════════════════════════════════════════════
//   INSTRUCCIONES GOOGLE SHEETS

//   1. Crea una Hoja de Cálculo con estas columnas:
//      A: Timestamp  B: Nombre  C: Asistencia
//      D: Invitados  E: Teléfono  F: Menú

//   2. Extensiones → Apps Script → pega:

    //  function doPost(e) {
    //    var s = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    //    var d = JSON.parse(e.postData.contents);
    //    s.appendRow([d.timestamp, d.nombre, d.asistencia, d.invitados, d.telefono]);
    //    return ContentService.createTextOutput(JSON.stringify({ok:true}))
    //      .setMimeType(ContentService.MimeType.JSON);
    //  }
    //  function doGet(e) {
    //    return ContentService.createTextOutput('ok');
    //  }

//   3. Implementar → Nueva implementación → Aplicación web
//      Ejecutar como: Yo | Acceso: Cualquier persona
//      → Copiar URL generada

//   4. Reemplaza 'TU_ID_AQUI' en la variable GS_URL del script.
// ════════════════════════════════════════════════════

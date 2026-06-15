//  ═══════════════════════════════
//      SCRIPTS
// ═══════════════════════════════ 

/* ── CURSOR ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.addEventListener('mousedown',()=>{ cur.style.width='6px'; cur.style.height='6px'; ring.style.width='42px'; ring.style.height='42px'; });
document.addEventListener('mouseup',  ()=>{ cur.style.width='10px'; cur.style.height='10px'; ring.style.width='34px'; ring.style.height='34px'; });

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
(()=>{
  const layer=document.getElementById('bubble-layer');
  for(let i=0;i<22;i++){
    const b=document.createElement('div');
    b.className='bub';
    const s=6+Math.random()*16;
    b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${7+Math.random()*12}s;animation-delay:${Math.random()*9}s;`;
    layer.appendChild(b);
  }
})();

/* ── SEA PARTICLES (fish/shells) ── */
(()=>{
  const symbols=['🐠','🐟','🐡','🦑','🐬','🐋','🐙'];
  for(let i=0;i<7;i++){
    const el=document.createElement('div');
    el.className='sea-particle';
    const dy=(Math.random()-.5)*140-80;
    el.style.cssText=`top:${8+Math.random()*80}vh;--drift-y:${dy}px;animation-duration:${14+Math.random()*16}s;animation-delay:${Math.random()*12}s;font-size:${40+Math.random()*60}px;`;
    el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
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
const EVENT=new Date('2025-11-15T18:00:00');
function tick(){
  const diff=EVENT-new Date();
  if(diff<=0){ ['cd-d','cd-h','cd-m','cd-s'].forEach(id=>document.getElementById(id).textContent='00'); return; }
  document.getElementById('cd-d').textContent=String(Math.floor(diff/864e5)).padStart(2,'0');
  document.getElementById('cd-h').textContent=String(Math.floor(diff%864e5/36e5)).padStart(2,'0');
  document.getElementById('cd-m').textContent=String(Math.floor(diff%36e5/6e4)).padStart(2,'0');
  document.getElementById('cd-s').textContent=String(Math.floor(diff%6e4/1e3)).padStart(2,'0');
}
setInterval(tick,1000); tick();

/* ── PHOTO UPLOAD ── */
document.getElementById('photo-input').addEventListener('change',function(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{
    document.getElementById('photo-frame').innerHTML=`<img src="${ev.target.result}" alt="Festejada">`;
  };
  r.readAsDataURL(f);
});

/* ── RSVP → GOOGLE SHEETS ──
   Reemplaza con tu Google Apps Script URL */
const GS_URL='https://script.google.com/macros/s/TU_ID_AQUI/exec';

async function enviarRSVP(asiste){
  const nombre=document.getElementById('f-name').value.trim();
  if(!nombre){ toast('⚠️ Por favor ingrese su nombre'); return; }
  const payload={
    timestamp:new Date().toISOString(),
    nombre, asistencia:asiste?'Sí':'No',
    invitados:document.getElementById('f-guests').value||'1',
    telefono:document.getElementById('f-phone').value,
    menu:document.getElementById('f-menu').value
  };
  try{
    await fetch(GS_URL,{method:'POST',mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)});
  }catch(e){}
  const fb=document.getElementById('form-feedback');
  fb.style.display='block';
  fb.innerHTML=asiste
    ? '🌊 Gracias por confirmar su asistencia.<br>Con gran alegría le esperamos en esta noche especial. 🐚'
    : '💙 Agradecemos su respuesta.<br>Lamentamos que no pueda acompañarnos, pero le llevamos en nuestros pensamientos.';
  toast(asiste?'✅ Asistencia confirmada':'Respuesta registrada');
}

/* ── TOOLBAR PANELS ── */
function togglePanel(id){
  const el=document.getElementById(id);
  el.classList.toggle('open');
  ['panel-color','panel-music'].filter(p=>p!==id).forEach(p=>document.getElementById(p).classList.remove('open'));
}

/* ── COLOR PALETTES ── */
const palettes=[
  {name:'Océano Real',      grad:'135deg,#0099a8,#071830,#c9a84c',
    v:{'--deep':'#050e1f','--navy':'#071830','--midnight':'#09244a','--teal':'#006d77','--aqua':'#0099a8','--seafoam':'#83c5be','--gold':'#c9a84c','--gold-lt':'#e8d5a3','--gold-glow':'#f0d97a'}},
  {name:'Medianoche Índigo',  grad:'135deg,#4a3f8c,#0d0b2a,#d4af37',
    v:{'--deep':'#06040f','--navy':'#0d0b2a','--midnight':'#1a1650','--teal':'#4a3f8c','--aqua':'#7c6fbf','--seafoam':'#b3aadd','--gold':'#d4af37','--gold-lt':'#e8d08a','--gold-glow':'#f7e47a'}},
  {name:'Coral Champagne',   grad:'135deg,#c17b6b,#2a1018,#e8c07a',
    v:{'--deep':'#140609','--navy':'#2a1018','--midnight':'#3d1a28','--teal':'#9b4e55','--aqua':'#c17b6b','--seafoam':'#e0a99e','--gold':'#c9924c','--gold-lt':'#e8cba3','--gold-glow':'#f5dea0'}},
  {name:'Turquesa Esmeralda',grad:'135deg,#00c6a0,#041c18,#b8d96a',
    v:{'--deep':'#021510','--navy':'#041c18','--midnight':'#063028','--teal':'#00a87a','--aqua':'#00c6a0','--seafoam':'#72e0c0','--gold':'#a8c84c','--gold-lt':'#d4e898','--gold-glow':'#e0f278'}},
  {name:'Perla Clásica',     grad:'135deg,#6ba8c4,#0d1a2a,#d4c09a',
    v:{'--deep':'#07101a','--navy':'#0d1a2a','--midnight':'#122540','--teal':'#3a7a96','--aqua':'#6ba8c4','--seafoam':'#aad0e0','--gold':'#c4a87a','--gold-lt':'#ddd0a8','--gold-glow':'#ede0b8'}},
  {name:'Noche Violeta',     grad:'135deg,#8b5cf6,#0d0520,#f0c070',
    v:{'--deep':'#080310','--navy':'#0d0520','--midnight':'#180a38','--teal':'#5e3a9e','--aqua':'#8b5cf6','--seafoam':'#c4b0f8','--gold':'#d4a84c','--gold-lt':'#ecd4a0','--gold-glow':'#f8e07a'}},
];

const sg=document.getElementById('swatch-grid');
palettes.forEach((p,i)=>{
  const sw=document.createElement('div');
  sw.className='swatch'+(i===0?' active':'');
  sw.style.background=`linear-gradient(${p.grad})`;
  sw.innerHTML=`<span>${p.name}</span>`;
  sw.onclick=()=>{
    document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
    sw.classList.add('active');
    const root=document.documentElement;
    Object.entries(p.v).forEach(([k,v])=>root.style.setProperty(k,v));
    document.getElementById('panel-color').classList.remove('open');
  };
  sg.appendChild(sw);
});

/* ── MUSIC ── */
const aud=document.getElementById('bg-audio');
let playing=false;
document.getElementById('music-file').addEventListener('change',function(e){
  const f=e.target.files[0]; if(!f) return;
  document.getElementById('track-display').textContent=f.name;
  aud.src=URL.createObjectURL(f);
  aud.load(); aud.play(); playing=true;
  document.getElementById('play-btn').textContent='⏸';
});
function togglePlay(){
  if(!aud.src) return;
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


// <!--
// ════════════════════════════════════════════════════
//   INSTRUCCIONES GOOGLE SHEETS

//   1. Crea una Hoja de Cálculo con estas columnas:
//      A: Timestamp  B: Nombre  C: Asistencia
//      D: Invitados  E: Teléfono  F: Menú

//   2. Extensiones → Apps Script → pega:

//      function doPost(e) {
//        var s = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//        var d = JSON.parse(e.postData.contents);
//        s.appendRow([d.timestamp, d.nombre, d.asistencia, d.invitados, d.telefono, d.menu]);
//        return ContentService.createTextOutput(JSON.stringify({ok:true}))
//          .setMimeType(ContentService.MimeType.JSON);
//      }
//      function doGet(e) {
//        return ContentService.createTextOutput('ok');
//      }

//   3. Implementar → Nueva implementación → Aplicación web
//      Ejecutar como: Yo | Acceso: Cualquier persona
//      → Copiar URL generada

//   4. Reemplaza 'TU_ID_AQUI' en la variable GS_URL del script.
// ════════════════════════════════════════════════════

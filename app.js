import {AUTO,CUSTOM,groups,fields,defaults,presets,creativeIds} from './config.js';
import {freshState,normalizeState,valueOf,buildPrompt,validate,scenePhases} from './prompt.js';

const $=id=>document.getElementById(id);
const storageKey='videoai-studio-v1';
let state=freshState(), currentGroup=0, saveTimer, toastTimer, storageAvailable=true;
try { const saved=localStorage.getItem(storageKey); if(saved) state=normalizeState(JSON.parse(saved),{allowDraft:true}); } catch { storageAvailable=false; }
const paths=[
  'M4 5h16v14H4z M8 9h8 M8 13h5',
  'M4 4h16v16H4z M4 9h16 M9 4v16',
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  'M4 4h16v16H4z M4 16l5-5 4 4 3-3 4 4 M15 8h.01',
  'M3 6h13v12H3z M16 10l5-3v10l-5-3',
  'M9 18V5l12-2v13 M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3 M21 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3',
  'M12 3v12 M7 10l5 5 5-5 M4 15v6h16v-6',
  'M3 5h18v14H3z M3 10h18 M8 5v5 M16 5v5'
];
function icon(i) { const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.5');svg.setAttribute('aria-hidden','true');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',paths[i]);svg.append(p);return svg; }
function el(tag,className,text) {const e=document.createElement(tag); if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
function toast(message) {$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),4200);}
function save() {
  clearTimeout(saveTimer);
  $('saveStatus').textContent='Sedang menyimpan…';
  saveTimer=setTimeout(()=>{
    try {localStorage.setItem(storageKey,JSON.stringify(state));storageAvailable=true;$('saveStatus').textContent='Draf disimpan';}
    catch {storageAvailable=false;$('saveStatus').textContent='Draf tidak disimpan';}
  },250);
}
function changed() {state.activePreset='';markPreset();updatePreview();save();}
function addText(container,id,label,options={}) {
  const wrap=el('div','field'+(options.full?' full-width':''));
  const l=el('label','',label);l.htmlFor=id;wrap.append(l);
  const input=el(options.multiline?'textarea':'input');input.id=id;input.name=id;
  if(!options.multiline)input.type=options.numeric?'number':'text';
  input.value=state.values[id]??'';
  input.placeholder=options.placeholder||'';
  if(options.multiline)input.rows=options.rows||3;
  if(options.required){input.required=true;input.setAttribute('aria-required','true');}
  if(options.numeric){input.min=options.min;input.max=options.max;input.step=1;}
  else input.maxLength=options.multiline?5000:1000;
  input.addEventListener('input',()=>{
    state.values[id]=options.numeric?(input.value===''?'':Number(input.value)):input.value;
    clearErrors();changed();
    if(id==='scene_count'||id==='scene_duration')renderOverrides();
  });
  wrap.append(input);
  if(options.hint){const hint=el('p','field-hint',options.hint);hint.id=`${id}_hint`;wrap.append(hint);input.setAttribute('aria-describedby',hint.id);}
  container.append(wrap);return wrap;
}
function addSelect(container,f) {
  const wrap=el('div','field');const label=el('label','',f.label);label.htmlFor=f.id;wrap.append(label);
  const select=el('select');select.id=f.id;select.name=f.id;
  for(const val of [...f.values,AUTO,CUSTOM]){const o=el('option','',val===CUSTOM?'Tersuai…':val);o.value=val;select.append(o);}
  select.value=state.values[f.id];
  const custom=el('input','custom-input');custom.type='text';custom.id=`custom_${f.id}`;custom.maxLength=1000;custom.placeholder=`Tetapkan ${f.label.toLowerCase()}`;custom.setAttribute('aria-label',`${f.label} tersuai`);custom.value=state.custom[f.id]||'';custom.hidden=select.value!==CUSTOM;
  select.addEventListener('change',()=>{state.values[f.id]=select.value;custom.hidden=select.value!==CUSTOM;clearErrors();changed();if(f.id==='scene_pattern')renderOverrides();if(!custom.hidden)custom.focus();});
  custom.addEventListener('input',()=>{state.custom[f.id]=custom.value;clearErrors();changed();if(f.id==='scene_pattern')renderOverrides();});
  wrap.append(select,custom);container.append(wrap);
}
function renderForm() {
  $('panels').replaceChildren();
  groups.forEach((g,i)=>{
    const panel=el('section','settings-panel');panel.id=`panel-${g.id}`;panel.hidden=i!==currentGroup;
    const grid=el('div','fields-grid');panel.append(grid);
    if(g.id==='story') {
      addText(grid,'title','Tajuk projek (pilihan)',{full:true,placeholder:'Contoh: Misi Pemikiran Komputasional'});
      addText(grid,'scene_count','Bilangan babak',{numeric:true,min:2,max:12,hint:'2–12 babak. Asal: 4 babak.'});
      addText(grid,'scene_duration','Tempoh setiap babak (saat)',{numeric:true,min:4,max:30,hint:'4–30 saat. Asal: 6 saat.'});
    }
    g.fields.forEach(f=>addSelect(grid,f));
    if(g.id==='world')addText(grid,'character_notes','Butiran watak (pilihan)',{multiline:true,full:true,placeholder:'Contoh: Cikgu Amir, jaket kelabu; Sara, tudung ungu; Danial, rambut pendek. Kekalkan pakaian dan wajah.'});
    if(g.id==='output')addText(grid,'extra_instructions','Arahan tambahan (pilihan)',{multiline:true,full:true,placeholder:'Contoh: Elakkan adegan berbahaya. Gunakan contoh daripada kehidupan sekolah.'});
    $('panels').append(panel);
  });
  const p=el('section','settings-panel');p.id='panel-scenes';p.hidden=currentGroup!==groups.length;p.append(el('p','scene-tip','Fokus, kamera dan aksi di sini mengatasi tetapan umum bagi babak berkenaan. Biarkan kosong untuk menggunakan aliran asal.'));
  const overrides=el('div');overrides.id='sceneOverrides';p.append(overrides);$('panels').append(p);renderOverrides();setGroup(currentGroup,false);
}
function renderOverrides() {
  const root=$('sceneOverrides');if(!root)return;root.replaceChildren();
  const n=Number(state.values.scene_count),d=Number(state.values.scene_duration);
  if(!Number.isInteger(n)||n<2||n>12){root.append(el('p','scene-tip','Tetapkan bilangan babak yang sah dalam bahagian Cerita.'));return;}
  scenePhases(state).forEach((phase,i)=>{
    const details=el('details','scene-override');if(i===0)details.open=true;
    details.append(el('summary','',`Babak ${i+1} · ${i*d}–${(i+1)*d} saat · ${phase}`));const grid=el('div','fields-grid');
    for(const [key,label,placeholder] of [['focus','Fokus babak',phase],['camera','Kamera khusus','Contoh: Zum masuk perlahan pada hologram'],['action','Aksi watak','Contoh: Murid menunjuk langkah penyelesaian']]) {
      const wrap=el('div','field full-width');const id=`scene_${i}_${key}`;const l=el('label','',label);l.htmlFor=id;const input=el('input');input.id=id;input.type='text';input.maxLength=1000;input.placeholder=placeholder;input.value=state.overrides[i]?.[key]||'';
      input.addEventListener('input',()=>{state.overrides[i]??={};state.overrides[i][key]=input.value;changed();});wrap.append(l,input);grid.append(wrap);
    }
    details.append(grid);root.append(details);
  });
}
function renderNav() {
  $('navigation').replaceChildren();
  [...groups,{short:'Setiap babak'}].forEach((g,i)=>{const b=el('button','nav-item');b.type='button';b.dataset.index=i;b.append(icon(i),el('span','',g.short),el('span','nav-index',String(i+1).padStart(2,'0')));b.addEventListener('click',()=>setGroup(i));$('navigation').append(b);});
}
function setGroup(index,scroll=true) {
  currentGroup=Math.max(0,Math.min(groups.length,index));
  document.querySelectorAll('.settings-panel').forEach((p,i)=>p.hidden=i!==currentGroup);
  document.querySelectorAll('.nav-item').forEach((b,i)=>{b.classList.toggle('active',i===currentGroup);if(i===currentGroup)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  $('settingsTitle').textContent=groups[currentGroup]?.label||'Tetapan setiap babak';
  $('groupDescription').textContent=groups[currentGroup]?.description||'Perincikan fokus dan aksi bagi setiap babak secara berasingan.';
  const total=groups.length+1;
  $('stepLabel').textContent=`LANGKAH ${String(currentGroup+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  $('prevBtn').disabled=currentGroup===0;$('nextBtn').hidden=currentGroup===groups.length;
  if(scroll&&window.innerWidth<1000)document.querySelector('.settings-card').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderPresets() {
  $('presets').replaceChildren();presets.forEach((p,i)=>{
    const button=el('button',`preset preset-${i}`);button.type='button';button.dataset.preset=p.id;button.setAttribute('aria-pressed','false');const glyph=el('span','preset-icon');glyph.append(icon([4,0,2,1][i]));const copy=el('span','preset-copy');copy.append(el('strong','',p.label),el('small','',p.description));button.append(glyph,copy,el('span','preset-check','✓'));
    button.addEventListener('click',()=>{
      const preserved=Object.fromEntries(['title','character_notes','extra_instructions'].map(id=>[id,state.values[id]]));
      state.values={...defaults,...p.values,...preserved};
      state.activePreset=p.id;renderForm();markPreset();clearErrors();updatePreview();save();toast(`Preset ${p.label} digunakan.`);
    });$('presets').append(button);
  });markPreset();
}
function markPreset() {document.querySelectorAll('.preset').forEach(b=>{const active=b.dataset.preset===state.activePreset;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});}
function updatePreview() {
  const n=Number(state.values.scene_count),d=Number(state.values.scene_duration),valid=Number.isInteger(n)&&n>=2&&n<=12&&Number.isInteger(d)&&d>=4&&d<=30;
  const ratio=valueOf(state,'aspect_ratio')===AUTO?'Auto':valueOf(state,'aspect_ratio')||'—';
  $('heroScenes').textContent=`${valid?n:'—'} babak`;$('heroDuration').textContent=`${valid?n*d:'—'} saat`;$('heroRatio').textContent=ratio;
  $('statScenes').textContent=valid?n:'—';$('statDuration').textContent=valid?`${n*d}s`:'—';$('statRatio').textContent=ratio;
  $('engineBadge').textContent=valueOf(state,'video_engine')||'Tersuai';
  const output=valid?buildPrompt(state):'Tetapkan bilangan babak antara 2–12 dan tempoh antara 4–30 saat untuk melihat prompt.';
  $('promptOutput').textContent=output;$('wordCount').textContent=`${output.split(/\s+/).filter(Boolean).length.toLocaleString('ms-MY')} perkataan`;
  $('scenePreview').replaceChildren();
  if(valid)scenePhases(state).forEach((phase,i)=>{const card=el('article','scene-card');const index=el('div','scene-number',String(i+1).padStart(2,'0'));const body=el('div');body.append(el('small','',`${i*d}–${(i+1)*d} saat`),el('h3','',state.overrides[i]?.focus||phase),el('p','',state.overrides[i]?.camera||valueOf(state,'camera_movement')));card.append(index,body);$('scenePreview').append(card);});
}
function clearErrors() {$('validationErrors').hidden=true;$('validationErrors').replaceChildren();document.querySelectorAll('[aria-invalid="true"]').forEach(e=>e.removeAttribute('aria-invalid'));}
function checkReady() {
  clearErrors();const errors=validate(state);if(!errors.length)return true;
  $('validationErrors').hidden=false;const list=el('ul');errors.forEach(e=>{list.append(el('li','',e.message));$(e.id)?.setAttribute('aria-invalid','true');});$('validationErrors').append(list);
  const first=$(errors[0].id);if(first){const panel=first.closest('.settings-panel');const index=[...document.querySelectorAll('.settings-panel')].indexOf(panel);setGroup(index);const details=first.closest('details');if(details)details.open=true;first.focus();}
  toast(errors[0].message);return false;
}
function switchTab(scene) {
  $('promptPanel').hidden=scene;$('scenePanel').hidden=!scene;
  $('promptTab').setAttribute('aria-selected',String(!scene));$('sceneTab').setAttribute('aria-selected',String(scene));$('promptTab').tabIndex=scene?-1:0;$('sceneTab').tabIndex=scene?0:-1;
}
function download(content,type,filename) {const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function filename(ext){const slug=(state.values.title||'videoai-prompt').replace(/[^\p{L}\p{N}_-]+/gu,'-').slice(0,80).replace(/^-|-$/g,'')||'videoai-prompt';return `${slug}.${ext}`;}

$('settingsForm').addEventListener('submit',e=>e.preventDefault());
$('prevBtn').addEventListener('click',()=>setGroup(currentGroup-1));$('nextBtn').addEventListener('click',()=>setGroup(currentGroup+1));
$('promptTab').addEventListener('click',()=>switchTab(false));$('sceneTab').addEventListener('click',()=>switchTab(true));
document.querySelector('.preview-tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const scene=e.key==='End'?true:e.key==='Home'?false:e.target.id==='promptTab';switchTab(scene);$(scene?'sceneTab':'promptTab').focus();}});
$('generateBtn').addEventListener('click',()=>{if(checkReady()){updatePreview();switchTab(false);toast('Master prompt siap. Salin ke AI pilihan anda.');}});
$('copyBtn').addEventListener('click',async()=>{
  if(!checkReady())return;
  try {await navigator.clipboard.writeText(buildPrompt(state));toast('Prompt berjaya disalin.');}
  catch {const text=el('textarea');text.value=buildPrompt(state);text.style.position='fixed';text.style.opacity='0';document.body.append(text);text.select();let success=false;try{success=document.execCommand('copy');}catch{}text.remove();if(success)toast('Prompt berjaya disalin.');else {switchTab(false);const selection=window.getSelection(),range=document.createRange();range.selectNodeContents($('promptOutput'));selection.removeAllRanges();selection.addRange(range);toast('Salinan automatik tidak tersedia. Tekan Ctrl+C atau ⌘C pada teks yang dipilih.');}}
});
$('downloadBtn').addEventListener('click',()=>{if(checkReady()){download(buildPrompt(state),'text/plain;charset=utf-8',filename('txt'));toast('Fail prompt dimuat turun.');}});
$('exportBtn').addEventListener('click',()=>{download(JSON.stringify(state,null,2),'application/json;charset=utf-8',filename('json'));toast('Tetapan projek dieksport.');});
$('importBtn').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try {if(file.size>300000)throw new Error('Fail terlalu besar. Had saiz import ialah 300 KB.');const imported=normalizeState(JSON.parse(await file.text()));state=imported;renderForm();markPreset();clearErrors();updatePreview();save();toast('Tetapan projek berjaya diimport.');}
  catch(error){toast(error instanceof SyntaxError?'Format JSON tidak sah. Pilih fail eksport VideoAI.':error.message);}
  finally {e.target.value='';}
});
$('randomBtn').addEventListener('click',()=>{creativeIds.forEach(id=>{const f=fields.find(f=>f.id===id);state.values[id]=f.values[Math.floor(Math.random()*f.values.length)];});state.activePreset='';renderForm();markPreset();updatePreview();save();toast('Gaya kreatif dirawakkan. Watak dan struktur video dikekalkan.');});
$('resetBtn').addEventListener('click',()=>$('resetDialog').showModal());$('cancelReset').addEventListener('click',()=>$('resetDialog').close());
$('confirmReset').addEventListener('click',()=>{state=freshState();currentGroup=0;renderForm();markPreset();clearErrors();updatePreview();save();$('resetDialog').close();toast('Tetapan asal dipulihkan.');});

renderNav();renderPresets();renderForm();updatePreview();
$('saveStatus').textContent=storageAvailable?'Draf disimpan pada pelayar':'Draf tidak disimpan';
window.addEventListener('pagehide',()=>{clearTimeout(saveTimer);try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}});

// Original canvas artwork: cinematic floating storyboard frames, no external assets.
function paintCanvas() {
  const canvas=$('sceneCanvas'),r=canvas.getBoundingClientRect(),ctx=canvas.getContext('2d');if(!ctx||!r.width)return;
  const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.scale(dpr,dpr);const w=r.width,h=r.height;
  ctx.clearRect(0,0,w,h);const glow=ctx.createRadialGradient(w*.57,h*.55,0,w*.57,h*.55,w*.5);glow.addColorStop(0,'rgba(99,196,168,.22)');glow.addColorStop(1,'rgba(99,196,168,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(196,238,218,.07)';ctx.lineWidth=1;
  for(let x=0;x<w;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const frame=(cx,cy,scale,rotation,opacity)=>{
    ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);ctx.scale(scale,scale);ctx.globalAlpha=opacity;
    const grad=ctx.createLinearGradient(-130,-70,130,70);grad.addColorStop(0,'#285453');grad.addColorStop(1,'#16343e');ctx.fillStyle=grad;ctx.shadowColor='rgba(0,0,0,.22)';ctx.shadowBlur=30;ctx.beginPath();ctx.roundRect(-130,-73,260,146,8);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='rgba(192,232,209,.6)';ctx.stroke();
    ctx.save();ctx.beginPath();ctx.roundRect(-122,-65,244,130,5);ctx.clip();ctx.fillStyle='#8bb6a8';ctx.beginPath();ctx.moveTo(-122,65);ctx.lineTo(-70,-5);ctx.lineTo(-20,35);ctx.lineTo(35,-25);ctx.lineTo(122,65);ctx.fill();ctx.fillStyle='#487b73';ctx.beginPath();ctx.moveTo(-122,65);ctx.lineTo(-45,22);ctx.lineTo(5,52);ctx.lineTo(75,12);ctx.lineTo(122,65);ctx.fill();ctx.fillStyle='#d3e8b8';ctx.beginPath();ctx.arc(65,-35,17,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.fillStyle='rgba(9,35,42,.67)';ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e3f2df';ctx.beginPath();ctx.moveTo(-6,-10);ctx.lineTo(11,0);ctx.lineTo(-6,10);ctx.closePath();ctx.fill();ctx.restore();
  };
  const scale=Math.min(w/500,h/265);frame(w*.32,h*.49,scale*.76,-.14,.5);frame(w*.72,h*.54,scale*.82,.13,.7);frame(w*.52,h*.48,scale,-.045,1);
  ctx.strokeStyle='rgba(189,232,208,.7)';ctx.beginPath();ctx.moveTo(w*.77,h*.17);ctx.lineTo(w*.77+10,h*.17);ctx.moveTo(w*.77+5,h*.17-5);ctx.lineTo(w*.77+5,h*.17+5);ctx.stroke();
}
new ResizeObserver(paintCanvas).observe($('sceneCanvas'));

import test from 'node:test';
import assert from 'node:assert/strict';
import {AUTO,CUSTOM,exampleNotes,fields,creativeIds} from '../config.js';
import {freshState,normalizeState,buildPrompt,validate,valueOf,scenePhases} from '../prompt.js';
const validState=()=>{const s=freshState();s.values.notes=exampleNotes;return s;};

test('original master prompt preserves required scenes, language and video structure',()=>{
  const s=freshState(),p=buildPrompt(s);
  assert.equal(validate(s).length,0);
  assert.match(p,/Hasilkan tepat 4 babak/);assert.match(p,/Jumlah tempoh: 24 saat/);
  assert.match(p,/Dialog Bahasa Melayu Malaysia:/);assert.match(p,/Nisbah aspek: 16:9/);
  assert.match(p,/Jangan gunakan jadual/);
  assert.equal((p.match(/• Babak \d+ —/g)||[]).length,4);
  assert.match(p,/maksimum 12 perkataan/);
});

test('every supported count has correct mapping, duration and final phase',()=>{
  for(let n=2;n<=12;n++){
    const s=validState();s.values.scene_count=n;s.values.scene_duration=8;
    const phases=scenePhases(s),p=buildPrompt(s);
    assert.equal(phases.length,n);assert.equal(phases[0],'Tarikan awal');assert.equal(phases.at(-1),'Rumusan');
    assert.equal((p.match(/• Babak \d+ —/g)||[]).length,n);
    assert.ok(p.includes(`Babak ${n} — ${(n-1)*8}–${n*8} saat`));assert.ok(p.includes(`Jumlah tempoh: ${n*8} saat`));
  }
});

test('output modes include only their required visual and video components',()=>{
  const s=validState();
  s.values.output_mode='Prompt imej sahaja';let p=buildPrompt(s);
  assert.ok(p.includes('• Prompt Visual:'));assert.ok(!p.includes('• Prompt Video:'));assert.ok(!p.includes('• Dialog Bahasa'));assert.ok(!p.includes('• Audio:'));
  s.values.output_mode='Prompt video sahaja';p=buildPrompt(s);
  assert.ok(!p.includes('• Prompt Visual:'));assert.ok(p.includes('• Prompt Video:'));assert.ok(p.includes('• Dialog Bahasa'));
  s.values.output_mode='Prompt imej + prompt video';p=buildPrompt(s);
  assert.ok(p.includes('• Prompt Visual:'));assert.ok(p.includes('• Prompt Video:'));assert.ok(!p.includes('• Dialog Bahasa'));
});

test('custom values and scene overrides reach prompt without placeholders',()=>{
  const s=validState();s.values.world_setting=CUSTOM;s.custom.world_setting='Kebun pintar sekolah';s.values.aspect_ratio=CUSTOM;s.custom.aspect_ratio='3:2';
  s.overrides=[{focus:'Kenal pasti masalah',camera:'Zum masuk perlahan',action:'Sara menyentuh skrin'}];
  const p=buildPrompt(s);assert.equal(validate(s).length,0);assert.ok(p.includes('Kebun pintar sekolah'));assert.ok(p.includes('Nisbah aspek: 3:2'));assert.ok(p.includes('Kenal pasti masalah'));assert.ok(p.includes('Kamera khusus: Zum masuk perlahan'));assert.ok(p.includes('Aksi khusus: Sara menyentuh skrin'));assert.ok(!p.includes('__custom__'));
});

test('validation rejects invalid custom ratios and out-of-range durations',()=>{
  let s=freshState();assert.equal(validate(s).length,0);
  s=validState();s.values.scene_count=13;s.values.scene_duration=3;assert.equal(validate(s).length,2);
  s=validState();s.values.aspect_ratio=CUSTOM;s.custom.aspect_ratio='0:9';assert.ok(validate(s).some(e=>e.message.includes('sifar')));
  s.custom.aspect_ratio='lebar';assert.ok(validate(s).length);s.custom.aspect_ratio='9:16';assert.equal(validate(s).length,0);
  s.values.visual_style=CUSTOM;assert.ok(validate(s).some(e=>e.id==='custom_visual_style'));
});

test('language selection changes dialogue labels without contradictory Malay mandate',()=>{
  const s=validState();s.values.language='Bahasa Inggeris';let p=buildPrompt(s);
  assert.ok(p.includes('Dialog Bahasa Inggeris:'));assert.ok(!p.includes('Tulis seluruh cerita, papan cerita, penerangan visual dan dialog dalam Bahasa Melayu Malaysia'));
  s.values.language='Dwibahasa BM–BI';p=buildPrompt(s);assert.ok(p.includes('Pilih satu bahasa audio bagi setiap versi video'));
  s.values.language=AUTO;assert.ok(buildPrompt(s).includes('Pilih satu bahasa yang sesuai dengan jalan cerita'));
});

test('JSON round trip preserves notes, custom fields and scene overrides',()=>{
  const s=validState();s.values.lighting=CUSTOM;s.custom.lighting='Cahaya dari skrin';s.overrides=[{focus:'Soalan',camera:'Statik',action:'Berfikir'}];
  assert.deepEqual(normalizeState(JSON.parse(JSON.stringify(s))),s);
  assert.throws(()=>normalizeState({version:2,values:{}}));
  assert.throws(()=>normalizeState({version:1,values:{scene_count:999}}));
  assert.throws(()=>normalizeState({version:1,values:{language:'Unknown'}}));
  const imported=normalizeState({version:1,values:{notes:'<script>alert(1)</script>'},custom:{__proto__:'x'},unknown:'ignored'});
  assert.equal(imported.values.notes,'<script>alert(1)</script>');assert.equal(imported.unknown,undefined);
});

test('Auto configuration and custom output still request complete structured output',()=>{
  const s=validState();s.values.scene_pattern=AUTO;s.values.aspect_ratio=AUTO;s.values.output_mode=CUSTOM;s.custom.output_mode='Format ringkas bagi bengkel';
  assert.equal(validate(s).length,0);assert.equal(scenePhases(s).length,4);assert.ok(buildPrompt(s).includes('• Prompt Visual:'));assert.ok(buildPrompt(s).includes('• Prompt Video:'));
});

test('creative randomization scope excludes content, characters and structure',()=>{
  const protectedIds=['main_character','character_group','world_setting','scene_count','scene_duration','aspect_ratio'];
  protectedIds.forEach(id=>assert.ok(!creativeIds.includes(id)));creativeIds.forEach(id=>assert.ok(fields.some(f=>f.id===id)));
});

test('unfinished numeric edits do not erase saved notes on reload',()=>{
  const s=validState();s.values.scene_count='';
  const draft=normalizeState(JSON.parse(JSON.stringify(s)),{allowDraft:true});
  assert.equal(draft.values.notes,exampleNotes);assert.equal(draft.values.scene_count,'');
  assert.ok(validate(draft).some(e=>e.id==='scene_count'));
  assert.throws(()=>normalizeState(s));
});

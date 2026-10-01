export const AUTO = 'Auto / Cadangan AI';
export const CUSTOM = '__custom__';
const f = (id, label, values, initial = values[0]) => ({id, label, values, initial});
export const groups = [
  {id:'story',label:'Cerita & struktur video',short:'Cerita',description:'Tentukan aliran cerita, tempoh dan format skrin.',fields:[
    f('story_structure','Jenis naratif',['Masalah → Penyelesaian','Soalan → Penemuan','Misi → Cabaran → Kejayaan','Kesilapan → Pembetulan','Eksperimen → Pemerhatian → Kesimpulan','Misteri → Petunjuk → Jawapan','Situasi sebenar → Analisis → Pengajaran','Pengembaraan pendidikan']),
    f('story_tone','Nada cerita',['Ilmiah','Inspirasi','Serius','Santai','Penuh rasa ingin tahu','Misteri','Pengembaraan','Dramatik ringan','Futuristik']),
    f('moral_focus','Unsur pengajaran',['Kerjasama','Pemikiran kritis','Kreativiti','Tanggungjawab','Integriti','Keselamatan','Disiplin','Empati','Penyelesaian masalah','Tiada unsur khusus']),
    f('aspect_ratio','Nisbah aspek',['16:9','9:16','1:1','4:3','21:9']),
    f('scene_pattern','Aliran babak',['Tarikan awal → Penerangan → Demonstrasi → Rumusan','Masalah → Analisis → Penyelesaian → Pengajaran','Pengenalan → Konflik → Penemuan → Penutup','Soalan → Eksperimen → Hasil → Kesimpulan','Misi → Cabaran → Penyelesaian → Refleksi'])
  ]},
  {id:'world',label:'Dunia & watak',short:'Dunia & watak',description:'Bina persekitaran dan identiti watak yang konsisten.',fields:[
    f('world_setting','Tema dunia',['Futuristik berteknologi tinggi','Sekolah moden','Makmal sains','Makmal komputer','Bandar pintar','Kapal angkasa','Dunia maya','Alam semula jadi','Dunia sejarah','Dunia fantasi pendidikan','Makmal AI','Metaverse pendidikan']),
    f('scene_location','Lokasi khusus',['Bilik darjah','Makmal','Perpustakaan','Pusat kawalan','Bandar futuristik','Kilang pintar','Hutan','Laut','Angkasa lepas','Muzium','Tapak arkeologi','Dunia digital'],'Makmal'),
    f('technology_level','Tahap teknologi',['Semasa','Moden','Futuristik','Sangat futuristik','Siberpunk','Teknologi hologram','Teknologi AI maju'],'Teknologi hologram'),
    f('main_character','Watak utama',['Guru lelaki','Guru perempuan','Murid lelaki','Murid perempuan','Saintis','Jurutera','Robot pembantu','AI hologram']),
    f('character_group','Komposisi watak',['1 guru + 1 murid','1 guru + 2 murid','1 guru + 3 murid','2 murid','3 murid','Guru + murid + robot AI'],'1 guru + 2 murid'),
    f('student_age','Umur / tahap murid',['Sekolah rendah','13 tahun','14 tahun','15 tahun','16 tahun','17 tahun'],'13 tahun'),
    f('teacher_design','Penampilan guru',['Profesional','Saintis','Guru moden','Guru futuristik','Jurulatih teknologi'],'Guru futuristik'),
    f('student_design','Penampilan murid',['Uniform sekolah Malaysia','Pakaian makmal','Pakaian STEM','Pakaian futuristik','Pakaian kasual pendidikan']),
    f('character_expression','Ekspresi watak',['Ingin tahu','Fokus','Teruja','Berfikir','Yakin','Cemas ringan','Gembira','Kagum'])
  ]},
  {id:'visual',label:'Gaya visual & cahaya',short:'Visual',description:'Pilih rupa, warna dan pencahayaan untuk setiap babak.',fields:[
    f('visual_style','Gaya visual',['Anime Jepun sinematik','Anime moden','Anime realistik','Animasi 3D','Animasi 2D','Separa realistik','Animasi 3D keluarga','Komik digital','Ilustrasi pendidikan','Anime fiksyen sains']),
    f('visual_quality','Kualiti visual',['Standard','Berkualiti tinggi','Sinematik','Filem animasi premium','Sangat terperinci'],'Sinematik'),
    f('color_palette','Palet warna',['Biru teknologi','Biru dan ungu','Sian futuristik','Neon siberpunk','Warna pastel','Warna semula jadi','Warna hangat','Gelap sinematik','Cerah pendidikan'],'Biru dan ungu'),
    f('visual_mood','Suasana visual',['Tenang','Inspirasi','Misteri','Cemas','Menakjubkan','Ceria','Serius','Futuristik'],'Menakjubkan'),
    f('lighting','Jenis pencahayaan',['Cahaya sinematik lembut','Cahaya siang semula jadi','Cahaya dramatik','Cahaya volumetrik','Cahaya neon','Sinaran hologram','Cahaya senja keemasan','Cahaya malam sinematik','Cahaya terang pendidikan']),
    f('lighting_intensity','Intensiti cahaya',['Lembut','Sederhana','Dramatik','Kontras tinggi'])
  ]},
  {id:'camera',label:'Kamera & pergerakan',short:'Kamera',description:'Atur syot, sudut dan gerakan. Tetapan setiap babak boleh mengatasi tetapan ini.',fields:[
    f('shot_type','Jenis syot',['Syot sangat luas','Syot luas','Syot sederhana','Syot dekat sederhana','Syot dekat','Syot sangat dekat','Syot dari belakang bahu','Sudut pandang watak','Syot pengenalan'],'Syot sederhana'),
    f('camera_angle','Sudut kamera',['Aras mata','Sudut rendah','Sudut tinggi','Pandangan dari atas','Sudut condong','Dari belakang bahu','Sudut pandang watak']),
    f('camera_movement','Pergerakan kamera',['Statik','Pan ke kiri','Pan ke kanan','Dongak ke atas','Tunduk ke bawah','Zum masuk','Zum keluar','Doli masuk','Doli keluar','Menjejaki watak','Mengorbit subjek','Syot kren','Gerakan kamera tangan lembut','Gerakan udara'],'Doli masuk'),
    f('camera_speed','Kelajuan kamera',['Sangat perlahan','Perlahan','Sederhana','Pantas','Dinamik'],'Perlahan'),
    f('character_action','Aksi watak',['Berdiri dan menerangkan','Berjalan','Menunjukkan objek','Menyentuh hologram','Menulis','Membuat eksperimen','Berinteraksi dengan komputer','Berbincang','Menunjukkan reaksi','Menyelesaikan masalah'],'Menyentuh hologram'),
    f('motion_level','Intensiti pergerakan',['Minimum','Semula jadi','Aktif','Dinamik'],'Semula jadi'),
    f('transition_style','Transisi',['Potongan terus','Pudar','Larut silang','Transisi zum','Kilatan cahaya','Transisi hologram','Gangguan digital','Potongan padan','Sapuan sinematik'],'Transisi hologram')
  ]},
  {id:'audio',label:'Dialog & audio',short:'Dialog & audio',description:'Sesuaikan bahasa, suara dan bunyi dengan tempoh video.',fields:[
    f('language','Bahasa utama',['Bahasa Melayu Malaysia','Bahasa Melayu Malaysia + istilah teknikal Inggeris','Bahasa Inggeris','Dwibahasa BM–BI']),
    f('language_level','Tahap bahasa',['Sangat mudah','Murid sekolah rendah','Murid menengah rendah','Murid menengah atas','Akademik'],'Murid menengah rendah'),
    f('dialog_density','Panjang dialog',['Sangat ringkas','Ringkas','Sederhana','Penerangan lengkap'],'Ringkas'),
    f('dialog_style','Gaya dialog',['Formal pendidikan','Mudah difahami','Perbualan guru-murid','Soal jawab','Inkuiri','Motivasi','Penerangan ilmiah'],'Perbualan guru-murid'),
    f('teacher_voice','Suara utama',['Lelaki matang','Lelaki muda','Wanita matang','Wanita muda','Tenang','Tegas','Mesra','Berwibawa'],'Tenang'),
    f('background_music','Muzik latar',['Tiada','Ambien futuristik','Inspirasi','Teknologi','Misteri','Pengembaraan','Sinematik','Lo-fi pendidikan'],'Ambien futuristik'),
    f('sound_effect','Kesan bunyi',['Minimum','Hologram','Teknologi','Makmal','Alam semula jadi','Fiksyen sains','Sinematik'],'Hologram'),
    f('onscreen_text','Teks skrin',['Tiada','Tajuk sahaja','Kata kunci','Fakta penting','Definisi','Rumusan','Soalan refleksi'],'Kata kunci'),
    f('subtitle','Sarikata',['Tiada','Bahasa Melayu','Bahasa Inggeris','Dwibahasa'],'Bahasa Melayu')
  ]},
  {id:'output',label:'Konsistensi & output',short:'Output',description:'Kawal kesinambungan visual dan kandungan prompt yang dijana.',fields:[
    f('character_consistency','Konsistensi watak',['Rendah','Sederhana','Tinggi','Sangat tinggi'],'Sangat tinggi'),
    f('environment_consistency','Konsistensi lokasi',['Lokasi sama semua babak','Lokasi berubah mengikut cerita','Lokasi sama dengan sudut berlainan'],'Lokasi sama dengan sudut berlainan'),
    f('wardrobe_consistency','Konsistensi pakaian',['Kekalkan pakaian sama','Tukar mengikut lokasi','Tukar mengikut babak']),
    f('output_mode','Format output',['Cerita + storyboard','Storyboard sahaja','Prompt imej + prompt video','Prompt video sahaja','Prompt imej sahaja','Storyboard + dialog + audio']),
    f('video_engine','Enjin sasaran',['Universal','Veo','Sora','Kling','Runway','Pika','Hailuo','Luma','Seedance']),
    f('prompt_detail','Tahap perincian',['Ringkas','Standard','Terperinci','Sangat terperinci','Sedia untuk produksi'],'Terperinci')
  ]}
];
export const fields = groups.flatMap(g=>g.fields);
export const defaults = Object.fromEntries(fields.map(f=>[f.id,f.initial]));
Object.assign(defaults,{title:'',notes:'',character_notes:'',scene_count:4,scene_duration:6,extra_instructions:''});
export const presets = [
  {id:'futuristic',label:'Anime futuristik',description:'Hologram · guru & murid',values:{}},
  {id:'lab',label:'Eksperimen sains',description:'Makmal · inkuiri',values:{world_setting:'Makmal sains',technology_level:'Moden',visual_style:'Animasi 3D',color_palette:'Cerah pendidikan',teacher_design:'Saintis',student_design:'Pakaian makmal',character_action:'Membuat eksperimen',story_structure:'Eksperimen → Pemerhatian → Kesimpulan',scene_pattern:'Soalan → Eksperimen → Hasil → Kesimpulan',lighting:'Cahaya terang pendidikan',background_music:'Inspirasi',sound_effect:'Makmal',transition_style:'Potongan terus'}},
  {id:'history',label:'Misi sejarah',description:'Muzium · penemuan',values:{world_setting:'Dunia sejarah',scene_location:'Muzium',technology_level:'Semasa',visual_style:'Anime realistik',color_palette:'Warna hangat',teacher_design:'Profesional',character_action:'Menunjukkan objek',story_tone:'Pengembaraan',story_structure:'Misteri → Petunjuk → Jawapan',lighting:'Cahaya senja keemasan',background_music:'Pengembaraan',sound_effect:'Minimum',transition_style:'Larut silang'}},
  {id:'short',label:'Video ringkas',description:'Menegak · 3 babak',values:{aspect_ratio:'9:16',scene_count:3,scene_duration:8,visual_style:'Animasi 2D',color_palette:'Warna pastel',world_setting:'Sekolah moden',technology_level:'Moden',teacher_design:'Guru moden',character_action:'Berdiri dan menerangkan',dialog_density:'Sangat ringkas',onscreen_text:'Kata kunci',transition_style:'Potongan terus'}}
];
export const creativeIds = ['color_palette','visual_mood','lighting','lighting_intensity','shot_type','camera_angle','camera_movement','camera_speed','transition_style','background_music'];
export const exampleNotes = 'Topik: Teknik pemikiran komputasional.\nLeraian memecahkan masalah kompleks kepada bahagian kecil. Pengecaman corak mengenal pasti persamaan. Peniskalaan menumpukan perkara penting dan mengabaikan butiran tidak relevan. Pengitlakan membina penyelesaian yang boleh digunakan bagi masalah serupa.\nContoh: Guru dan dua murid merancang jadual menyiram tanaman di kebun sekolah. Mereka membahagikan tugas, mengenal pasti keperluan tanaman, memilih maklumat penting dan membina langkah yang boleh digunakan semula.';

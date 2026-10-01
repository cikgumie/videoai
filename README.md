VideoAI Studio
==============

Webapp pembina master prompt untuk papan cerita video pendidikan. Dibangunkan untuk CikguMie. Antara muka utama menggunakan Bahasa Melayu Malaysia.

Fungsi
------

- Nota pengajaran, mata pelajaran, Tahun 1–6 / Tingkatan 1–5, objektif dan rujukan DSKP pilihan.
- 47 dropdown untuk cerita, dunia, watak, visual, pencahayaan, kamera, gerakan, dialog, audio dan konsistensi.
- Pilihan Auto / Cadangan AI dan Tersuai bagi setiap dropdown.
- 4 preset: anime futuristik, eksperimen sains, misi sejarah dan video ringkas.
- Bilangan babak 2–12; tempoh 4–30 saat; nisbah aspek boleh disesuaikan.
- Fokus, kamera dan aksi khusus bagi setiap babak.
- Pratonton master prompt dan susunan babak yang berubah mengikut tetapan.
- Rawakan gaya kreatif sambil mengekalkan nota, watak dan struktur video.
- Salin prompt, muat turun TXT, eksport dan import tetapan JSON.
- Draf automatik pada pelayar menggunakan localStorage.
- Reka bentuk responsif, kawalan papan kekunci dan ilustrasi asal menggunakan HTML Canvas.

Tetapan asal: 4 babak × 6 saat, nisbah 16:9, anime Jepun sinematik, dunia futuristik, seorang guru dan dua murid, Bahasa Melayu Malaysia.

Cara guna
---------

1. Tampal nota pengajaran atau pilih “Gunakan nota contoh”.
2. Masukkan mata pelajaran, tahap dan objektif pembelajaran. Tambah SK / SP daripada DSKP anda jika tersedia.
3. Pilih preset dan sesuaikan tetapan melalui menu kiri.
4. Buka “Setiap babak” untuk menetapkan fokus, kamera dan aksi khusus.
5. Klik “Bina master prompt”. Salin hasil atau muat turun TXT.
6. Tampal prompt ke AI pilihan anda untuk menjana cerita dan papan cerita. Gunakan prompt visual / video daripada hasil AI untuk penghasilan aset.

Aplikasi ini membina prompt secara setempat; ia tidak memanggil model AI dan tidak menjana video atau papan cerita lengkap dengan sendiri. Pilihan Auto ialah arahan untuk model AI sasaran, bukan inferens AI di dalam aplikasi. Pilihan enjin hanya menyesuaikan konteks sasaran tanpa mendakwa sokongan API atau parameter khusus.

Bahasa Melayu Malaysia ialah bahasa asal. Pengguna boleh memilih bahasa lain; label dialog akan mengikut bahasa dipilih. Julat dialog menggunakan anggaran konservatif dua perkataan sesaat, bukan jaminan tempoh suara sebenar. Format imej sahaja mengecualikan prompt video, dialog dan audio; format video sahaja mengecualikan prompt visual imej.

Jalankan secara setempat
------------------------

Tiada dependency frontend atau langkah build. Jalankan pelayan HTTP dari folder projek kerana aplikasi menggunakan modul JavaScript.

```sh
python3 -m http.server 4173
```

Buka `http://localhost:4173`. Pada Windows, gunakan `py -m http.server 4173` jika arahan python3 tidak tersedia. Jangan buka index.html terus melalui file://.

Jika Node.js tersedia, `npm start` turut menjalankan pelayan Python yang sama.

GitHub Pages
------------

Fail statik tersedia terus dari akar repositori. Untuk menerbitkannya sendiri:

1. Buka Settings → Pages pada repositori GitHub.
2. Pilih Deploy from a branch.
3. Pilih main dan folder / (root), kemudian Save.
4. Gunakan URL yang dipaparkan GitHub selepas penerbitan selesai.

Semua pautan aset menggunakan laluan relatif untuk menyokong sublaluan /videoai/. Tiada workflow, API key atau backend diperlukan. Repositori ini tidak mengaktifkan GitHub Pages secara automatik.

Penyimpanan dan eksport
----------------------

Nota tidak dihantar ke mana-mana pelayan oleh aplikasi ini. Draf tersimpan pada pelayar dan peranti yang sama. Eksport JSON untuk memindahkan atau menyimpan projek. Jika pelayar menyekat localStorage atau storan penuh, status akan memaparkan bahawa draf tidak disimpan; muat turun TXT / JSON masih tersedia. Jangan masukkan maklumat peribadi murid yang tidak diperlukan dalam prompt yang akan dihantar kepada perkhidmatan AI luar.

Struktur kod
------------

- index.html — struktur antara muka dan metadata.
- styles.css — reka bentuk responsif, paparan cetak dan fokus kawalan.
- config.js — definisi dropdown, tetapan asal, preset dan nota contoh.
- prompt.js — pembinaan prompt, pengesahan, normalisasi import dan pemetaan babak.
- app.js — interaksi, draf, eksport, import dan ilustrasi Canvas.
- tests/prompt.test.js — ujian logik menggunakan node:test.

Semakan
-------

```sh
npm run check
npm test
```

Ujian menggunakan Node.js 18 atau lebih baharu, tanpa pemasangan pakej. Ujian merangkumi format output, pemetaan bilangan babak, bahasa dialog, nilai tersuai, import JSON dan had tempoh.

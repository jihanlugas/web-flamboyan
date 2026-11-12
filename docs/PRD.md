# Product Requirements Document (PRD)

> **Status:** Draft  
> **Product:** Belum ditentukan  
> **Pemilik:** Belum ditentukan  
> **Terakhir diperbarui:** 12 November 2026

## 1. Ringkasan

Dokumen ini menjadi acuan kebutuhan produk, ruang lingkup, dan kriteria keberhasilan. Produk menyediakan halaman untuk mengatur harga lapangan dan bola, mengelola daftar pemain, melihat ringkasan, serta mengekspor data.

## 2. Latar Belakang dan Masalah

- **Latar belakang:** Belum ditentukan.
- **Masalah yang ingin diselesaikan:** Belum ditentukan.
- **Dampak masalah saat ini:** Belum ditentukan.

## 3. Tujuan dan Bukan Tujuan

### Tujuan

- Belum ditentukan.

### Bukan tujuan

- Belum ditentukan.

## 4. Pengguna Sasaran

| Segmen pengguna | Kebutuhan utama | Konteks penggunaan |
|---|---|---|
| Belum ditentukan | Belum ditentukan | Belum ditentukan |

## 5. Kebutuhan Produk

### Kebutuhan fungsional

| ID | Kebutuhan | Prioritas | Kriteria penerimaan |
|---|---|---|---|
| FR-1 | Pengguna dapat mengatur harga lapangan dan harga bola melalui modal Setting. | Tinggi | Memilih Setting membuka modal dengan isian harga lapangan dan harga bola. Pengguna dapat menyimpan atau membatalkan perubahan. |
| FR-2 | Pengguna dapat menambahkan pemain melalui modal Add Pemain. | Tinggi | Memilih Add Pemain membuka modal untuk mengisi data pemain baru; pemain ditambahkan ke daftar setelah formulir dikonfirmasi. |
| FR-3 | Halaman menampilkan daftar pemain dan menyediakan tombol untuk mengelola pemain. | Tinggi | Daftar pemain dan kontrol pengelolaan tersedia di area utama halaman. Aksi pengelolaan yang didukung akan ditentukan lebih lanjut. |
| FR-4 | Pengguna dapat memulai reset pengaturan dan data pemain. | Tinggi | Memilih Reset membuka modal konfirmasi yang menjelaskan bahwa pengaturan dan data pemain akan direset. Reset hanya dijalankan setelah dikonfirmasi. |
| FR-5 | Halaman menampilkan ringkasan dan menyediakan fitur ekspor. | Tinggi | Ringkasan dan kontrol ekspor tersedia di bagian bawah area utama halaman. Isi ringkasan dan format ekspor ditentukan lebih lanjut. |

### Kebutuhan nonfungsional

- **Performa:** Belum ditentukan.
- **Aksesibilitas:** Belum ditentukan.
- **Keamanan dan privasi:** Belum ditentukan.
- **Kompatibilitas perangkat/peramban:** Belum ditentukan.

## 6. Alur Pengguna dan Pengalaman

### Struktur halaman

Halaman utama terdiri dari dua area: header dan body.

- **Header:** nama aplikasi berada di sebelah kiri. Di sebelah kanan terdapat menu Setting, Add Pemain, dan Reset.
- **Body:** menampilkan daftar pemain beserta tombol yang diperlukan untuk mengelola pemain. Di bagian paling bawah body terdapat ringkasan dan kontrol ekspor.

### Interaksi utama

- **Setting:** membuka modal untuk mengisi dan menyimpan harga lapangan serta harga bola, atau membatalkan perubahan.
- **Add Pemain:** membuka modal untuk mengisi data pemain baru dan menambahkannya ke daftar.
- **Reset:** membuka modal konfirmasi sebelum pengaturan dan data pemain direset.
- **Pengelolaan pemain:** pengguna mengelola pemain dari tombol yang tersedia pada area daftar pemain; jenis aksi perlu dikonfirmasi.
- **Ringkasan dan ekspor:** pengguna meninjau ringkasan di bagian bawah halaman dan dapat memulai ekspor data.

## 7. Ruang Lingkup

### Termasuk

- Header dengan nama aplikasi dan menu Setting, Add Pemain, serta Reset.
- Modal pengaturan harga lapangan dan harga bola.
- Modal untuk menambahkan pemain.
- Modal konfirmasi reset pengaturan dan data pemain.
- Daftar pemain dengan kontrol pengelolaan.
- Ringkasan dan ekspor di bagian bawah area utama.

### Tidak termasuk

- Belum ditentukan.

## 8. Metrik Keberhasilan

| Metrik | Kondisi awal | Target | Periode pengukuran |
|---|---|---|---|
| Belum ditentukan | Belum ditentukan | Belum ditentukan | Belum ditentukan |

## 9. Asumsi, Ketergantungan, dan Risiko

- **Asumsi:** Belum ditentukan.
- **Ketergantungan:** Belum ditentukan.
- **Risiko dan mitigasi:** Belum ditentukan.

## 10. Rencana Rilis

Tahapan pengembangan, peluncuran, dan evaluasi belum ditentukan.

## 11. Pertanyaan Terbuka

- Apa nama aplikasi yang akan ditampilkan di header?
- Aksi apa saja yang perlu tersedia untuk mengelola pemain dari daftar?
- Informasi apa yang ditampilkan dalam ringkasan?
- Format ekspor apa yang diperlukan dan data apa saja yang disertakan?
- Apakah perubahan harga dan data pemain perlu tetap tersimpan setelah halaman ditutup atau dimuat ulang?
- Siapa pengguna sasaran dan masalah utama yang mereka hadapi?
- Bagaimana keberhasilan produk akan diukur?
- Apakah ada batasan teknis, jadwal, atau integrasi yang perlu dipertimbangkan?

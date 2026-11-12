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
| FR-1 | Pengguna dapat mengatur harga lapangan dan harga shuttle melalui modal Setting. | Tinggi | Pengguna dapat menyimpan atau membatalkan perubahan harga bersama yang digunakan untuk menghitung biaya semua pemain. |
| FR-2 | Pengguna dapat menambah dan mengubah data pemain: nama, jumlah shuttle, dan jumlah yang sudah dibayar. | Tinggi | Setelah formulir dikonfirmasi, data pemain disimpan dan total biaya dihitung otomatis dengan rumus `courtPrice + (shuttlePrice × shuttleCount)`. |
| FR-3 | Halaman menampilkan setiap pemain dalam panel collapsible dengan kontrol untuk mengelola pemain. | Tinggi | Header panel menampilkan nama pemain di kiri dan `totalPrice` di kanan. Saat dibuka, panel menampilkan nama, jumlah shuttle, harga lapangan, harga shuttle, total biaya, nominal dibayar, sisa tagihan, serta aksi edit/hapus. |
| FR-4 | Pengguna dapat memulai reset pengaturan dan data pemain. | Tinggi | Memilih Reset membuka modal konfirmasi yang menjelaskan bahwa pengaturan dan data pemain akan direset. Reset hanya dijalankan setelah dikonfirmasi. |
| FR-5 | Halaman menampilkan ringkasan tagihan, pembayaran, dan kontrol ekspor. | Tinggi | Ringkasan menampilkan jumlah pemain, jumlah shuttle, total tagihan pemain, total dibayar, dan sisa tagihan. Format ekspor ditentukan lebih lanjut. |

### Model data utama

```json
{
	"courtPrice": 0,
	"shuttlePrice": 0,
	"players": [
		{
			"name": "",
			"shuttleCount": 0,
			"totalPrice": 0,
			"paid": 0
		}
	]
}
```

`totalPrice` dihitung untuk setiap pemain dengan rumus `courtPrice + (shuttlePrice × shuttleCount)`. Nilai `paid` mencatat pembayaran pemain; sisa tagihan adalah `totalPrice - paid`.

### Kebutuhan nonfungsional

- **Performa:** Belum ditentukan.
- **Aksesibilitas:** Belum ditentukan.
- **Keamanan dan privasi:** Belum ditentukan.
- **Kompatibilitas perangkat/peramban:** Belum ditentukan.

## 6. Alur Pengguna dan Pengalaman

### Struktur halaman

Halaman utama terdiri dari dua area: header dan body.

- **Header:** nama aplikasi berada di sebelah kiri. Di sebelah kanan terdapat menu Setting, Add Pemain, dan Reset.
- **Body:** langsung menampilkan daftar pemain dalam panel collapsible, tanpa heading daftar terpisah. Setiap header panel menampilkan nama pemain di kiri dan total biaya sesi di kanan. Bagian panel yang dibuka menampilkan rincian biaya dan aksi edit/hapus. Di bagian paling bawah body terdapat ringkasan biaya dan kontrol ekspor.

### Interaksi utama

- **Setting:** membuka modal untuk mengisi dan menyimpan harga lapangan serta harga shuttle, atau membatalkan perubahan.
- **Add Pemain:** membuka modal untuk mengisi nama, jumlah shuttle, dan jumlah yang sudah dibayar; total biaya dihitung otomatis.
- **Reset:** membuka modal konfirmasi sebelum pengaturan dan data pemain direset.
- **Pengelolaan pemain:** pengguna membuka panel pemain untuk melihat rincian harga, total biaya, jumlah yang sudah dibayar, dan sisa tagihan; pengguna dapat mengedit data atau menghapus pemain.
- **Ringkasan dan ekspor:** pengguna meninjau total tagihan semua pemain, total pembayaran, dan sisa tagihan di bagian bawah halaman. Kontrol ekspor tersedia; format ekspor belum ditentukan.

## 7. Ruang Lingkup

### Termasuk

- Header dengan nama aplikasi dan menu Setting, Add Pemain, serta Reset.
- Modal pengaturan harga lapangan dan harga shuttle.
- Modal untuk menambah dan mengubah nama, jumlah shuttle, serta pembayaran pemain.
- Modal konfirmasi reset pengaturan dan data pemain.
- Daftar pemain dalam panel collapsible dengan rincian biaya dan kontrol edit/hapus.
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
- Format ekspor apa yang diperlukan dan data apa saja yang disertakan?
- Siapa pengguna sasaran dan masalah utama yang mereka hadapi?
- Bagaimana keberhasilan produk akan diukur?
- Apakah ada batasan teknis, jadwal, atau integrasi yang perlu dipertimbangkan?

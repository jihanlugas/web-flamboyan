# Product Requirements Document (PRD)

> **Produk:** Aplikasi pencatatan mabar badminton<br>
> **Status:** Draft<br>
> **Pemilik:** Belum ditentukan<br>
> **Terakhir diperbarui:** 13 November 2026

## 1. Ringkasan

Aplikasi satu halaman untuk mencatat biaya dan pembayaran pemain dalam satu sesi mabar badminton. Aplikasi mengatur harga lapangan dan bola, mencatat jumlah bermain, jumlah bola, serta pembayaran setiap pemain, menampilkan ringkasan sesi, dan membagikan laporan melalui WhatsApp. Data sesi disimpan dalam satu objek JSON di local storage peramban.

## 2. Latar Belakang, Masalah, dan Tujuan

Penyelenggara mabar membutuhkan cara sederhana untuk mencatat jumlah bermain, penggunaan bola, biaya, dan pembayaran setiap pemain, serta membagikan rekap kepada peserta.

Tujuan produk:

- Memudahkan pencatatan dan perhitungan biaya setiap pemain.
- Menampilkan total biaya, pembayaran, dan sisa pembayaran sesi.
- Membagikan detail dan ringkasan sesi melalui WhatsApp.
- Menyimpan data sesi agar tetap tersedia ketika halaman dibuka kembali di peramban yang sama.

## 3. Pengguna Sasaran

Penyelenggara atau peserta yang bertugas mencatat biaya dan pembayaran sesi mabar badminton.

## 4. Ruang Lingkup

### Termasuk

- Satu halaman dengan header, pengaturan, daftar pemain, ringkasan, dan tombol laporan WhatsApp.
- Satu sesi aktif yang disimpan secara lokal.
- Pengaturan harga lapangan, harga bola, dan fitur pencatatan jumlah bermain.
- Penambahan dan pengubahan data pemain, termasuk nama, jumlah bermain, jumlah bola, dan pembayaran.
- Daftar pemain dalam panel collapsible dengan rincian biaya serta aksi edit dan hapus.
- Perhitungan biaya dan ringkasan secara otomatis.
- Reset untuk memulai sesi berikutnya setelah konfirmasi.

### Tidak termasuk

- Akun pengguna, server, atau sinkronisasi antarperangkat.
- Penyimpanan beberapa sesi dan riwayat sesi.
- Pemrosesan pembayaran di dalam aplikasi.
- Pengiriman pesan WhatsApp secara otomatis tanpa tindakan pengguna.

## 5. Alur Penggunaan

1. Pengguna membuka menu Setting dan mengatur harga lapangan, harga bola, serta fitur jumlah bermain.
2. Pengguna menambahkan pemain melalui menu Tambah pemain dengan memasukkan nama.
3. Pengguna mengubah jumlah bola dan, jika diaktifkan, jumlah bermain melalui tombol pada rincian kartu. Pembayaran dapat diubah melalui modal edit pemain atau dilunasi melalui tombol Mark lunas ketika masih ada sisa pembayaran.
4. Aplikasi menghitung biaya dan menampilkan pemain serta ringkasan sesi.
5. Pengguna membuka panel pemain untuk meninjau rincian, mengedit data, atau menghapus pemain.
6. Pengguna menekan tombol laporan WhatsApp dan memilih kontak atau grup tujuan di WhatsApp.
7. Untuk mabar berikutnya, pengguna mereset data pemain setelah konfirmasi; harga dan pengaturan fitur tetap dipertahankan.

## 6. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas | Kriteria penerimaan |
|---|---|---|---|
| FR-01 | Aplikasi menyediakan satu halaman dengan header dan menu utama. | Tinggi | Nama aplikasi tampil di kiri header; menu Setting, Tambah pemain, dan Reset tersedia di kanan tanpa berpindah halaman. |
| FR-02 | Pengguna dapat mengatur harga dan fitur jumlah bermain melalui modal Setting. | Tinggi | Pengguna dapat menyimpan atau membatalkan perubahan. Harga lapangan boleh 0 dan tidak ditampilkan di luar Setting atau laporan jika 0. Checkbox jumlah bermain awalnya nonaktif, termasuk untuk data lama; pilihan disimpan dan dapat dibatalkan sebelum penyimpanan. |
| FR-03 | Pengguna dapat menambahkan dan mengubah data pemain. | Tinggi | Modal tambah hanya menerima nama; jumlah bermain, jumlah bola, dan pembayaran pemain baru bernilai 0. Modal edit menerima nama dan pembayaran tanpa mengubah jumlah yang tercatat. |
| FR-04 | Halaman menampilkan pemain dalam panel collapsible. | Tinggi | Header menampilkan nama dan total biaya tanpa nomor urut. Rincian menampilkan biaya, pembayaran, dan kontrol jumlah bola; kontrol jumlah bermain hanya tampil jika fitur aktif. Tombol + dan - mengubah nilai satu per satu tanpa nilai negatif atau input langsung. |
| FR-05 | Aplikasi menghitung biaya dan sisa pembayaran setiap pemain. | Tinggi | Perhitungan mengikuti rumus pada bagian 7. Jumlah bermain dicatat, tetapi tidak mengalikan harga lapangan. Pembayaran yang melebihi biaya tetap tercatat dan sisa pembayaran dapat bernilai negatif. Tombol Mark lunas tersedia ketika ada sisa pembayaran dan menyetel jumlah dibayar menjadi total biaya. |
| FR-06 | Ringkasan sesi ditampilkan di bagian bawah halaman. | Tinggi | Ringkasan memuat jumlah pemain, jumlah bola, total biaya keseluruhan, total bayar, dan sisa/kelebihan pembayaran. |
| FR-07 | Pengguna dapat membagikan laporan sesi melalui WhatsApp. | Tinggi | Tombol laporan membuka WhatsApp dengan teks berisi ringkasan serta detail setiap pemain. Pengguna memilih kontak atau grup dan mengirimkan laporan di WhatsApp. |
| FR-08 | Data sesi disimpan dalam satu JSON di local storage. | Tinggi | Setelah halaman dimuat ulang atau dibuka kembali di peramban yang sama, harga, pengaturan fitur, dan data pemain yang telah disimpan dipulihkan. Menonaktifkan fitur tidak menghapus jumlah bermain. |
| FR-09 | Pengguna dapat mereset data pemain untuk memulai sesi baru. | Tinggi | Aplikasi meminta konfirmasi sebelum menghapus seluruh pemain dan data mereka. Setelah dikonfirmasi, daftar pemain menjadi kosong sementara harga dan pengaturan fitur tetap dipertahankan. |

### Validasi dan penanganan data

- Nama pemain tidak boleh kosong.
- Harga, jumlah bermain, jumlah bola, dan pembayaran tidak boleh negatif.
- Jumlah bermain dan jumlah bola berupa bilangan bulat.
- Nominal menggunakan rupiah (IDR) tanpa desimal.
- Jika data local storage tidak dapat dibaca atau disimpan, aplikasi menampilkan pemberitahuan yang jelas; aplikasi tidak boleh mengklaim bahwa data telah tersimpan.

## 7. Aturan Perhitungan

Untuk setiap pemain:

```text
total biaya pemain = 1 × harga lapangan + jumlah bola pemain × harga bola
sisa bayar pemain  = total biaya pemain - jumlah bayar pemain
```

Harga lapangan dibebankan sekali untuk setiap pemain yang tercatat, berapa pun jumlah bermainnya. Jumlah bermain hanya menjadi data pencatatan dan laporan, bukan pengali biaya lapangan. Jika harga lapangan bernilai 0, komponen biaya lapangan adalah 0 dan total biaya pemain hanya berasal dari penggunaan bola.

Untuk keseluruhan sesi:

```text
total biaya keseluruhan = jumlah seluruh total biaya pemain
total bayar             = jumlah seluruh pembayaran pemain
sisa bayar              = total biaya keseluruhan - total bayar
```

Sisa bayar positif menunjukkan kekurangan pembayaran; nilai nol berarti lunas; nilai negatif menunjukkan kelebihan pembayaran. Nilai negatif tidak diubah menjadi nol.

## 8. Tampilan dan Pengalaman Pengguna

### Struktur halaman

Halaman utama terdiri dari header dan area utama:

- **Header:** nama aplikasi berada di sebelah kiri. Di sebelah kanan terdapat menu Setting, Tambah pemain, dan Reset.
- **Setting:** modal untuk mengisi harga lapangan dan harga bola serta mengaktifkan atau menonaktifkan pencatatan jumlah bermain, dengan aksi simpan dan batal.
- **Tambah/Edit pemain:** modal tambah hanya meminta nama; modal edit mengubah nama dan jumlah yang sudah dibayar. Total biaya dihitung otomatis.
- **Daftar pemain:** langsung ditampilkan di area utama tanpa heading daftar terpisah. Header panel menampilkan nama dan total biaya tanpa nomor, avatar, atau label total biaya. Di bawah total, tampil nominal sisa berwarna merah atau nominal kelebihan berwarna hijau tanpa label; jika selisihnya nol, tampil Lunas hanya ketika total biaya lebih dari nol. Rincian menampilkan informasi pemain di kiri serta bagian jumlah, rincian harga, dan pembayaran di kanan; pada mobile semuanya disusun vertikal. Tombol + dan - mengubah jumlah bola dan, jika fitur aktif, jumlah bermain; nilainya tidak dapat diketik atau menjadi negatif. Bagian pembayaran menampilkan jumlah dibayar dan sisa atau kelebihan pembayaran, atau status Lunas jika selisihnya nol. Tombol Mark lunas hanya tersedia untuk sisa pembayaran dan menyetel jumlah dibayar menjadi total biaya. Tombol dan checkbox dapat diakses melalui keyboard dan mudah digunakan di layar sentuh.
- **Ringkasan:** berada di bagian paling bawah area utama dan menampilkan jumlah pemain, jumlah bola, total biaya keseluruhan, total bayar, serta sisa/kelebihan pembayaran.
- **Aksi:** tombol laporan WhatsApp dan Reset tersedia pada halaman.

Jika harga lapangan bernilai 0, inputnya tetap dapat diakses di Setting, tetapi harga tersebut tidak ditampilkan di bagian halaman lainnya atau laporan WhatsApp.

### Isi laporan WhatsApp

Laporan berbentuk teks yang mencakup:

- Harga bola yang digunakan, serta harga lapangan hanya jika nilainya lebih dari 0.
- Untuk setiap pemain: nama, jumlah bola, total biaya, jumlah bayar, dan sisa bayar atau kelebihan pembayaran. Jumlah bermain dicantumkan hanya jika fitur tersebut aktif.
- Ringkasan sesi: jumlah pemain, jumlah bola, total biaya keseluruhan, total bayar, dan sisa bayar atau kelebihan pembayaran.

## 9. Penyimpanan dan Kebutuhan Nonfungsional

- Seluruh data sesi diserialisasi sebagai **satu objek JSON** dalam **satu entri local storage**.
- JSON menyimpan harga lapangan, harga bola, status fitur jumlah bermain, serta daftar pemain dengan nama, jumlah bermain, jumlah bola, dan jumlah pembayaran. Data lama tanpa status fitur dianggap nonaktif. Total dihitung dari data tersebut.
- Data hanya tersedia pada peramban dan perangkat tempat data disimpan. Menghapus data peramban dapat menghapus data sesi.
- Antarmuka perlu dapat digunakan di perangkat seluler dan desktop.
- Berbagi laporan memerlukan akses ke WhatsApp dan koneksi yang sesuai; aplikasi tidak otomatis mengirim pesan tanpa tindakan pengguna.
- Performa, aksesibilitas, dan kompatibilitas peramban perlu dipenuhi, dengan kriteria terukur yang ditentukan lebih lanjut.

### Contoh objek JSON

Berikut gambaran satu sesi yang disimpan sebagai nilai satu entri local storage:

```json
{
  "courtPrice": 0,
  "shuttlecockPrice": 5000,
  "gamesPlayedEnabled": true,
  "players": [
    {
      "id": "pemain-1",
      "name": "Andi",
      "gamesPlayed": 3,
      "shuttlecocksUsed": 2,
      "amountPaid": 15000
    },
    {
      "id": "pemain-2",
      "name": "Budi",
      "gamesPlayed": 2,
      "shuttlecocksUsed": 3,
      "amountPaid": 5000
    }
  ]
}
```

- `courtPrice` dan `shuttlecockPrice` adalah harga dalam rupiah tanpa desimal.
- `gamesPlayedEnabled` menentukan apakah jumlah bermain ditampilkan di kartu dan laporan.
- `id` membedakan setiap pemain, termasuk pemain dengan nama yang sama.
- `gamesPlayed` dan `shuttlecocksUsed` adalah jumlah dalam bilangan bulat; `amountPaid` adalah nominal yang telah dibayar dalam rupiah.
- Total tidak disimpan dalam JSON, tetapi dihitung ulang dari harga dan data pemain. Pada contoh di atas, biaya Andi Rp10.000 dan Budi Rp15.000; total biaya Rp25.000, total bayar Rp20.000, dan sisa bayar Rp5.000.
- Setelah reset yang dikonfirmasi, `players` menjadi daftar kosong, sedangkan harga dan `gamesPlayedEnabled` tetap dipertahankan.

## 10. Kriteria Keberhasilan

- Pengguna dapat menyelesaikan alur pencatatan dari pengaturan hingga laporan tanpa berpindah halaman aplikasi.
- Hasil perhitungan pemain dan ringkasan sesuai rumus pada bagian 7, termasuk saat terjadi kelebihan pembayaran.
- Data yang berhasil disimpan dapat dipulihkan setelah halaman dimuat ulang.
- Laporan WhatsApp memuat detail pemain dan ringkasan sesi; jumlah bermain hanya disertakan jika fitur aktif.
- Saat harga lapangan 0, inputnya tetap dapat diakses di Setting, tetapi harga tersebut tidak ditampilkan di bagian halaman lainnya maupun laporan WhatsApp.

## 11. Asumsi, Ketergantungan, dan Risiko

- **Asumsi:** Satu aplikasi digunakan untuk mencatat satu sesi aktif; nominal transaksi menggunakan rupiah tanpa desimal.
- **Ketergantungan:** Local storage peramban untuk penyimpanan dan WhatsApp untuk berbagi laporan.
- **Risiko dan mitigasi:** Data sesi dapat hilang jika data peramban dihapus atau pengguna berpindah perangkat. Tampilkan batasan penyimpanan lokal dengan jelas dan sediakan laporan WhatsApp untuk membagikan rekap.

## 12. Rencana Rilis

Tahapan pengembangan, peluncuran, dan evaluasi belum ditentukan.

## 13. Pertanyaan Terbuka

- Apa nama aplikasi yang akan ditampilkan di header?
- Apakah jumlah pemain dan jumlah bola di ringkasan harus mencerminkan total seluruh pemain, atau jumlah pemain dan bola yang aktif/tercatat dengan definisi lain?
- Apa format laporan WhatsApp yang diinginkan selain rincian dan ringkasan yang ditetapkan pada dokumen ini?
- Apa target performa, aksesibilitas, dan kompatibilitas peramban yang perlu dipenuhi?
- Bagaimana keberhasilan produk akan diukur secara kuantitatif?
- Apakah ada batasan teknis atau jadwal rilis yang perlu dipertimbangkan?

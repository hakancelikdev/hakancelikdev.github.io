---
publishDate: 2026-11-25T18:00:00Z
author: Hakan Çelik
translationKey: vakit-intro
title: 'Vakit: Aplikasi Jadwal Sholat Gratis Tanpa Iklan — Mengapa Saya Membuatnya dan Apa Isinya'
excerpt: "Jadwal sholat, adzan, kiblat, dan Al-Qur'an — tanpa iklan, tanpa dinding berbayar, tanpa akun, dan bisa dipakai offline. Mengapa saya membuat Vakit, apa bedanya dengan aplikasi sholat lain, dan apa saja yang bisa dilakukannya."
category: Vakit
image: ~/assets/images/blog/vakit-intro-id.jpg
tags:
  - vakit
  - jadwal-sholat
  - ios
  - android
  - privasi
---

Vakit adalah aplikasi yang saya buat untuk jadwal sholat dan adzan — lengkap dengan Al-Qur'an, kiblat, zikir, dan kalender yang tak lupa akan hari-hari mulia. Aplikasi ini berjalan di iPhone, iPad, Apple Watch, Mac, dan Android; **gratis, tanpa iklan, tanpa akun, dan jadwal sholatnya bisa dipakai offline.** Di App Store, Vakit mendapat rating 4,8 dari 641 rating.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Dapatkan Vakit secara gratis — tanpa iklan, tanpa akun.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-id-top">App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-id-top">Google Play</a>
</div>

## Mengapa satu aplikasi sholat lagi?

Aplikasi sholat jumlahnya ratusan. Tetapi di hampir semuanya, saya terus menemui masalah yang sama:

- **Iklan.** Iklan judi dan iklan yang tidak pantas bisa muncul tepat di samping konten agama. Menutup cuplikan gim saat sedang mengecek waktu adzan sungguh bertentangan dengan suasana ibadah.
- **Dinding berbayar.** Fitur-fitur dasar disembunyikan di balik langganan "premium". Ibadah adalah hak semua orang; kompas kiblat atau terjemahan Al-Qur'an tidak semestinya berbayar.
- **Harus ada internet.** Kalau jadwal diambil dari server, aplikasinya tidak berguna di pesawat, di luar negeri, atau di mana pun sinyalnya lemah.
- **Privasi.** Pada tahun 2020, laporan menunjukkan bahwa data lokasi dari sebuah aplikasi sholat dengan jutaan pengguna sampai ke perusahaan-perusahaan yang bekerja sama dengan militer AS melalui seorang pialang data ([Al Jazeera](https://www.aljazeera.com/news/2020/11/17/report-us-military-buying-location-data-on-popular-muslim-apps)). Aplikasi itu membantah tuduhan tersebut, tetapi mengakhiri kemitraan datanya. Di mana seseorang berada saat ia sholat tidak boleh menjadi barang dagangan.

Vakit adalah jawaban saya atas keempat masalah itu.

## Sepuluh prinsip: aplikasi ibadah seharusnya seperti apa?

Setiap keputusan di Vakit berpijak pada sepuluh prinsip. Prinsip-prinsip itu ada di dalam aplikasi dan di situs sebagai [Manifesto Vakit](https://vakit.hakancelik.dev/id/manifesto.html):

1. **Harus bisa dipakai tanpa internet.** Jadwal sholat, kiblat, dan zikir sepenuhnya bekerja offline; Al-Qur'an dan hadis setelah diunduh sekali.
2. **Tidak boleh ada iklan.** Ibadah butuh ketenangan. Aplikasi ini sepenuhnya bebas iklan.
3. **Tidak ada fitur yang dikunci di balik pembayaran.** Tidak ada fitur terkunci, tidak ada tingkatan istimewa, tidak ada masa uji coba.
4. **Semua orang harus bisa memakainya.** Pembaca layar, huruf besar, kontras tinggi, konten yang bisa didengarkan.
5. **Harus akurat.** Waktu sholat tidak bisa "kira-kira". Metode Diyanet, Umm Al-Qura, Singapura, dan Moonsighting diverifikasi dengan kalender yang diterbitkan oleh lembaga-lembaga di baliknya.
6. **Harus bisa dipakai di mana saja di dunia.** Di ujung utara tempat matahari tidak terbenam berhari-hari, di khatulistiwa, dalam perjalanan.
7. **Tidak menanyakan siapa Anda.** Tanpa akun; nama, email, dan nomor telepon Anda tidak pernah ditanyakan.
8. **Tidak membuat kewalahan.** Tidak ada banjir notifikasi, tidak ada tekanan runtun, tidak ada perlombaan lencana.
9. **Harus berbicara dalam bahasa semua orang.** 25 bahasa, termasuk bahasa yang ditulis dari kanan ke kiri.
10. **Harus berdiri di atas dukungan penggunanya.** Besar atau kecil, sumbangan setiap orang menjaganya tetap berjalan.

## Apa saja isinya

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/prayer-times.webp" alt="Layar jadwal sholat Vakit" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Jadwal sholat</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/widget.webp" alt="Layar Terkunci dan widget" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Layar Terkunci, widget</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/qibla.webp" alt="Kompas kiblat" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Kompas kiblat</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/quran.webp" alt="Al-Qur'an" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Al-Qur'an</figcaption></figure>
</div>

### Jadwal sholat dan adzan

- **12 metode perhitungan**, mengikuti zona waktu, mendeteksi perjalanan. Jadwal tidak dicari di server; ponsel Anda sendiri yang menghitungnya dengan metode pilihan Anda.
- **Suara adzan:** setiap waktu sholat dikumandangkan dalam maqamnya sendiri — Subuh dengan saba, Dzuhur dengan ussak, Ashar dengan rast, Maghrib dengan segah, Isya dengan hicaz. Rekamannya sudah ada di dalam aplikasi, jadi tetap bisa diputar offline.
- **Alarm Sebelum Waktunya Habis:** berbunyi sebelum waktu sebuah sholat habis jika Anda belum mengerjakannya, dan diam jika sudah. Di iOS 26, ini alarm sungguhan yang menembus mode senyap.
- **Layar Terkunci:** Aktivitas Langsung, Dynamic Island, StandBy, dan 26 widget. Sholat berikutnya terlihat sekilas, tanpa membuka kunci.
- **Waktu makruh dan waktu sholat sunah**, opsional — termasuk Isyraq, Duha, dan Awwabin.

### Al-Qur'an, hadis, dan perpustakaan

- Seluruh 114 surah, analisis kata per kata, **72 terjemahan dalam 24 bahasa dan 51 tafsir dalam 20 bahasa**; masing-masing Anda pilih berdasarkan nama penerjemah atau penulisnya.
- Mushaf dengan rasm Madinah atau Turki, dengan warna Tajwid opsional.
- Murottal yang bisa diunduh dan **terjemahan bersuara** — Suara Vakit yang alami untuk 13 terjemahan bahasa Turki. (Bagaimana suara-suara itu dibuat, saya ceritakan [dalam tulisan terpisah](/en/building-a-volunteer-ai-voice-farm-for-audio-quran-translations), dalam bahasa Inggris.)
- **Lebih dari 36.000 hadis** dari tujuh kitab besar, dengan teks asli bahasa Arab dan terjemahan dalam 16 bahasa.
- Perpustakaan berisi lebih dari 180 karya.

<div class="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/discover.webp" alt="Semua alat dalam satu tempat" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Semua alat</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/profile.webp" alt="Cincin ibadah" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Cincin ibadah</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/qada.webp" alt="Catatan kada" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Catatan kada</figcaption></figure>
  <figure><img class="rounded-2xl shadow-lg" src="/images/posts/vakit/id/calendar.webp" alt="Kalender Hijriah" width="390" height="844" loading="lazy"><figcaption class="text-sm mt-2 text-center">Kalender</figcaption></figure>
</div>

### Catatan ibadah, Ramadhan, dan panduan

- **Cincin ibadah:** sholat, Al-Qur'an, zikir, hadis, dan kada. Keistiqamahan ditampilkan dengan lembut — tanpa rasa bersalah.
- **Catatan kada:** sholat yang tertinggal per waktu, puasa yang tertinggal per hari; utangnya berkurang seiring Anda menggantinya, dan Anda bisa melihat kapan semuanya akan lunas.
- **Ramadhan:** imsakiyah sebulan penuh, alarm sahur (di bulan Ramadhan, setiap hari, atau di hari-hari puasa sunah), dan catatan puasa.
- **Kalender:** Hijriah dan Masehi berdampingan, dengan malam-malam mulia, hari raya, dan pengingat.
- **Panduan:** 17 jenis sholat, bergambar; wudu, mandi wajib, dan tayamum; panduan Jumat; kalkulator zakat dan fitrah.

### Di setiap perangkat, dalam setiap bahasa

- **iPhone, iPad, Apple Watch, Mac, dan Android.** Kiblat langsung dan 14 komplikasi di Apple Watch; hitung mundur di bilah menu Mac. Catatan Anda tetap sama di semua perangkat Apple Anda lewat iCloud.
- **25 bahasa**; dalam bahasa Arab, Urdu, Persia, dan Uighur, seluruh antarmuka berjalan dari kanan ke kiri.

## Aplikasi lain dan Vakit

|                | Kebanyakan aplikasi sholat                               | Vakit                                                                          |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Iklan          | Iklan judi dan iklan tak pantas di samping konten agama  | Sepenuhnya bebas iklan; yang opsional pun tidak ada                            |
| Biaya          | Dinding berbayar, langganan, tingkatan "premium"         | Gratis; tanpa tingkatan, tanpa bujukan upgrade                                 |
| Internet       | Fitur dasar butuh koneksi                                | Jadwal sholat, notifikasi, kiblat, dan zikir offline sejak pertama kali dibuka |
| Layar Terkunci | Widget rusak setiap kali iOS diperbarui                  | Aktivitas Langsung, Dynamic Island, StandBy                                    |
| Akurasi        | Meleset saat pergantian jam musim panas, metode terbatas | 12 metode, mengikuti zona waktu, mendeteksi perjalanan                         |
| Perangkat      | Hanya ponsel                                             | iPhone, iPad, Apple Watch, Mac, Android                                        |

## Data Anda adalah amanah

- **Koordinat Anda tidak pernah sampai ke server saya.** Yang sampai hanya negara, provinsi, dan kecamatan. Untuk alamat Anda dan masjid terdekat, lokasi hanya dikirim ke Apple Maps.
- **Jadwal sholat dihitung di ponsel Anda**, bukan dicari di server.
- **Catatan Anda** — catatan kada, khatam, penanda, masjid favorit — tetap di perangkat Anda dan di ruang iCloud Anda sendiri.
- Data penggunaan yang memang sampai ke server terikat pada kode samaran tanpa nama, email, atau nomor telepon. Apa saja yang dikirim tercantum satu per satu di [kebijakan privasi](https://vakit.hakancelik.dev/id/privacy.html) — dan supaya jelas: nama samaran, bukan anonim.

## Bagaimana Vakit tetap gratis?

Seluruh aplikasi gratis: tanpa dinding berbayar, tanpa "premium", tanpa fitur yang dikunci. Siapa pun yang ingin mendukungnya bisa berdonasi sekali atau bulanan; donasi tidak membuka apa pun — karena memang tidak ada yang dikunci. Yang menjaga Vakit tetap berjalan adalah dukungan orang-orang yang memakainya.

## Jadwal sholat untuk kota Anda

Jadwal sholat hari ini, **imsakiyah Ramadhan 2027**, dan arah kiblat untuk 33 kota — dari London hingga Mekah, dari Berlin hingga Kuala Lumpur — saya kumpulkan di halaman [jadwal sholat per kota](https://vakit.hakancelik.dev/id/jadwal-sholat/). Berapa jam puasa Ramadhan 2027 di setiap kota itu, dari Subuh hingga Maghrib, bisa Anda lihat di [Ramadhan 2027: lama puasa](https://vakit.hakancelik.dev/id/jadwal-sholat/ramadhan-2027-lama-puasa.html). Aplikasinya menghitung semua ini di mana pun di dunia, untuk tempat Anda berada, secara offline.

---

Saya berusaha menjadikan Vakit sebagaimana mestinya sebuah aplikasi ibadah. Kalau Anda mencobanya, bantuan terbesar adalah memberi tahu saya apa yang masih kurang lewat fitur masukan di dalam aplikasi.

<div class="not-prose my-8 rounded-2xl bg-gray-100 dark:bg-stone-800 p-6 flex flex-col sm:flex-row gap-3 sm:items-center">
  <p class="flex-1 font-semibold">Gratis. Tanpa iklan. Tanpa akun. Jadwal sholat bisa offline.</p>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://apps.apple.com/app/id6748356813?pt=127947182&ct=blog-vakit-id-bottom">Unduh di App Store</a>
  <a class="inline-block rounded-full bg-primary text-white px-5 py-2 font-semibold text-center" href="https://play.google.com/store/apps/details?id=com.hakancelikdev.vakit&referrer=utm_source%3Dvakit-site%26utm_medium%3Dweb%26utm_campaign%3Dblog-vakit-id-bottom">Unduh di Google Play</a>
</div>

Selengkapnya: [vakit.hakancelik.dev](https://vakit.hakancelik.dev/id/)

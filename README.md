# VIAN Weather - Weather Dashboard Application

Aplikasi web cuaca interaktif yang menampilkan informasi cuaca real-time dengan desain glassmorphism yang modern dan elegan.

## 📸 Screenshot

### Light Mode
<img width="1906" height="918" alt="Screenshot 2025-12-01 204554" src="https://github.com/user-attachments/assets/8df5363e-237c-4af2-8b24-3ba9b78b9b23" />

### Dark Mode
<img width="1909" height="914" alt="Screenshot 2025-12-01 204605" src="https://github.com/user-attachments/assets/b1a88c8d-4dd7-485b-8978-08f3cc0eed58" />

### Search Feature
<img width="1919" height="920" alt="Screenshot 2025-12-01 204638" src="https://github.com/user-attachments/assets/4c612995-7fcd-41a8-bf8a-123a224c693d" />

### 5-Day Forecast
<img width="1919" height="917" alt="Screenshot 2025-12-01 204814" src="https://github.com/user-attachments/assets/5716f6c6-52cc-4c75-8406-8a3f4f65c0a5" />

### Keterangan Sedang Memuat
<img width="1911" height="918" alt="Screenshot 2025-12-01 204855" src="https://github.com/user-attachments/assets/ea243e5a-7cec-484c-8df5-b6bcb5e78c4f" />


## ✨ Fitur Utama

### 1. **Informasi Cuaca Real-Time**
- Menampilkan suhu, kelembaban, kecepatan angin, dan kondisi cuaca terkini
- Data diambil dari Open-Meteo API (gratis, tanpa API key)
- Update otomatis setiap kali refresh atau pencarian kota baru

### 2. **Pencarian Kota dengan Autocomplete**
- Search bar dengan fitur autocomplete cerdas
- Mendukung pencarian kota-kota besar di seluruh dunia
- Khusus untuk Indonesia: mendukung pencarian dengan nama provinsi (contoh: "Aceh" → Banda Aceh, "Papua" → Jayapura)
- Menampilkan hingga 8 hasil pencarian yang relevan

### 3. **Ramalan 5 Hari**
- Prediksi cuaca untuk 5 hari ke depan
- Menampilkan suhu maksimal dan minimal harian
- Icon cuaca yang sesuai dengan kondisi
- Layout grid 5 kolom untuk tampilan yang rapi

### 4. **Ramalan Per Jam**
- Prediksi cuaca detail setiap jam untuk hari ini
- Menampilkan 8 jam ke depan
- Informasi suhu dan kondisi cuaca untuk setiap jam

### 5. **Daftar Favorit**
- Simpan hingga 10 kota favorit
- Akses cepat ke kota-kota yang sering dicek
- Data tersimpan secara lokal menggunakan localStorage
- Tombol hapus untuk mengelola daftar favorit

### 6. **Theme Switcher (Light/Dark Mode)**
- Toggle mudah antara mode terang dan gelap
- Background image berbeda untuk setiap tema:
  - Light mode: Background pantai cerah
  - Dark mode: Background malam yang tenang
- Warna dan kontras otomatis menyesuaikan dengan tema
- Preferensi tema tersimpan di browser

### 7. **Unit Converter (°C / °F)**
- Konversi suhu antara Celsius dan Fahrenheit
- Satu klik untuk mengubah semua tampilan suhu
- Preferensi unit tersimpan otomatis

### 8. **Glassmorphism Design**
- Efek transparan dengan blur backdrop
- Kartu-kartu dengan saturasi warna tinggi
- Border subtle dan shadow untuk kedalaman visual
- Responsif dan modern

### 9. **Caching System**
- Data cuaca di-cache selama 24 jam
- Mengurangi jumlah API calls
- Loading lebih cepat untuk kota yang sudah pernah dicari
- Cache otomatis dibersihkan setelah expired

### 10. **Responsive Layout**
- Layout 2 kolom (60% - 40%) untuk desktop
- Otomatis menjadi 1 kolom untuk mobile
- Grid forecast menyesuaikan jumlah kolom berdasarkan lebar layar
- Optimized untuk semua ukuran device

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5**: Semantic markup untuk struktur yang jelas
- **CSS3**: 
  - CSS Variables untuk theme system
  - Flexbox untuk layout 2 kolom
  - CSS Grid untuk forecast cards
  - Backdrop-filter untuk glassmorphism effect
  - Media queries untuk responsive design
- **JavaScript ES6+**:
  - Async/await untuk API calls
  - Fetch API untuk HTTP requests
  - Arrow functions dan template literals
  - DOM manipulation
  - Event handling

### API & Data
- **Open-Meteo API**: Weather data provider (gratis, tanpa API key)
  - Geocoding API untuk pencarian kota
  - Forecast API untuk data cuaca
  - Hourly API untuk prediksi per jam
- **localStorage**: Penyimpanan data lokal untuk:
  - Theme preference
  - Temperature unit preference
  - Favorite cities (max 10)
  - Weather data cache (24h expiry)
  - Last searched city

### Design System
- **CSS Variables**: Manajemen warna dan tema terpusat
- **Glassmorphism**: 
  - `backdrop-filter: blur(20px) saturate(180%)`
  - Background opacity 0.35-0.95 tergantung elemen
  - Border subtle dengan rgba transparency
- **Color Scheme**:
  - Light mode: Teks gelap (#0d1117) pada background terang
  - Dark mode: Teks terang (#f8fafc) pada background gelap
  - Temperature colors: Merah untuk max, biru untuk min (kontras berbeda per tema)

## 📋 Compliance Modul 6

Proyek ini **100% sesuai dengan materi Modul 6 Praktikum Pemrograman Web**:

✅ **Fetch API** - Penggunaan `fetch()` dengan async/await untuk mengambil data dari API  
✅ **localStorage** - Penyimpanan data preferensi dan cache di browser  
✅ **CSS Flexbox** - Layout 2 kolom responsif  
✅ **CSS Grid** - Grid untuk forecast cards  
✅ **CSS Variables** - Theme switching dan manajemen warna  
✅ **DOM Manipulation** - Update konten dinamis dengan JavaScript  
✅ **Event Handling** - Click, input, dan keyboard events  

## 🚀 Cara Menggunakan

1. **Clone atau Download Repository**
   ```bash
   git clone https://github.com/Vian-98/WeatherWEB.git
   ```

2. **Buka File HTML**
   - Tidak perlu instalasi atau server
   - Cukup buka file `index.html` di browser
   - Support browser modern (Chrome, Firefox, Edge, Safari)

3. **Mulai Menggunakan**
   - Ketik nama kota di search bar
   - Pilih dari hasil autocomplete
   - Lihat cuaca real-time dan forecast
   - Toggle theme sesuai preferensi
   - Simpan kota favorit untuk akses cepat

## 📁 Struktur File

```
judul 6/
├── index.html              # Struktur HTML utama
├── styles.css              # Styling dan theme system (960 lines)
├── script.js               # Logic aplikasi dan API calls (661 lines)
├── 20251115_142815.jpg     # Background image untuk light mode
├── 20251115231535019.jpg   # Background image untuk dark mode
├── Gambar Hasil            # Folder screenshot untuk dokumentasi
└── README.md               # File dokumentasi ini
```

## 👨‍💻 Developer

**VIAN Weather** - Tugas Akhir PPW Judul 6

Developed by: **Vian**  
Repository: [WeatherWEB](https://github.com/Vian-98/WeatherWEB)

---

© 2025 VIAN Weather - Tugas Akhir PPW Judul 6

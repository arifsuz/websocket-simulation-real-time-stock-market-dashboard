# websocket-real-time-stock-market-dashboard

Proyek ini adalah dashboard pasar saham real-time berbasis WebSocket. Repository ini terdiri dari dua bagian utama:

- `client` untuk tampilan dashboard dengan React + Vite.
- `server` untuk simulasi data pasar dan penyedia feed WebSocket.

## Ringkasan

Aplikasi menampilkan:

- daftar saham yang terus diperbarui,
- chart harga real-time per simbol,
- order book bid dan ask,
- status koneksi WebSocket secara langsung.

Server mengirim snapshot awal saat client tersambung, lalu membroadcast pembaruan harga setiap `800ms`. Client juga dapat meminta order book untuk simbol tertentu saat user berpindah ticker.

## Fitur Utama

- Update harga saham real-time melalui WebSocket.
- Chart harga historis untuk simbol aktif.
- Order book simulasi untuk bid dan ask.
- Auto reconnect ketika koneksi WebSocket terputus.
- Struktur modular antara client dan server.

## Teknologi

- React 19
- Vite
- Recharts
- Node.js
- ws

## Struktur Proyek

```text
websocket-real-time-stock-market-dashboard/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── OrderBook.jsx
│   │   │   └── PriceChart.jsx
│   │   └── hooks/
│   │       └── useWebSocket.js
│   └── README.md
├── server/
│   ├── index.js
│   └── README.md
└── README.md
```

## Prasyarat

- Node.js 18 atau lebih baru.
- npm.

## Instalasi

Clone atau buka repository ini, lalu install dependensi pada masing-masing folder:

```bash
cd client
npm install

cd ../server
npm install
```

## Menjalankan Aplikasi

Jalankan server terlebih dahulu, lalu client.

### 1. Jalankan Server

```bash
cd server
node index.js
```

Server akan berjalan di:

```text
ws://localhost:8080
```

### 2. Jalankan Client

```bash
cd client
npm run dev
```

Secara default Vite akan menampilkan URL lokal di terminal, biasanya:

```text
http://localhost:5173
```

## Skrip Tersedia

### Client

Jalankan dari folder `client`.

- `npm run dev` - menjalankan mode development.
- `npm run build` - membuat build produksi.
- `npm run preview` - melihat hasil build secara lokal.
- `npm run lint` - menjalankan ESLint.

### Server

Jalankan dari folder `server`.

- `node index.js` - menjalankan WebSocket server.

## Arsitektur Sistem

### Client

Client React memiliki tanggung jawab berikut:

- membuka koneksi ke WebSocket server,
- menerima snapshot dan update pasar,
- menyimpan history harga per simbol,
- menampilkan chart dan order book,
- meminta order book baru saat user memilih simbol.

### Server

Server Node.js bertanggung jawab untuk:

- menyimpan data saham simulasi,
- mengubah harga secara berkala,
- membroadcast update ke semua client yang terhubung,
- melayani request order book berdasarkan simbol.

## Alur Data

1. Client membuka koneksi ke `ws://localhost:8080`.
2. Server mengirim `INITIAL_SNAPSHOT`.
3. Server membroadcast `MARKET_UPDATE` setiap `800ms`.
4. Client menyimpan data harga ke history chart.
5. Saat user memilih simbol, client mengirim `REQUEST_ORDERBOOK`.
6. Server merespons dengan `ORDERBOOK_UPDATE` jika simbol valid.

## Format Pesan WebSocket

### `INITIAL_SNAPSHOT`

Payload awal untuk client baru.

```json
{
	"type": "INITIAL_SNAPSHOT",
	"stocks": {
		"AAPL": { "price": 189.5, "change": 0 }
	},
	"orderBook": {
		"symbol": "AAPL",
		"bids": [],
		"asks": []
	}
}
```

### `MARKET_UPDATE`

Update pasar yang dibroadcast berkala.

```json
{
	"type": "MARKET_UPDATE",
	"timestamp": 1710000000000,
	"stocks": {
		"AAPL": { "price": 190.12, "change": 0.321 }
	},
	"orderBook": {
		"symbol": "AAPL",
		"bids": [],
		"asks": []
	}
}
```

### `REQUEST_ORDERBOOK`

Request dari client untuk meminta order book simbol tertentu.

```json
{
	"type": "REQUEST_ORDERBOOK",
	"symbol": "TSLA"
}
```

### `ORDERBOOK_UPDATE`

Respons server untuk request order book valid.

```json
{
	"type": "ORDERBOOK_UPDATE",
	"symbol": "TSLA",
	"bids": [],
	"asks": []
}
```

## Konfigurasi Penting

- URL WebSocket client diatur di `client/src/App.jsx` melalui hook `useWebSocket("ws://localhost:8080")`.
- Jika port server berubah, URL tersebut harus disesuaikan.
- Server saat ini menggunakan data simulasi, bukan data market live.

## Catatan Implementasi

- Chart harga menampilkan hingga 60 titik terakhir per simbol.
- Warna hijau menandakan kenaikan harga.
- Warna merah menandakan penurunan harga.
- Order book disimulasikan dengan 8 level bid dan 8 level ask.
- Client memiliki auto reconnect ketika koneksi tertutup.

## Troubleshooting

### Client tidak terhubung ke server

- Pastikan server sudah berjalan di `ws://localhost:8080`.
- Pastikan tidak ada proses lain yang memakai port `8080`.
- Periksa URL WebSocket di client jika port berubah.

### Data tidak muncul di dashboard

- Pastikan pesan dari server berformat JSON valid.
- Pastikan browser tidak memblokir koneksi WebSocket.
- Refresh halaman setelah server aktif jika diperlukan.

### Order book tidak berubah saat ganti simbol

- Pastikan client mengirim `REQUEST_ORDERBOOK` saat ticker dipilih.
- Pastikan simbol yang diminta ada di daftar saham server.

## Dokumentasi Terkait

- [Dokumentasi client](client/README.md)
- [Dokumentasi server](server/README.md)

## Pengembangan Lanjutan

Beberapa arah pengembangan yang masuk akal:

- mengganti data simulasi dengan feed market asli,
- menambah chart multi-timeframe,
- menambahkan filter dan pencarian simbol,
- menambah auth atau pembatasan koneksi WebSocket,
- menambah test dan observability untuk server.

## [License](LICENSE)

MIT License <br> Copyright (c) 2026 Muhamad Nur Arif (ArifTSX)


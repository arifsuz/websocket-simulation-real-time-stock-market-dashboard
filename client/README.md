# websocket-real-time-stock-market-dashboard

Client untuk dashboard pasar saham real-time berbasis React + Vite. Aplikasi ini menampilkan pergerakan harga saham, chart harga, dan order book yang diperbarui lewat WebSocket.

## Fitur

- Status koneksi WebSocket langsung di header.
- Ticker strip untuk melihat daftar saham dan memilih simbol aktif.
- Chart harga real-time menggunakan Recharts.
- Order book untuk bid dan ask dari simbol yang dipilih.
- Auto reconnect jika koneksi websocket terputus.

## Struktur Client

- `src/App.jsx` - komponen utama dashboard dan pengelola state aplikasi.
- `src/hooks/useWebSocket.js` - hook untuk koneksi, receive message, dan auto reconnect.
- `src/components/PriceChart.jsx` - visualisasi grafik harga.
- `src/components/OrderBook.jsx` - tampilan order book bid/ask.
- `src/index.css` - styling utama aplikasi.

## Prasyarat

- Node.js 18 atau lebih baru.
- Backend WebSocket yang berjalan di `ws://localhost:8080`.

## Instalasi

Jalankan perintah berikut dari folder `client`:

```bash
npm install
```

## Menjalankan Aplikasi

Mode development:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Lint source code:

```bash
npm run lint
```

## Cara Kerja Data

Client membuka koneksi ke WebSocket server dan menunggu payload bertipe:

- `INITIAL_SNAPSHOT` - snapshot awal data pasar.
- `MARKET_UPDATE` - pembaruan harga dan perubahan pasar.

Jika respons memiliki `orderBook`, data tersebut dipakai untuk mengisi bid dan ask pada simbol aktif. Saat user memilih ticker lain, client mengirim pesan:

```json
{
	"type": "REQUEST_ORDERBOOK",
	"symbol": "AAPL"
}
```

## Catatan Tampilan

- Warna hijau menandakan pergerakan harga naik.
- Warna merah menandakan pergerakan harga turun.
- Chart menampilkan riwayat harga hingga 60 titik terakhir per simbol.

## Dependensi Utama

- React 19
- Recharts
- Vite

## Lisensi

Proyek ini belum memiliki informasi lisensi khusus.

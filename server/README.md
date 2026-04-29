# websocket-real-time-stock-market-dashboard - Server

Server WebSocket untuk mensimulasikan data pasar saham real-time. Server ini mengirim snapshot awal ke client, lalu membroadcast pembaruan harga secara berkala dan merespons permintaan order book untuk simbol tertentu.

## Fitur

- WebSocket server di `ws://localhost:8080`.
- Kirim snapshot awal saat client terhubung.
- Broadcast update pasar setiap `800ms`.
- Generate order book palsu untuk simbol saham.
- Mendukung request order book per simbol dari client.

## Teknologi

- Node.js
- `ws` sebagai library WebSocket server

## Prasyarat

- Node.js 18 atau lebih baru.

## Instalasi

Jalankan perintah berikut dari folder `server`:

```bash
npm install
```

## Menjalankan Server

Server saat ini dijalankan langsung dengan Node:

```bash
node index.js
```

Saat aktif, server akan menampilkan log bahwa WebSocket berjalan di `ws://localhost:8080`.

## Struktur Data

### Data awal saham

Server menginisialisasi beberapa simbol berikut:

- `AAPL`
- `GOOGL`
- `TSLA`
- `MSFT`
- `NVDA`

Setiap simbol memiliki properti:

- `price` - harga terakhir.
- `change` - persentase perubahan terhadap tick sebelumnya.

### Simulasi harga

Setiap `800ms`, server akan:

1. Mengubah harga setiap saham secara acak dengan sedikit bias naik.
2. Menghitung persentase perubahan harga.
3. Mengirim payload `MARKET_UPDATE` ke semua client.

### Order book

Order book dibuat secara simulasi dari harga dasar simbol aktif. Server mengirim:

- `bids` - daftar harga beli.
- `asks` - daftar harga jual.

Setiap sisi berisi 8 level harga.

## Event WebSocket

### `INITIAL_SNAPSHOT`

Dikirim sekali ke client baru setelah koneksi berhasil.

Contoh payload:

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

Broadcast ke semua client setiap `800ms`.

Contoh payload:

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

Client dapat meminta order book untuk simbol tertentu.

Contoh pesan dari client:

```json
{
	"type": "REQUEST_ORDERBOOK",
	"symbol": "TSLA"
}
```

Jika simbol valid, server akan membalas dengan `ORDERBOOK_UPDATE`.

Contoh balasan:

```json
{
	"type": "ORDERBOOK_UPDATE",
	"symbol": "TSLA",
	"bids": [],
	"asks": []
}
```

## Integrasi dengan Client

Client React pada proyek ini terhubung ke server melalui `ws://localhost:8080`. Saat user memilih ticker, client mengirim `REQUEST_ORDERBOOK` untuk simbol aktif, lalu menampilkan chart dan order book dari data yang diterima.

## Catatan Pengembangan

- Server ini adalah simulator, bukan koneksi ke market data sungguhan.
- Data harga dan order book dihasilkan secara acak untuk kebutuhan demo UI.
- Jika ingin mengganti endpoint WebSocket, sesuaikan URL di hook client `useWebSocket`.

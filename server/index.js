const WebSocket = require("ws");

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

// --- Data saham awal ---
const stocks = {
  AAPL: { price: 189.5, change: 0 },
  GOOGL: { price: 175.2, change: 0 },
  TSLA: { price: 248.0, change: 0 },
  MSFT: { price: 415.3, change: 0 },
  NVDA: { price: 875.6, change: 0 },
};

// Simulasi fluktuasi harga (±0.5% tiap tick)
function simulatePrices() {
  for (const symbol in stocks) {
    const stock = stocks[symbol];
    const fluctuation = (Math.random() - 0.49) * 0.005; // sedikit bias naik
    const newPrice = parseFloat((stock.price * (1 + fluctuation)).toFixed(2));
    stock.change = parseFloat(((newPrice - stock.price) / stock.price * 100).toFixed(3));
    stock.price = newPrice;
  }
}

// Generate order book palsu
function generateOrderBook(basePrice) {
  const bids = [], asks = [];
  for (let i = 0; i < 8; i++) {
    bids.push({
      price: parseFloat((basePrice - (i + 1) * 0.05).toFixed(2)),
      volume: Math.floor(Math.random() * 500) + 50,
    });
    asks.push({
      price: parseFloat((basePrice + (i + 1) * 0.05).toFixed(2)),
      volume: Math.floor(Math.random() * 500) + 50,
    });
  }
  return { bids, asks };
}

// Broadcast ke semua client yang terhubung
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Kirim update setiap 800ms
setInterval(() => {
  simulatePrices();
  const payload = {
    type: "MARKET_UPDATE",
    timestamp: Date.now(),
    stocks: { ...stocks },
    orderBook: {
      symbol: "AAPL",
      ...generateOrderBook(stocks.AAPL.price),
    },
  };
  broadcast(payload);
}, 800);

// Handle koneksi baru
wss.on("connection", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[+] Client terhubung: ${clientIp} | Total: ${wss.clients.size}`);

  // Kirim snapshot awal langsung ke client baru
  ws.send(JSON.stringify({
    type: "INITIAL_SNAPSHOT",
    stocks: { ...stocks },
    orderBook: { symbol: "AAPL", ...generateOrderBook(stocks.AAPL.price) },
  }));

  // Handle pesan dari client
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`[MSG] dari client:`, data);

      // Contoh: client bisa request order book symbol tertentu
      if (data.type === "REQUEST_ORDERBOOK" && stocks[data.symbol]) {
        ws.send(JSON.stringify({
          type: "ORDERBOOK_UPDATE",
          symbol: data.symbol,
          ...generateOrderBook(stocks[data.symbol].price),
        }));
      }
    } catch (e) {
      console.error("Pesan tidak valid:", e.message);
    }
  });

  ws.on("close", () => {
    console.log(`[-] Client disconnect | Sisa: ${wss.clients.size}`);
  });

  ws.on("error", (err) => {
    console.error(`[ERR] WebSocket error:`, err.message);
  });
});

console.log(`🚀 WebSocket Server berjalan di ws://localhost:${PORT}`);
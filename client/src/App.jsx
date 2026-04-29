import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import PriceChart from "./components/PriceChart";
import OrderBook from "./components/OrderBook";

export default function App() {
  const { data, status, send } = useWebSocket("ws://localhost:8080");
  const [stocks, setStocks] = useState({});
  const [activeSym, setActiveSym] = useState("AAPL");
  const [priceHistory, setPriceHistory] = useState({});
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    if (!data) return;

    if (data.type === "INITIAL_SNAPSHOT" || data.type === "MARKET_UPDATE") {
      setStocks(data.stocks);

      // Simpan history harga untuk chart
      setPriceHistory((prev) => {
        const updated = { ...prev };
        Object.keys(data.stocks).forEach((sym) => {
          const arr = updated[sym] ? [...updated[sym]] : [];
          arr.push(data.stocks[sym].price);
          if (arr.length > 60) arr.shift(); // max 60 titik
          updated[sym] = arr;
        });
        return updated;
      });
    }

    if (data.orderBook) {
      setOrderBook(data.orderBook);
    }
  }, [data]);

  const handleSelectStock = (sym) => {
    setActiveSym(sym);
    // Kirim request ke server untuk order book symbol tersebut
    send({ type: "REQUEST_ORDERBOOK", symbol: sym });
  };

  return (
    <div className="dashboard">
      {/* Status Bar */}
      <div className="statusbar">
        <span>MarketWatch</span>
        <span className={`ws-status ${status}`}>
          {status === "OPEN" ? "● LIVE" : "● RECONNECTING"}
        </span>
      </div>

      {/* Ticker Strip */}
      <div className="ticker-strip">
        {Object.entries(stocks).map(([sym, stock]) => (
          <div
            key={sym}
            className={`ticker ${activeSym === sym ? "active" : ""}`}
            onClick={() => handleSelectStock(sym)}
          >
            <span className="sym">{sym}</span>
            <span className="price">${stock.price.toFixed(2)}</span>
            <span className={`change ${stock.change >= 0 ? "up" : "dn"}`}>
              {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(3)}%
            </span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-layout">
        <PriceChart
          symbol={activeSym}
          stock={stocks[activeSym]}
          history={priceHistory[activeSym] || []}
        />
        <OrderBook
          symbol={activeSym}
          bids={orderBook.bids}
          asks={orderBook.asks}
        />
      </div>
    </div>
  );
}
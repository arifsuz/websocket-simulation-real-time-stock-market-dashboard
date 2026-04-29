# websocket-real-time-stock-market-dashboard

Client for the real-time stock market dashboard built with React + Vite. The application displays stock price movements, a price chart, and an order book that is updated through WebSocket messages.

## Features

- Live WebSocket connection status in the header.
- Ticker strip for browsing stocks and selecting the active symbol.
- Real-time price chart powered by Recharts.
- Bid and ask order book for the selected symbol.
- Auto-reconnect when the WebSocket connection drops.

## Client Structure

- `src/App.jsx` - main dashboard component and application state manager.
- `src/hooks/useWebSocket.js` - hook for connection handling, message reception, and auto reconnect.
- `src/components/PriceChart.jsx` - price chart visualization.
- `src/components/OrderBook.jsx` - bid/ask order book view.
- `src/index.css` - main application styling.

## Requirements

- Node.js 18 or newer.
- A WebSocket backend running at `ws://localhost:8080`.

## Installation

Run the following command from the `client` folder:

```bash
npm install
```

## Running the Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint the source code:

```bash
npm run lint
```

## Data Flow

The client connects to the WebSocket server and waits for payloads of the following types:

- `INITIAL_SNAPSHOT` - initial market data snapshot.
- `MARKET_UPDATE` - market price and change updates.

If the response includes `orderBook`, that data is used to populate the bid and ask lists for the active symbol. When the user selects another ticker, the client sends:

```json
{
	"type": "REQUEST_ORDERBOOK",
	"symbol": "AAPL"
}
```

## Visual Notes

- Green indicates a price increase.
- Red indicates a price decrease.
- The chart shows up to 60 recent price points per symbol.

## Main Dependencies

- React 19
- Recharts
- Vite

## License

No project-specific license information is documented here.

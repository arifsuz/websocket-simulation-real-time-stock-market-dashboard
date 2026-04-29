# websocket-real-time-stock-market-dashboard

This project is a real-time stock market dashboard powered by WebSocket. The repository is split into two main parts:

- `client` for the dashboard UI built with React + Vite.
- `server` for simulated market data and the WebSocket feed.

## Overview

The application displays:

- a live-updating stock list,
- a real-time price chart per symbol,
- bid and ask order book data,
- live WebSocket connection status.

The server sends an initial snapshot when a client connects, then broadcasts price updates every `800ms`. The client can also request the order book for a specific symbol when the user changes the active ticker.

## Key Features

- Real-time stock price updates over WebSocket.
- Historical price chart for the active symbol.
- Simulated bid and ask order book data.
- Auto-reconnect when the WebSocket connection drops.
- Modular client and server structure.

## Technology Stack

- React 19
- Vite
- Recharts
- Node.js
- ws

## Project Structure

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

## Requirements

- Node.js 18 or newer.
- npm.

## Installation

Clone or open this repository, then install dependencies in each folder:

```bash
cd client
npm install

cd ../server
npm install
```

## Running the Application

Run the server first, then the client.

### 1. Start the Server

```bash
cd server
node index.js
```

The server will run at:

```text
ws://localhost:8080
```

### 2. Start the Client

```bash
cd client
npm run dev
```

By default, Vite will print a local URL in the terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

### Client

Run these from the `client` folder.

- `npm run dev` - start development mode.
- `npm run build` - create a production build.
- `npm run preview` - preview the production build locally.
- `npm run lint` - run ESLint.

### Server

Run this from the `server` folder.

- `node index.js` - start the WebSocket server.

## System Architecture

### Client

The React client is responsible for:

- opening a connection to the WebSocket server,
- receiving market snapshots and updates,
- storing price history per symbol,
- rendering the chart and order book,
- requesting a new order book when the user selects a symbol.

### Server

The Node.js server is responsible for:

- storing simulated stock data,
- updating prices on a fixed interval,
- broadcasting updates to all connected clients,
- serving order book requests by symbol.

## Data Flow

1. The client connects to `ws://localhost:8080`.
2. The server sends `INITIAL_SNAPSHOT`.
3. The server broadcasts `MARKET_UPDATE` every `800ms`.
4. The client stores price data in chart history.
5. When the user selects a symbol, the client sends `REQUEST_ORDERBOOK`.
6. The server responds with `ORDERBOOK_UPDATE` if the symbol is valid.

## WebSocket Message Format

### `INITIAL_SNAPSHOT`

Initial payload for a newly connected client.

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

Periodic market update broadcast.

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

Client request for a specific symbol order book.

```json
{
	"type": "REQUEST_ORDERBOOK",
	"symbol": "TSLA"
}
```

### `ORDERBOOK_UPDATE`

Server response for a valid order book request.

```json
{
	"type": "ORDERBOOK_UPDATE",
	"symbol": "TSLA",
	"bids": [],
	"asks": []
}
```

## Important Configuration

- The client WebSocket URL is defined in `client/src/App.jsx` through `useWebSocket("ws://localhost:8080")`.
- If the server port changes, update that URL accordingly.
- The current server uses simulated data instead of live market data.

## Implementation Notes

- The price chart keeps up to 60 recent points per symbol.
- Green indicates a price increase.
- Red indicates a price decrease.
- The order book is simulated with 8 bid levels and 8 ask levels.
- The client automatically reconnects when the connection closes.

## Troubleshooting

### The client cannot connect to the server

- Make sure the server is running at `ws://localhost:8080`.
- Make sure no other process is using port `8080`.
- Check the WebSocket URL in the client if the port has changed.

### No data appears in the dashboard

- Make sure the server is sending valid JSON messages.
- Make sure the browser is not blocking the WebSocket connection.
- Refresh the page after the server starts if needed.

### The order book does not change when switching symbols

- Make sure the client sends `REQUEST_ORDERBOOK` when a ticker is selected.
- Make sure the requested symbol exists in the server stock list.

## Related Documentation

- [Client documentation](client/README.md)
- [Server documentation](server/README.md)

## Future Improvements

Some natural next steps for the project are:

- replacing the simulated data with a real market data feed,
- adding multi-timeframe charts,
- adding symbol filtering and search,
- adding authentication or connection limits for WebSocket clients,
- adding tests and observability for the server.

## [License](LICENSE)

MIT License <br> Copyright (c) 2026 Muhamad Nur Arif (ArifTSX)


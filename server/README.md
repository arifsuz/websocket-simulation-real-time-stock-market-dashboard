# websocket-real-time-stock-market-dashboard - Server

WebSocket server for simulating real-time stock market data. This server sends an initial snapshot to the client, broadcasts periodic price updates, and responds to order book requests for specific symbols.

## Features

- WebSocket server at `ws://localhost:8080`.
- Sends an initial snapshot when a client connects.
- Broadcasts market updates every `800ms`.
- Generates simulated order book data for stock symbols.
- Supports symbol-based order book requests from the client.

## Technology

- Node.js
- `ws` as the WebSocket server library

## Requirements

- Node.js 18 or newer.

## Installation

Run the following command from the `server` folder:

```bash
npm install
```

## Running the Server

The server is currently started directly with Node:

```bash
node index.js
```

When active, the server will log that WebSocket is running at `ws://localhost:8080`.

## Data Structure

### Initial stock data

The server initializes the following symbols:

- `AAPL`
- `GOOGL`
- `TSLA`
- `MSFT`
- `NVDA`

Each symbol has the following properties:

- `price` - the latest price.
- `change` - percentage change from the previous tick.

### Price simulation

Every `800ms`, the server will:

1. Change each stock price randomly with a slight upward bias.
2. Calculate the percentage price change.
3. Send a `MARKET_UPDATE` payload to all clients.

### Order book

The order book is simulated from the active symbol's base price. The server sends:

- `bids` - buy price levels.
- `asks` - sell price levels.

Each side contains 8 price levels.

## WebSocket Events

### `INITIAL_SNAPSHOT`

Sent once to a newly connected client after the connection is established.

Example payload:

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

Broadcast to all clients every `800ms`.

Example payload:

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

Example client message:

```json
{
	"type": "REQUEST_ORDERBOOK",
	"symbol": "TSLA"
}
```

If the symbol is valid, the server responds with `ORDERBOOK_UPDATE`.

Example response:

```json
{
	"type": "ORDERBOOK_UPDATE",
	"symbol": "TSLA",
	"bids": [],
	"asks": []
}
```

## Client Integration

The React client in this project connects to the server through `ws://localhost:8080`. When the user selects a ticker, the client sends `REQUEST_ORDERBOOK` for the active symbol, then displays the chart and order book from the received data.

## Development Notes

- This server is a simulator, not a live market data connection.
- Price and order book data are generated randomly for UI demo purposes.
- If you want to change the WebSocket endpoint, update the URL in the client hook `useWebSocket`.

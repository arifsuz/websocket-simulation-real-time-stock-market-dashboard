import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url) {
  const ws = useRef(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("CONNECTING"); // CONNECTING | OPEN | CLOSED
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setStatus("OPEN");
      console.log("WebSocket terhubung!");
    };

    ws.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed);
    };

    ws.current.onclose = () => {
      setStatus("CLOSED");
      // Auto-reconnect setelah 3 detik
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = (err) => {
      console.error("WS Error:", err);
      ws.current.close();
    };
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  // Fungsi untuk kirim pesan ke server
  const send = useCallback((payload) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    }
  }, []);

  return { data, status, send };
}
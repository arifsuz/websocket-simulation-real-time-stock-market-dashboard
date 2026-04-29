export default function OrderBook({ symbol, bids, asks }) {
  const maxVol = Math.max(
    ...bids.map((b) => b.volume),
    ...asks.map((a) => a.volume),
    1
  );

  const spread = asks[0] && bids[0]
    ? (asks[0].price - bids[0].price).toFixed(2)
    : "—";

  return (
    <div className="ob-card">
      <h3 className="ob-title">Order Book — {symbol}</h3>

      {/* Asks (jual) */}
      {[...asks].reverse().map((ask, i) => (
        <div key={i} className="ob-row">
          <div
            className="ob-bg"
            style={{ width: `${(ask.volume / maxVol) * 100}%`, background: "#e24b4a22" }}
          />
          <span className="dn">{ask.price.toFixed(2)}</span>
          <span className="vol">{ask.volume}</span>
        </div>
      ))}

      <div className="spread">spread ${spread}</div>

      {/* Bids (beli) */}
      {bids.map((bid, i) => (
        <div key={i} className="ob-row">
          <div
            className="ob-bg"
            style={{ width: `${(bid.volume / maxVol) * 100}%`, background: "#2ea87122" }}
          />
          <span className="up">{bid.price.toFixed(2)}</span>
          <span className="vol">{bid.volume}</span>
        </div>
      ))}
    </div>
  );
}
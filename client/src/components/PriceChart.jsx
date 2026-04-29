import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

export default function PriceChart({ symbol, stock, history }) {
  if (!stock) return <div className="chart-card">Loading...</div>;

  const data = history.map((price, i) => ({ i, price }));
  const isUp = stock.change >= 0;
  const color = isUp ? "#2ea871" : "#e24b4a";

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-sym">{symbol}</h2>
        <span className={isUp ? "up" : "dn"}>
          ${stock.price.toFixed(2)}
          &nbsp;({isUp ? "+" : ""}{stock.change.toFixed(3)}%)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="i" hide />
          <YAxis
            domain={["auto", "auto"]}
            width={60}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(v) => [`$${v.toFixed(2)}`, "Price"]}
            labelFormatter={() => ""}
          />
          <ReferenceLine y={history[0]} stroke="#888" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
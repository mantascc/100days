export default function BarChart({ data, xKey, yKey, label }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data</div>;
  }

  const width = 800;
  const height = 400;
  const padding = 60;

  // Extract values
  const yValues = data.map(d => parseFloat(d[yKey]) || 0);
  const maxY = Math.max(...yValues);
  const barWidth = (width - padding * 2) / data.length * 0.8;
  const spacing = (width - padding * 2) / data.length;

  return (
    <div>
      {label && <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{label}</div>}
      <svg width={width} height={height} style={{ background: '#000', border: '1px solid #333' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = height - padding - ratio * (height - padding * 2);
          return (
            <line
              key={ratio}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#222"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = height - padding - ratio * (height - padding * 2);
          const value = (ratio * maxY).toFixed(0);
          return (
            <text
              key={ratio}
              x={padding - 10}
              y={y + 4}
              fill="#fff"
              fontSize="12"
              fontFamily="monospace"
              textAnchor="end"
            >
              {value}
            </text>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const value = yValues[i];
          const barHeight = (value / maxY) * (height - padding * 2);
          const x = padding + i * spacing + (spacing - barWidth) / 2;
          const y = height - padding - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#fff"
              />
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                fill="#fff"
                fontSize="12"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {d[xKey]}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                fill="#fff"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

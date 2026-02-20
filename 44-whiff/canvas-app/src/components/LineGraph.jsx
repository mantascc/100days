export default function LineGraph({ data, xKey, yKey, yKeys, colors, label }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data</div>;
  }

  const width = 800;
  const height = 400;
  const padding = 60;

  // Support multiple series
  const series = yKeys && Array.isArray(yKeys)
    ? yKeys.map((key, idx) => ({
        key,
        color: colors?.[idx] || '#fff',
        label: key
      }))
    : [{ key: yKey, color: '#fff', label: yKey }];

  // Extract all values to determine min/max
  const allValues = series.flatMap(s =>
    data.map(d => parseFloat(d[s.key]) || 0)
  );
  const maxY = Math.max(...allValues);
  const minY = Math.min(...allValues);
  const rangeY = maxY - minY || 1;

  // Calculate points for each series
  const seriesData = series.map(s => ({
    ...s,
    points: data.map((d, i) => {
      const yValue = parseFloat(d[s.key]) || 0;
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((yValue - minY) / rangeY) * (height - padding * 2);
      return { x, y, label: d[xKey], value: yValue };
    })
  }));

  return (
    <div>
      {label && <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{label}</div>}

      {/* Legend */}
      {seriesData.length > 1 && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          {seriesData.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '3px', background: s.color }} />
              <span style={{ fontSize: '0.9rem' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

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
          const value = (minY + ratio * rangeY).toFixed(0);
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

        {/* Lines and points for each series */}
        {seriesData.map((s, seriesIdx) => {
          const pathD = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          return (
            <g key={seriesIdx}>
              {/* Line */}
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
              />
              {/* Points */}
              {s.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={s.color}
                />
              ))}
            </g>
          );
        })}

        {/* X-axis labels (use first series for positioning) */}
        {seriesData[0].points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - padding + 20}
            fill="#fff"
            fontSize="12"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

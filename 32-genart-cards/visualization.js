const screenWidth = window.innerWidth;

// responsive width: 50% on desktop, 90% on mobile
const isMobile = screenWidth < 768;
const vizWidth = isMobile ? screenWidth * 0.9 : screenWidth * 0.5;
const vizHeight = vizWidth * 0.3;
const pad = 30;

const samples = d3.range(0, 1.0001, 0.001);

const curvesContainer = d3.select("#curves-content");

curves.forEach((curve, i) => {
  const container = curvesContainer
    .append("div")
    .attr("class", "chart-wrapper")
    .style("width", `${vizWidth}px`);

  const svg = container
    .append("svg")
    .attr("width", vizWidth)
    .attr("height", vizHeight);

  const w = vizWidth - pad * 2;
  const h = vizHeight - pad * 2;

  const x = d3.scaleLinear().domain([0, 1]).range([0, w]);
  const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

  const g = svg.append("g")
    .attr("transform", `translate(${pad},${pad})`);

  // axes
  g.append("line")
    .attr("x1", 0).attr("x2", w)
    .attr("y1", h).attr("y2", h)
    .attr("stroke", "#333").attr("stroke-width", 1);

  g.append("line")
    .attr("x1", 0).attr("x2", 0)
    .attr("y1", 0).attr("y2", h)
    .attr("stroke", "#333").attr("stroke-width", 1);

  // y-axis value labels
  g.append("text")
    .text("1.0")
    .attr("x", -8)
    .attr("y", 5)
    .attr("fill", "#666")
    .attr("font-size", 9)
    .attr("text-anchor", "end");

  g.append("text")
    .text("0.5")
    .attr("x", -8)
    .attr("y", h/2 + 3)
    .attr("fill", "#666")
    .attr("font-size", 9)
    .attr("text-anchor", "end");

  g.append("text")
    .text("0.0")
    .attr("x", -8)
    .attr("y", h + 3)
    .attr("fill", "#666")
    .attr("font-size", 9)
    .attr("text-anchor", "end");

  // curve - use data if provided, otherwise generate from fn
  const data = curve.data || samples.map(t => ({ t, y: curve.fn(t) }));

  const line = d3.line()
    .x(d => x(d.t))
    .y(d => y(d.y))
    .curve(d3.curveCatmullRom.alpha(0.7));

  g.append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

  // animated red dot
  const dot = g.append("circle")
    .attr("r", 2)
    .attr("fill", "#ff0000")
    .style("pointer-events", "none");

  function animateDot() {
    let cycleCount = 0;
    function cycle() {
      dot
        .attr("cx", x(0))
        .attr("cy", y(data[0].y))
        .transition()
        .duration(8000)
        .ease(d3.easeLinear)
        .attrTween("cx", () => t => x(t))
        .attrTween("cy", () => t => {
          const index = Math.floor(t * (data.length - 1));
          return y(data[index].y);
        })
        .on("end", () => {
          cycleCount++;
          if (cycleCount < 4) {
            cycle();
          } else {
            cycleCount = 0;
            cycle();
          }
        });
    }
    cycle();
  }
  animateDot();

  // Calculate average entropy
  const avgEntropy = data.reduce((sum, point) => sum + point.y, 0) / data.length;

  // title with average entropy
  const titleText = g.append("text")
    .attr("x", 0)
    .attr("y", -8)
    .attr("font-family", "'SF Mono', 'Monaco', 'Cascadia Code', monospace")
    .attr("font-weight", 400)
    .style("letter-spacing", "0.02em");

  titleText.append("tspan")
    .text(curve.name)
    .attr("fill", "#999")
    .attr("font-size", 12);

  titleText.append("tspan")
    .text(` (${avgEntropy.toFixed(2)})`)
    .attr("fill", "#666")
    .attr("font-size", 11);

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#1a1a1a")
    .style("color", "#ddd")
    .style("padding", "8px 12px")
    .style("border", "1px solid #444")
    .style("border-radius", "4px")
    .style("font-family", "'SF Mono', 'Monaco', 'Cascadia Code', monospace")
    .style("font-size", "11px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Invisible overlay for mouse tracking
  g.append("rect")
    .attr("width", w)
    .attr("height", h)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mousemove", function(event) {
      const [mouseX] = d3.pointer(event);
      const t = x.invert(mouseX);

      // Find closest data point
      const index = Math.round(t * (data.length - 1));
      const point = data[Math.max(0, Math.min(index, data.length - 1))];

      const timestepNum = Math.round(point.t * 1000);
      tooltip
        .style("opacity", 1)
        .html(`Entropy: ${point.y.toFixed(3)}<br/>Timestep: ${timestepNum}/1000`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    });
});

import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import Papa from 'papaparse'
import { motion } from 'framer-motion'

type NodeRec = {
  id: number
  name: string
  role: string
  team: string
  location: string
  email: string
  degree: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

type EdgeEvent = {
  event_id: number
  source: number
  target: number
  timestamp: Date
  event_type: string
  duration_minutes: number
  project: string
  weight: number
  note: string
}

type LinkAgg = {
  source: any
  target: any
  total: number
  events: EdgeEvent[]
}

export default function CoworkerForceTimeGraph() {
  const [nodesCSV, setNodesCSV] = useState<any[] | null>(null)
  const [edgesCSV, setEdgesCSV] = useState<any[] | null>(null)
  const [playing, setPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(600)
  const [accumulate, setAccumulate] = useState(true)
  const [day, setDay] = useState(1)
  const [daysInMonth, setDaysInMonth] = useState(30)
  const [monthKey, setMonthKey] = useState('2025-09') // YYYY-MM

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; node: NodeRec } | null>(null)

  const parsed = useMemo(() => {
    if (!nodesCSV || !edgesCSV) return null
    const nodes: NodeRec[] = nodesCSV.map((d) => ({
      id: toNum(d.id)!,
      name: d.name,
      role: d.role,
      team: d.team,
      location: d.location,
      email: d.email,
      degree: 0
    }))

    const edgesAll: EdgeEvent[] = edgesCSV.map((d) => ({
      event_id: toNum(d.event_id)!,
      source: toNum(d.source)!,
      target: toNum(d.target)!,
      timestamp: new Date(d.timestamp),
      event_type: d.event_type,
      duration_minutes: toNum(d.duration_minutes)!,
      project: d.project,
      weight: toNum(d.weight)!,
      note: d.note || ''
    }))

    const filtered = edgesAll.filter((e) => fmtMonth(e.timestamp) === monthKey)
    const ext = d3.extent(filtered.map((e) => e.timestamp.getDate()))
    const _days = Math.max((ext[1] as number) || 30, 30)
    return { nodes, edges: filtered, days: _days }
  }, [nodesCSV, edgesCSV, monthKey])

  useEffect(() => {
    if (!parsed) return
    setDaysInMonth(parsed.days)
    if (day > parsed.days) setDay(parsed.days)
  }, [parsed])

  const graph = useMemo(() => {
    if (!parsed) return null
    const { nodes, edges } = parsed
    const cutoff = day
    const activeEdges: EdgeEvent[] = []
    for (const e of edges) {
      const d = e.timestamp.getDate()
      if ((accumulate && d <= cutoff) || (!accumulate && d === cutoff)) activeEdges.push(e)
    }

    const linkKey = (a: number, b: number) => (a < b ? `${a}|${b}` : `${b}|${a}`)
    const linkMap = new Map<string, LinkAgg>()
    for (const e of activeEdges) {
      const k = linkKey(e.source, e.target)
      const val = linkMap.get(k) || { source: e.source, target: e.target, total: 0, events: [] as EdgeEvent[] }
      val.total += e.weight || 1
      val.events.push(e)
      linkMap.set(k, val)
    }
    const links = Array.from(linkMap.values())

    const deg = new Map<number, number>()
    for (const l of links) {
      deg.set(l.source as number, (deg.get(l.source as number) || 0) + l.total)
      deg.set(l.target as number, (deg.get(l.target as number) || 0) + l.total)
    }
    const nodesWithDeg = nodes.map((n) => ({ ...n, degree: deg.get(n.id) || 0 }))
    return { nodes: nodesWithDeg, links }
  }, [parsed, day, accumulate])

  const simRef = useRef<{
    sim: d3.Simulation<NodeRec, undefined>
    nodes: NodeRec[]
    links: LinkAgg[]
  } | null>(null)

  useEffect(() => {
    if (!graph) return
    const w = wrapperRef.current?.clientWidth || 900
    const h = wrapperRef.current?.clientHeight || 600
    const nodes = graph.nodes.map((d) => ({ ...d }))
    const links = graph.links.map((d) => ({ ...d }))

    const linkForce = d3
      .forceLink<NodeRec, any>(links as any)
      .id((d: any) => d.id)
      .distance((l: any) => 50 + 4 * Math.sqrt(l.total || 1))
      .strength((l: any) => 0.05 + Math.min(0.35, (l.total || 1) * 0.02))

    const sim = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-60))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide<NodeRec>().radius((d) => 4 + nodeRadius(d)))
      .force('link', linkForce)
      .alpha(1)
      .alphaDecay(0.05)

    simRef.current = { sim, nodes, links }

    return () => {
      sim.stop()
      simRef.current = null
    }
  }, [graph])

  useEffect(() => {
    let raf = 0
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !simRef.current) return

    const dpiScale = window.devicePixelRatio || 1
    const fitCanvas = () => {
      const w = wrapperRef.current?.clientWidth || 900
      const h = wrapperRef.current?.clientHeight || 600
      const c = canvasRef.current!
      c.width = Math.floor(w * dpiScale)
      c.height = Math.floor(h * dpiScale)
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      ctx.setTransform(dpiScale, 0, 0, dpiScale, 0, 0)
    }
    fitCanvas()

    const draw = () => {
      const { sim, nodes, links } = simRef.current!
      sim.tick()

      ctx.fillStyle = '#0f0f12'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      drawGrid(ctx)

      for (const l of links) {
        const a = l.source as NodeRec
        const b = l.target as NodeRec
        if (!a || !b) continue
        const w = 0.5 + Math.log2(1 + (l.total || 1))
        ctx.globalAlpha = 0.25
        ctx.lineWidth = w
        ctx.strokeStyle = '#b5bfd1'
        ctx.beginPath()
        ctx.moveTo(a.x!, a.y!)
        ctx.lineTo(b.x!, b.y!)
        ctx.stroke()
      }

      for (const n of nodes) {
        const r = nodeRadius(n)
        ctx.globalAlpha = 0.35
        ctx.fillStyle = teamColor(n.team)
        ctx.beginPath()
        ctx.arc(n.x!, n.y!, r + 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.fillStyle = '#e6ecff'
        ctx.fillRect(Math.floor(n.x! - 1), Math.floor(n.y! - 1), 2, 2)
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    const onResize = () => fitCanvas()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [graph])

  useEffect(() => {
    const el = canvasRef.current
    if (!el || !simRef.current) return
    const onMove = (evt: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = evt.clientX - rect.left
      const y = evt.clientY - rect.top
      const nearest = pickNode(x, y, simRef.current?.nodes || [])
      if (nearest) setHoverInfo({ x, y, node: nearest })
      else setHoverInfo(null)
    }
    const onLeave = () => setHoverInfo(null)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setDay((d) => {
        if (!parsed) return d
        const next = d + 1
        if (next > (parsed.days || daysInMonth)) return 1
        return next
      })
    }, Math.max(120, speedMs))
    return () => clearInterval(id)
  }, [playing, speedMs, parsed, daysInMonth])

  const hoverStats = useMemo(() => {
    if (!hoverInfo || !graph || !parsed) return null
    const cutoff = day
    const id = hoverInfo.node.id
    const events = parsed.edges.filter((e) => {
      const d = e.timestamp.getDate()
      const hitsDay = accumulate ? d <= cutoff : d === cutoff
      return hitsDay && (e.source === id || e.target === id)
    })
    const byType = d3.rollup(events, (v) => v.length, (d) => d.event_type)
    return { count: events.length, byType: Array.from(byType, ([k, v]) => ({ type: k, n: v })) }
  }, [hoverInfo, graph, parsed, day, accumulate])

  const handleLoadNodes = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setNodesCSV(res.data as any[])
    })
  }
  const handleLoadEdges = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setEdgesCSV(res.data as any[])
    })
  }

  const generateDemo = () => {
    const N = 100
    const teams = ['Platform','Frontend','Backend','Mobile','Design','Data','Growth','DevOps','Research','Security']
    const nodes: any[] = Array.from({ length: N }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: i % 5 === 0 ? 'Engineer' : 'Designer',
      team: teams[i % teams.length],
      location: 'Remote',
      email: `user${i + 1}@example.com`
    }))
    const edges: any[] = []
    const rnd = d3.randomLcg(0.42)
    for (let k = 0; k < 1200; k++) {
      const a = Math.floor(rnd() * N) + 1
      let b = Math.floor(rnd() * N) + 1
      if (b === a) b = (b % N) + 1
      const day = 1 + Math.floor(rnd() * 30)
      const ts = new Date(Date.UTC(2025, 8, day, Math.floor(rnd() * 24), Math.floor(rnd() * 60)))
      const types = ['meeting','code_review','pair_programming','design_review','async_message','doc_edit','presentation']
      edges.push({
        event_id: k + 1,
        source: a,
        target: b,
        timestamp: ts.toISOString(),
        event_type: types[Math.floor(rnd() * types.length)],
        duration_minutes: 15 + Math.floor(rnd() * 90),
        project: 'Demo',
        weight: 1 + Math.floor(rnd() * 3),
        note: ''
      })
    }
    setNodesCSV(nodes)
    setEdgesCSV(edges)
    setMonthKey('2025-09')
    setDay(1)
  }

  return (
    <div className="w-full h-full min-h-[640px] bg-[#0f0f12] text-zinc-200">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-zinc-800/70 sticky top-0 bg-[#0f0f12]/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-sm uppercase tracking-widest text-zinc-400">Coworker collaboration over time</span>
          <span className="text-xs text-zinc-500">v1</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label className="px-2 py-1 rounded-xl bg-zinc-900/70 border border-zinc-800 cursor-pointer">
            Load nodes CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files && handleLoadNodes(e.target.files[0])} />
          </label>
          <label className="px-2 py-1 rounded-xl bg-zinc-900/70 border border-zinc-800 cursor-pointer">
            Load edges CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files && handleLoadEdges(e.target.files[0])} />
          </label>
          <button onClick={generateDemo} className="px-2 py-1 rounded-xl bg-zinc-900/70 border border-zinc-800">Start Demo</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 text-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying((p) => !p)} className="px-3 py-1 rounded-xl bg-zinc-900/70 border border-zinc-800">
            {playing ? 'Pause' : 'Play'}
          </button>
          <label className="flex items-center gap-2">
            <span className="text-zinc-400">Day</span>
            <input type="range" min={1} max={daysInMonth} value={day} onChange={(e) => setDay(parseInt(e.target.value))} />
            <span className="tabular-nums w-10 text-center">{day}</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-zinc-400">Speed</span>
            <input type="range" min={120} max={1400} step={20} value={speedMs} onChange={(e) => setSpeedMs(parseInt(e.target.value))} />
            <span className="tabular-nums w-14 text-center">{speedMs}ms</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={accumulate} onChange={(e) => setAccumulate(e.target.checked)} />
            <span className="text-zinc-400">Accumulate to day</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-zinc-400">Month</span>
            <input className="bg-zinc-900/70 border border-zinc-800 rounded px-2 py-1 w-28" value={monthKey} onChange={(e) => setMonthKey(e.target.value)} />
          </label>
        </div>
        <div className="text-xs text-zinc-500">
          {parsed ? (
            <span>Loaded: {parsed.nodes.length} coworkers, {parsed.edges.length} events in {monthKey}</span>
          ) : (
            <span>Load CSVs or click Demo to begin</span>
          )}
        </div>
      </div>

      <div ref={wrapperRef} className="relative w-full h-[70vh] min-h-[480px] px-3 pb-3">
        <canvas ref={canvasRef} className="w-full h-full rounded-2xl border border-zinc-800 bg-[#0f0f12]" style={{ imageRendering: 'pixelated' }} />
        {hoverInfo && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none text-[12px] bg-zinc-900/95 border border-zinc-800 rounded-xl p-2 shadow-xl"
            style={{ left: hoverInfo.x + 12, top: hoverInfo.y + 12 }}
          >
            <div className="font-medium text-zinc-200">{hoverInfo.node.name}</div>
            <div className="text-zinc-400">{hoverInfo.node.role} • {hoverInfo.node.team}</div>
            <div className="text-zinc-500">{hoverInfo.node.location}</div>
            <div className="mt-1 text-zinc-400">Degree: <span className="tabular-nums">{hoverInfo.node.degree}</span></div>
            {hoverStats && (
              <div className="mt-1">
                <div className="text-zinc-500">Events {accumulate ? `≤ day ${day}` : `on day ${day}`}: <span className="tabular-nums">{hoverStats.count}</span></div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {hoverStats.byType.map((t) => (
                    <span key={t.type} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">{t.type}: {t.n}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="px-3 pb-4 text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="uppercase tracking-widest">Legend</span>
          <span>• Hover to see coworker details</span>
          <span>• Node = coworker</span>
          <span>• Color = team</span>
        </div>
      </div>
    </div>
  )
}

// ——— helpers ———
function toNum(x: any): number | undefined {
  const n = +x
  return Number.isFinite(n) ? n : undefined
}

function fmtMonth(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${y}-${m}`
}

function nodeRadius(n: NodeRec) {
  return 2 + Math.min(10, Math.sqrt(n.degree || 0))
}

function teamColor(team: string) {
  const map: Record<string, string> = {
    Platform: '#6aa9ff',
    Frontend: '#9ae6ff',
    Backend: '#a3ffa3',
    Mobile: '#ffd27d',
    Design: '#f6a2ff',
    Data: '#c6ffdf',
    Growth: '#ffc7c7',
    DevOps: '#e0e3ff',
    Research: '#f1ffc2',
    Security: '#ffd7f0'
  }
  return map[team] || '#cbd5e1'
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = '#5a6170'
  ctx.lineWidth = 1
  const step = 24
  for (let x = 0; x < width; x += step) {
    ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, height); ctx.stroke()
  }
  for (let y = 0; y < height; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(width, y + 0.5); ctx.stroke()
  }
  ctx.restore()
}

function pickNode(x: number, y: number, nodes: NodeRec[]): NodeRec | null {
  if (!nodes || nodes.length === 0) return null
  let best: NodeRec | null = null
  let bestD = 20
  for (const n of nodes) {
    const dx = x - (n.x ?? 0)
    const dy = y - (n.y ?? 0)
    const d = Math.hypot(dx, dy)
    if (d < bestD) { bestD = d; best = n }
  }
  return best
}
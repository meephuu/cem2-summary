import { useRef, useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { fmt } from '../../lib/math'
import { cssVar, drawFrame, withAlpha } from '../../lib/plot'
import { ButtonRow, PlotCanvas, Readout, Widget } from './Widget'

interface Target {
  id: string
  name: string
  cdf: (x: number) => number
  inverse: (p: number) => number
  pdf: (x: number) => number
  range: [number, number]
  mean: number
  formula: string
}

const TARGETS: Target[] = [
  {
    id: 'exp',
    name: 'Exponential(λ = 1) – เวลานอนของ Hamtaro',
    cdf: (x) => 1 - Math.exp(-x),
    inverse: (p) => -Math.log(1 - p),
    pdf: (x) => Math.exp(-x),
    range: [0, 5],
    mean: 1,
    formula: 'x = F⁻¹(p) = −ln(1 − p)',
  },
  {
    id: 'tri',
    name: 'f(x) = 2x บน [0, 1] (ตัวอย่างในสไลด์)',
    cdf: (x) => x * x,
    inverse: (p) => Math.sqrt(p),
    pdf: (x) => 2 * x,
    range: [0, 1],
    mean: 2 / 3,
    formula: 'x = F⁻¹(p) = √p',
  },
]

const BINS = 30

/** Uniform p → project across the CDF → x. Repeat many times and the histogram matches the pdf. */
export function InverseTransformDemo() {
  const [target, setTarget] = useState(TARGETS[0])
  const [samples, setSamples] = useState<{ p: number; x: number }[]>([])
  const recent = useRef<{ p: number; x: number }[]>([])

  const add = (k: number) => {
    const fresh = Array.from({ length: k }, () => {
      const p = Math.random()
      return { p, x: target.inverse(p) }
    })
    recent.current = [...recent.current, ...fresh].slice(-5)
    setSamples((s) => [...s, ...fresh].slice(-50000))
  }
  const reset = (t: Target) => {
    setTarget(t)
    setSamples([])
    recent.current = []
  }

  const cdfRef = useCanvas((g, w, h) => {
    const [lo, hi] = target.range
    const f = drawFrame(g, w, h, { xlo: lo, xhi: hi, ymax: 1.05 })
    g.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x = lo + ((hi - lo) * i) / 300
      if (i) g.lineTo(f.X(x), f.Y(target.cdf(x)))
      else g.moveTo(f.X(x), f.Y(target.cdf(x)))
    }
    g.strokeStyle = cssVar('--accent')
    g.lineWidth = 2.4
    g.stroke()
    const warn = cssVar('--warn')
    recent.current.forEach((s, i, arr) => {
      const latest = i === arr.length - 1
      const x = Math.min(s.x, hi)
      g.strokeStyle = latest ? warn : withAlpha(warn, 0.35)
      g.lineWidth = latest ? 2 : 1.2
      g.setLineDash([5, 4])
      g.beginPath()
      g.moveTo(f.left, f.Y(s.p))
      g.lineTo(f.X(x), f.Y(s.p))
      g.lineTo(f.X(x), f.bottom)
      g.stroke()
      g.setLineDash([])
      if (latest) {
        g.fillStyle = warn
        g.textAlign = 'left'
        g.textBaseline = 'bottom'
        g.fillText(`p = ${s.p.toFixed(3)}`, f.left + 4, f.Y(s.p) - 3)
        g.textBaseline = 'top'
        g.fillText(`x = ${s.x.toFixed(3)}`, f.X(x) + 4, f.bottom - 16)
      }
    })
  })

  const histRef = useCanvas((g, w, h) => {
    const [lo, hi] = target.range
    const width = (hi - lo) / BINS
    const counts = new Array(BINS).fill(0)
    for (const s of samples) {
      const b = Math.floor((s.x - lo) / width)
      if (b >= 0 && b < BINS) counts[b]++
    }
    const dens = counts.map((c) => (samples.length ? c / (samples.length * width) : 0))
    let peak = 0
    for (let i = 0; i <= 200; i++) peak = Math.max(peak, target.pdf(lo + ((hi - lo) * i) / 200))
    const f = drawFrame(g, w, h, { xlo: lo, xhi: hi, ymax: Math.max(peak, ...dens) * 1.12 })
    g.fillStyle = withAlpha(cssVar('--accent'), 0.5)
    dens.forEach((d, i) => {
      const x0 = f.X(lo + i * width)
      const x1 = f.X(lo + (i + 1) * width)
      g.fillRect(x0 + 0.5, f.Y(d), Math.max(1, x1 - x0 - 1), f.bottom - f.Y(d))
    })
    g.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x = lo + ((hi - lo) * i) / 300
      if (i) g.lineTo(f.X(x), f.Y(target.pdf(x)))
      else g.moveTo(f.X(x), f.Y(target.pdf(x)))
    }
    g.strokeStyle = cssVar('--warn')
    g.lineWidth = 2.2
    g.stroke()
  })

  const last = samples[samples.length - 1]
  const mean = samples.length ? samples.reduce((a, s) => a + s.x, 0) / samples.length : NaN

  return (
    <Widget
      title="Inverse Transform Sampling"
      hint="กดสุ่ม: เครื่องสุ่ม p จาก U(0,1) วางบนแกนตั้ง ลากเส้นไปชนกราฟ CDF แล้วลงมาที่แกนนอน ได้ x หนึ่งค่า (เส้นประสีส้ม) ถ้าสุ่มหลายพันค่า ฮิสโตแกรมของ x (กราฟล่าง) จะทับ pdf เป้าหมาย (เส้นส้ม) พอดี"
    >
      <ButtonRow>
        <select
          aria-label="เลือกการแจกแจงเป้าหมาย"
          value={target.id}
          onChange={(e) => reset(TARGETS.find((t) => t.id === e.target.value)!)}
        >
          {TARGETS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button onClick={() => add(1)}>สุ่ม 1 ค่า</button>
        <button onClick={() => add(100)}>+100</button>
        <button onClick={() => add(5000)}>+5,000</button>
        <button onClick={() => reset(target)}>ล้าง</button>
      </ButtonRow>
      <PlotCanvas canvasRef={cdfRef} label="กราฟ CDF พร้อมเส้นแปลงค่า p เป็น x" height={240} />
      <PlotCanvas canvasRef={histRef} label="ฮิสโตแกรมของค่าที่สุ่มได้เทียบกับ pdf" height={200} />
      <Readout>
        {target.formula} &nbsp;·&nbsp;{' '}
        {last ? (
          <>
            ล่าสุด p = <b>{last.p.toFixed(3)}</b> → x = <b>{last.x.toFixed(3)}</b>
          </>
        ) : (
          'ยังไม่ได้สุ่ม'
        )}
        <br />
        สุ่มไปแล้ว <b>{samples.length.toLocaleString()}</b> ค่า · ค่าเฉลี่ยตัวอย่าง ={' '}
        <b>{Number.isNaN(mean) ? '–' : mean.toFixed(3)}</b> (ค่าจริง {fmt(target.mean)})
      </Readout>
    </Widget>
  )
}

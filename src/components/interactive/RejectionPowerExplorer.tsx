import { useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { fmt, invertCdf, normalCdf, normalPdf } from '../../lib/math'
import { cssVar, drawFrame, withAlpha } from '../../lib/plot'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

type Side = 'right' | 'left' | 'two'
const SIDES: { id: Side; label: string }[] = [
  { id: 'right', label: 'ขวา (Hₐ: μ > μ₀)' },
  { id: 'left', label: 'ซ้าย (Hₐ: μ < μ₀)' },
  { id: 'two', label: 'สองทาง (Hₐ: μ ≠ μ₀)' },
]
const LO = -5
const HI = 8
const active = { borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 600 }

/** Null vs alternative distribution of the z statistic: α (red), power (green), β. */
export function RejectionPowerExplorer() {
  const [side, setSide] = useState<Side>('right')
  const [alpha, setAlpha] = useState(0.05)
  const [d, setD] = useState(0.5)
  const [n, setN] = useState(16)

  const shift = (side === 'left' ? -1 : 1) * d * Math.sqrt(n)
  const zc = invertCdf(normalCdf, 1 - (side === 'two' ? alpha / 2 : alpha))
  const inR = (z: number) => (side === 'right' ? z >= zc : side === 'left' ? z <= -zc : Math.abs(z) >= zc)
  const power =
    side === 'right'
      ? 1 - normalCdf(zc - shift)
      : side === 'left'
        ? normalCdf(-zc - shift)
        : 1 - normalCdf(zc - shift) + normalCdf(-zc - shift)

  const ref = useCanvas((g, w, h) => {
    const h0 = cssVar('--accent')
    const ha = cssVar('--ex')
    const rej = cssVar('--warn')
    const f = drawFrame(g, w, h, { xlo: LO, xhi: HI, ymax: 0.45 })
    const N = 700
    const xs = Array.from({ length: N + 1 }, (_, i) => LO + ((HI - LO) * i) / N)

    // power: H_A area inside the rejection region
    const fillUnder = (mu: number, color: string, keep: (x: number) => boolean) => {
      g.fillStyle = color
      for (let i = 0; i < N; i++) {
        const x = (xs[i] + xs[i + 1]) / 2
        if (!keep(x)) continue
        const y = normalPdf(x, mu)
        g.fillRect(f.X(xs[i]), f.Y(y), f.X(xs[i + 1]) - f.X(xs[i]) + 0.6, f.bottom - f.Y(y))
      }
    }
    fillUnder(shift, withAlpha(ha, 0.28), inR)
    fillUnder(0, withAlpha(rej, 0.55), inR)

    const curve = (mu: number, color: string, label: string) => {
      g.beginPath()
      xs.forEach((x, i) => (i ? g.lineTo(f.X(x), f.Y(normalPdf(x, mu))) : g.moveTo(f.X(x), f.Y(normalPdf(x, mu)))))
      g.strokeStyle = color
      g.lineWidth = 2.2
      g.stroke()
      g.fillStyle = color
      g.textAlign = 'center'
      g.textBaseline = 'bottom'
      g.font = '12px system-ui, sans-serif'
      g.fillText(label, f.X(mu), f.Y(normalPdf(mu, mu)) - 3)
    }
    curve(0, h0, 'H₀')
    if (Math.abs(shift) > 0.05) curve(shift, ha, 'Hₐ')

    g.setLineDash([5, 4])
    g.strokeStyle = cssVar('--text')
    g.lineWidth = 1.3
    const cuts = side === 'two' ? [-zc, zc] : side === 'left' ? [-zc] : [zc]
    for (const c of cuts) {
      g.beginPath()
      g.moveTo(f.X(c), f.top)
      g.lineTo(f.X(c), f.bottom)
      g.stroke()
    }
    g.setLineDash([])
  })

  return (
    <Widget
      title="Rejection region, α และ Power"
      hint="เส้นน้ำเงินคือการแจกแจงของค่า z ถ้า H₀ จริง เส้นเขียวคือถ้า Hₐ จริง (เลื่อนไป d·√n) เส้นประคือ critical value พื้นที่สีส้มใต้ H₀ = α (ปฏิเสธผิด) พื้นที่สีเขียวใต้ Hₐ = power (จับความต่างได้จริง) ลองเพิ่ม n หรือ d แล้วดู power โต ลองลด α แล้วดู power หด"
    >
      <ButtonRow>
        {SIDES.map((s) => (
          <button key={s.id} onClick={() => setSide(s.id)} style={s.id === side ? active : undefined}>
            {s.label}
          </button>
        ))}
      </ButtonRow>
      <Controls>
        <Slider label="α (significance level)" value={alpha} min={0.01} max={0.2} step={0.01} onChange={setAlpha} />
        <Slider label="d (Cohen's d = |μ₁ − μ₀|/σ)" value={d} min={0} max={1.5} step={0.05} onChange={setD} />
        <Slider label="n (ขนาดตัวอย่าง)" value={n} min={2} max={100} step={1} onChange={setN} />
      </Controls>
      <PlotCanvas canvasRef={ref} label="การแจกแจงของ test statistic ภายใต้ H0 และ HA พร้อม rejection region" height={300} />
      <Readout>
        critical value = <b>{side === 'two' ? '±' : side === 'left' ? '−' : ''}{zc.toFixed(3)}</b> &nbsp;·&nbsp; Hₐ เลื่อนไป d√n ={' '}
        <b>{fmt(shift)}</b>
        <br />
        P(Type I) = α = <b>{alpha.toFixed(2)}</b> &nbsp;·&nbsp; Power = 1 − β = <b>{power.toFixed(3)}</b> &nbsp;·&nbsp; β = P(Type II) ={' '}
        <b>{(1 - power).toFixed(3)}</b>
      </Readout>
    </Widget>
  )
}

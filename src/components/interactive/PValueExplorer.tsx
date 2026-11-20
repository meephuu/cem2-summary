import { useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { invertCdf, normalCdf, normalPdf, tCdf, tPdf } from '../../lib/math'
import { cssVar, drawFrame, withAlpha } from '../../lib/plot'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

type Side = 'right' | 'left' | 'two'
const LO = -5
const HI = 5
const active = { borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 600 }

/** Shade the p-value of an observed z or t statistic and compare it with α. */
export function PValueExplorer() {
  const [dist, setDist] = useState<'z' | 't'>('t')
  const [df, setDf] = useState(8)
  const [side, setSide] = useState<Side>('two')
  const [alpha, setAlpha] = useState(0.05)
  const [stat, setStat] = useState(2.2)

  const cdf = (x: number) => (dist === 'z' ? normalCdf(x) : tCdf(x, df))
  const pdf = (x: number) => (dist === 'z' ? normalPdf(x) : tPdf(x, df))
  const p = side === 'right' ? 1 - cdf(stat) : side === 'left' ? cdf(stat) : 2 * (1 - cdf(Math.abs(stat)))
  const crit = invertCdf(cdf, 1 - (side === 'two' ? alpha / 2 : alpha))
  const reject = p <= alpha
  const inTail = (x: number) =>
    side === 'right' ? x >= stat : side === 'left' ? x <= stat : Math.abs(x) >= Math.abs(stat)

  const ref = useCanvas((g, w, h) => {
    const acc = cssVar('--accent')
    const tail = cssVar(reject ? '--warn' : '--tip')
    const f = drawFrame(g, w, h, { xlo: LO, xhi: HI, ymax: 0.45 })
    const N = 600
    const xs = Array.from({ length: N + 1 }, (_, i) => LO + ((HI - LO) * i) / N)
    g.fillStyle = withAlpha(tail, 0.45)
    for (let i = 0; i < N; i++) {
      const x = (xs[i] + xs[i + 1]) / 2
      if (!inTail(x)) continue
      const y = pdf(x)
      g.fillRect(f.X(xs[i]), f.Y(y), f.X(xs[i + 1]) - f.X(xs[i]) + 0.6, f.bottom - f.Y(y))
    }
    if (dist === 't') {
      g.beginPath()
      xs.forEach((x, i) => (i ? g.lineTo(f.X(x), f.Y(normalPdf(x))) : g.moveTo(f.X(x), f.Y(normalPdf(x)))))
      g.strokeStyle = cssVar('--border')
      g.lineWidth = 1.5
      g.stroke()
    }
    g.beginPath()
    xs.forEach((x, i) => (i ? g.lineTo(f.X(x), f.Y(pdf(x))) : g.moveTo(f.X(x), f.Y(pdf(x)))))
    g.strokeStyle = acc
    g.lineWidth = 2.2
    g.stroke()

    // critical values
    g.setLineDash([5, 4])
    g.strokeStyle = cssVar('--warn')
    g.lineWidth = 1.4
    const cuts = side === 'two' ? [-crit, crit] : side === 'left' ? [-crit] : [crit]
    for (const c of cuts) {
      g.beginPath()
      g.moveTo(f.X(c), f.top + 14)
      g.lineTo(f.X(c), f.bottom)
      g.stroke()
    }
    g.setLineDash([])
    // observed statistic
    g.strokeStyle = cssVar('--text')
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(f.X(stat), f.top)
    g.lineTo(f.X(stat), f.bottom)
    g.stroke()
    g.fillStyle = cssVar('--text')
    g.textAlign = 'left'
    g.textBaseline = 'top'
    g.font = '12px system-ui, sans-serif'
    g.fillText(`${dist} ที่วัดได้ = ${stat.toFixed(2)}`, Math.min(f.X(stat) + 4, f.right - 110), f.top)
  })

  const name = dist === 'z' ? 'z' : 't'
  return (
    <Widget
      title="p-value กับ critical value"
      hint="เส้นทึบดำคือค่า test statistic ที่คำนวณได้ พื้นที่แรเงาคือ p-value (โอกาสเห็นค่าที่สุดโต่งอย่างน้อยเท่านี้ ถ้า H₀ จริง) เส้นประส้มคือ critical value ถ้าเส้นดำเลยเส้นประออกไปในหาง แปลว่า p ≤ α เสมอ ลองเลือก t แล้วลด df ดูว่าหางหนาขึ้นจนต้องใช้ critical value ใหญ่ขึ้น (เส้นเทาจางคือ N(0,1) ไว้เทียบ)"
    >
      <ButtonRow>
        <button onClick={() => setDist('z')} style={dist === 'z' ? active : undefined}>
          Z ~ N(0, 1)
        </button>
        <button onClick={() => setDist('t')} style={dist === 't' ? active : undefined}>
          T ~ t(df)
        </button>
        <span>|</span>
        <button onClick={() => setSide('right')} style={side === 'right' ? active : undefined}>
          หางขวา
        </button>
        <button onClick={() => setSide('left')} style={side === 'left' ? active : undefined}>
          หางซ้าย
        </button>
        <button onClick={() => setSide('two')} style={side === 'two' ? active : undefined}>
          สองทาง
        </button>
        <span>|</span>
        {[0.1, 0.05, 0.01].map((a) => (
          <button key={a} onClick={() => setAlpha(a)} style={a === alpha ? active : undefined}>
            α = {a}
          </button>
        ))}
      </ButtonRow>
      <Controls>
        <Slider label={`${name} ที่คำนวณได้`} value={stat} min={-4.5} max={4.5} step={0.01} onChange={setStat} />
        {dist === 't' && <Slider label="df (degrees of freedom)" value={df} min={1} max={60} step={1} onChange={setDf} />}
      </Controls>
      <PlotCanvas canvasRef={ref} label="การแจกแจงภายใต้ H0 พร้อม p-value ที่แรเงา" />
      <Readout>
        p-value = <b>{p < 0.0001 ? '< 0.0001' : p.toFixed(4)}</b> &nbsp;·&nbsp; critical value ={' '}
        <b>
          {side === 'two' ? '±' : side === 'left' ? '−' : ''}
          {crit.toFixed(3)}
        </b>
        {dist === 't' && <> (df = {df})</>}
        <br />
        สรุป: {reject ? <b>p ≤ α → ปฏิเสธ H₀</b> : <b>p &gt; α → ปฏิเสธ H₀ ไม่ได้ (ไม่ได้แปลว่า H₀ จริง)</b>}
      </Readout>
    </Widget>
  )
}

import { useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { fmt, invertCdf, normalCdf } from '../../lib/math'
import { cssVar, drawFrame, withAlpha } from '../../lib/plot'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

const SPLITS = [
  { label: '50/50', m: 1 },
  { label: '80/20', m: 0.25 },
  { label: '33/67', m: 2 },
]
const active = { borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 600 }

/** n = (m+1)/m · ((z_α + z_β)σ / MDE)², σ² = p(1−p) — the formula from the slides. */
export function SampleSizeCalculator() {
  const [p, setP] = useState(0.1)
  const [mdePct, setMdePct] = useState(1)
  const [alpha, setAlpha] = useState(0.05)
  const [power, setPower] = useState(0.8)
  const [split, setSplit] = useState(0)
  const [two, setTwo] = useState(false)

  const m = SPLITS[split].m
  const mde = mdePct / 100
  const sigma2 = p * (1 - p)
  const za = invertCdf(normalCdf, 1 - (two ? alpha / 2 : alpha))
  const zb = invertCdf(normalCdf, power)
  const n = ((m + 1) / m) * (((za + zb) ** 2) * sigma2) / (mde * mde)
  const nC = Math.ceil(n)
  const nT = Math.ceil(n * m)
  const powerAt = (nn: number) => normalCdf(mde / Math.sqrt(sigma2 * (1 / nn + 1 / (m * nn))) - za)

  const ref = useCanvas((g, w, h) => {
    const acc = cssVar('--accent')
    const xmax = Math.max(10, nC * 2.5)
    const f = drawFrame(g, w, h, { xlo: 0, xhi: xmax, ymax: 1 })
    g.fillStyle = withAlpha(cssVar('--ex'), 0.12)
    g.fillRect(f.X(nC), f.top, f.right - f.X(nC), f.bottom - f.top)
    g.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x = 1 + ((xmax - 1) * i) / 300
      const y = f.Y(powerAt(x))
      if (i) g.lineTo(f.X(x), y)
      else g.moveTo(f.X(x), y)
    }
    g.strokeStyle = acc
    g.lineWidth = 2.2
    g.stroke()
    g.setLineDash([5, 4])
    g.strokeStyle = cssVar('--warn')
    g.lineWidth = 1.3
    g.beginPath()
    g.moveTo(f.left, f.Y(power))
    g.lineTo(f.right, f.Y(power))
    g.moveTo(f.X(nC), f.top)
    g.lineTo(f.X(nC), f.bottom)
    g.stroke()
    g.setLineDash([])
    g.fillStyle = cssVar('--text')
    g.font = '12px system-ui, sans-serif'
    g.textAlign = 'left'
    g.textBaseline = 'top'
    g.fillText(`n กลุ่มควบคุม = ${nC.toLocaleString()}`, Math.min(f.X(nC) + 6, f.right - 150), f.top + 4)
    g.textBaseline = 'bottom'
    g.fillText(`power = ${power}`, f.left + 6, f.Y(power) - 3)
  })

  return (
    <Widget
      title="คำนวณขนาดตัวอย่างจาก MDE"
      hint="กราฟคือ power เทียบกับจำนวนตัวอย่างในกลุ่มควบคุม (n) เส้นประแนวตั้งคือ n ที่ต้องเก็บให้ได้ power ตามที่ตั้งไว้ ลองลด MDE ลงครึ่งหนึ่ง แล้วดูว่า n เพิ่มขึ้น 4 เท่า (เพราะ MDE อยู่ในตัวส่วนยกกำลังสอง) หรือเปลี่ยนเป็น 80/20 แล้วดูว่าต้องเก็บรวมมากขึ้น"
    >
      <Controls>
        <Slider label="conversion rate เดิม p" value={p} min={0.01} max={0.5} step={0.01} onChange={setP} />
        <Slider label="MDE (เปอร์เซ็นต์พอยต์)" value={mdePct} min={0.2} max={5} step={0.1} onChange={setMdePct} />
        <Slider label="α" value={alpha} min={0.01} max={0.2} step={0.01} onChange={setAlpha} />
        <Slider label="power (1 − β)" value={power} min={0.5} max={0.95} step={0.05} onChange={setPower} />
      </Controls>
      <ButtonRow>
        <span>control/test:</span>
        {SPLITS.map((s, i) => (
          <button key={s.label} onClick={() => setSplit(i)} style={i === split ? active : undefined}>
            {s.label}
          </button>
        ))}
        <span>|</span>
        <button onClick={() => setTwo(false)} style={!two ? active : undefined}>
          one-sided
        </button>
        <button onClick={() => setTwo(true)} style={two ? active : undefined}>
          two-sided
        </button>
      </ButtonRow>
      <PlotCanvas canvasRef={ref} label="power เทียบกับขนาดตัวอย่างต่อกลุ่ม" />
      <Readout>
        σ² = p(1 − p) = {sigma2.toFixed(4)} · z<sub>α</sub> = {za.toFixed(3)} · z<sub>β</sub> = {zb.toFixed(3)} · m = {fmt(m)}
        <br />
        ต้องเก็บ: กลุ่มควบคุม <b>{nC.toLocaleString()}</b> · กลุ่มทดลอง <b>{nT.toLocaleString()}</b> · รวม{' '}
        <b>{(nC + nT).toLocaleString()}</b>
      </Readout>
    </Widget>
  )
}

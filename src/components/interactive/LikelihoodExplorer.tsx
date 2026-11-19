import { useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { cssVar, drawFrame, drawMarker, withAlpha } from '../../lib/plot'
import { Slider } from './Slider'
import { Controls, PlotCanvas, Readout, Widget } from './Widget'

/** Binomial likelihood L(θ) = θ^k (1−θ)^(n−k), scaled so its peak is 1. The peak sits at k/n. */
export function LikelihoodExplorer() {
  const [n, setN] = useState(100)
  const [kRaw, setK] = useState(55)
  const [theta, setTheta] = useState(0.3)
  const k = Math.min(kRaw, n)
  const mle = k / n

  const logL = (t: number) => {
    if (t <= 0) return k === 0 ? 0 : -Infinity
    if (t >= 1) return k === n ? 0 : -Infinity
    return k * Math.log(t) + (n - k) * Math.log(1 - t)
  }
  const peak = logL(mle)
  const rel = (t: number) => Math.exp(logL(t) - peak)

  const ref = useCanvas((g, w, h) => {
    const f = drawFrame(g, w, h, { xlo: 0, xhi: 1, ymax: 1.1 })
    const acc = cssVar('--accent')
    g.beginPath()
    g.moveTo(f.X(0), f.bottom)
    for (let i = 0; i <= 400; i++) {
      const t = i / 400
      g.lineTo(f.X(t), f.Y(rel(t)))
    }
    g.lineTo(f.X(1), f.bottom)
    g.closePath()
    g.fillStyle = withAlpha(acc, 0.18)
    g.fill()
    g.beginPath()
    for (let i = 0; i <= 400; i++) {
      const t = i / 400
      if (i) g.lineTo(f.X(t), f.Y(rel(t)))
      else g.moveTo(f.X(t), f.Y(rel(t)))
    }
    g.strokeStyle = acc
    g.lineWidth = 2.4
    g.stroke()
    drawMarker(g, f, mle, 'θ̂ MLE')
    g.fillStyle = cssVar('--warn')
    g.beginPath()
    g.arc(f.X(theta), f.Y(rel(theta)), 6, 0, Math.PI * 2)
    g.fill()
  })

  return (
    <Widget
      title="หา MLE จากกราฟ likelihood"
      hint="ตั้งข้อมูล (สำเร็จ k จาก n ครั้ง) แล้วเลื่อน θ (จุดสีส้ม) ไปหาจุดที่ L(θ) สูงที่สุด นั่นคือค่า θ ที่ทำให้ข้อมูลที่เห็น “น่าเกิดที่สุด” สังเกตว่ายอดอยู่ที่ k/n เสมอ และกราฟแคบลงเมื่อ n ใหญ่ขึ้น (มั่นใจมากขึ้น)"
    >
      <Controls>
        <Slider label="n (จำนวนครั้ง)" value={n} min={1} max={200} step={1} onChange={setN} />
        <Slider label="k (จำนวนที่สำเร็จ)" value={k} min={0} max={n} step={1} onChange={setK} />
        <Slider label="θ ที่ลองเดา" value={theta} min={0} max={1} step={0.01} onChange={setTheta} />
      </Controls>
      <PlotCanvas canvasRef={ref} label="กราฟ likelihood ของ θ" />
      <Readout>
        θ̂<sub>MLE</sub> = k/n = {k}/{n} = <b>{mle.toFixed(3)}</b> &nbsp;·&nbsp; ที่ θ = {theta.toFixed(2)}: L(θ)/L(θ̂) ={' '}
        <b>{rel(theta).toExponential(2)}</b>
        <br />
        <span className="small">
          กราฟนี้หารด้วยค่าสูงสุดให้ยอดเป็น 1 เพราะ L จริงเป็นตัวเลขเล็กมาก (คูณความน่าจะเป็นหลายตัว) ซึ่งเป็นเหตุผลหนึ่งที่ใช้ log-likelihood
        </span>
      </Readout>
    </Widget>
  )
}

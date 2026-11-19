import { useMemo, useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { fmt } from '../../lib/math'
import { cssVar, drawFrame } from '../../lib/plot'
import { mulberry32, newSeed } from '../../lib/random'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

const N = 5000
const PATHS = 3

/** Running average of coin flips for a few independent runs: all of them settle on p (LLN). */
export function LLNSimulator() {
  const [p, setP] = useState(0.5)
  const [seed, setSeed] = useState(newSeed)

  const paths = useMemo(
    () =>
      Array.from({ length: PATHS }, (_, k) => {
        const rand = mulberry32(seed + k * 7919)
        const out = new Float64Array(N)
        let s = 0
        for (let i = 0; i < N; i++) {
          s += rand() < p ? 1 : 0
          out[i] = s / (i + 1)
        }
        return out
      }),
    [p, seed],
  )

  const ref = useCanvas((g, w, h) => {
    const xmax = Math.log10(N)
    const f = drawFrame(g, w, h, {
      xlo: 0,
      xhi: xmax,
      ymax: 1,
      xTicks: [0, 1, 2, 3, Math.log10(5000)],
      xLabel: (v) => String(Math.round(10 ** v)),
    })
    // true mean
    g.setLineDash([5, 4])
    g.strokeStyle = cssVar('--text')
    g.lineWidth = 1.3
    g.beginPath()
    g.moveTo(f.left, f.Y(p))
    g.lineTo(f.right, f.Y(p))
    g.stroke()
    g.setLineDash([])
    g.fillStyle = cssVar('--text')
    g.textAlign = 'right'
    g.textBaseline = 'bottom'
    g.fillText(`p = ${fmt(p)}`, f.right, f.Y(p) - 3)

    const colors = [cssVar('--accent'), cssVar('--ex'), cssVar('--tip')]
    paths.forEach((path, k) => {
      g.strokeStyle = colors[k]
      g.lineWidth = 1.8
      g.beginPath()
      for (let i = 0; i < N; i++) {
        const x = f.X(Math.log10(i + 1))
        const y = f.Y(path[i])
        if (i) g.lineTo(x, y)
        else g.moveTo(x, y)
      }
      g.stroke()
    })
  })

  return (
    <Widget
      title="กฎจำนวนมาก (LLN)"
      hint="โยนเหรียญที่ออกหัวด้วยโอกาส p ไปเรื่อยๆ แล้วพล็อต “สัดส่วนหัวสะสม” 3 รอบการทดลอง แกนนอนเป็นจำนวนครั้งที่โยน (สเกล log) ช่วงแรกเส้นแกว่งมาก แต่ยิ่งโยนเยอะยิ่งเข้าใกล้เส้นประ p"
    >
      <Controls>
        <Slider label="p (โอกาสออกหัว)" value={p} min={0.05} max={0.95} step={0.05} onChange={setP} />
      </Controls>
      <ButtonRow>
        <button onClick={() => setSeed(newSeed())}>🎲 สุ่มใหม่</button>
      </ButtonRow>
      <PlotCanvas canvasRef={ref} label="กราฟสัดส่วนหัวสะสมเทียบกับจำนวนครั้งที่โยน" />
      <Readout>
        หลังโยน 10 ครั้ง: {paths.map((x) => fmt(x[9])).join(', ')} &nbsp;·&nbsp; หลังโยน {N.toLocaleString()} ครั้ง:{' '}
        <b>{paths.map((x) => x[N - 1].toFixed(3)).join(', ')}</b>
        <br />
        <span className="small">ทั้ง 3 รอบเริ่มต่างกันมาก แต่จบใกล้ p เหมือนกันหมด นี่คือ X̄ₙ → μ เมื่อ n → ∞</span>
      </Readout>
    </Widget>
  )
}

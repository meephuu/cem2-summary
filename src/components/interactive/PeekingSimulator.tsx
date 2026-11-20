import { useMemo, useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { cssVar, drawFrame, withAlpha } from '../../lib/plot'
import { mulberry32, newSeed } from '../../lib/random'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

const SIMS = 200
const BASE = 0.1
const PER_DAY = 200
const Z = 1.96
const active = { borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 600 }

/** Many A/B tests run day by day; compare "stop as soon as |z| > 1.96" with "look once at the end". */
export function PeekingSimulator() {
  const [lift, setLift] = useState(0)
  const [days, setDays] = useState(30)
  const [seed, setSeed] = useState(newSeed)

  const sims = useMemo(() => {
    const rand = mulberry32(seed)
    const gauss = () => {
      const u = Math.max(rand(), 1e-12)
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
    }
    const draw = (p: number) => Math.max(0, Math.round(PER_DAY * p + Math.sqrt(PER_DAY * p * (1 - p)) * gauss()))
    return Array.from({ length: SIMS }, () => {
      let a = 0
      let b = 0
      let peekHit = false
      const zs: number[] = []
      for (let d = 1; d <= days; d++) {
        a += draw(BASE)
        b += draw(BASE + lift)
        const n = PER_DAY * d
        const pool = (a + b) / (2 * n)
        const se = Math.sqrt(pool * (1 - pool) * (2 / n))
        const z = se > 0 ? (b / n - a / n) / se : 0
        zs.push(z)
        if (Math.abs(z) > Z) peekHit = true
      }
      return { zs, peekHit, endHit: Math.abs(zs[zs.length - 1]) > Z }
    })
  }, [lift, days, seed])

  const peekRate = sims.filter((s) => s.peekHit).length / SIMS
  const endRate = sims.filter((s) => s.endHit).length / SIMS

  const ref = useCanvas((g, w, h) => {
    // y axis is z from −4 to 4: draw the frame for 0..8 and shift by 4
    const f = drawFrame(g, w, h, { xlo: 1, xhi: days, ymax: 8 })
    const YZ = (z: number) => f.Y(Math.max(-4, Math.min(4, z)) + 4)
    g.clearRect(0, 0, f.left - 2, f.bottom + 1)
    g.fillStyle = cssVar('--muted')
    g.font = '11px system-ui, sans-serif'
    g.textAlign = 'right'
    g.textBaseline = 'middle'
    for (const v of [-4, -2, 0, 2, 4]) g.fillText(String(v), f.left - 6, YZ(v))
    const ok = withAlpha(cssVar('--accent'), 0.22)
    const bad = withAlpha(cssVar('--warn'), 0.45)
    for (const s of sims) {
      g.beginPath()
      s.zs.forEach((z, i) => (i ? g.lineTo(f.X(i + 1), YZ(z)) : g.moveTo(f.X(1), YZ(z))))
      g.strokeStyle = s.peekHit ? bad : ok
      g.lineWidth = 1
      g.stroke()
    }
    g.setLineDash([5, 4])
    g.strokeStyle = cssVar('--text')
    g.lineWidth = 1.3
    for (const c of [Z, -Z]) {
      g.beginPath()
      g.moveTo(f.left, YZ(c))
      g.lineTo(f.right, YZ(c))
      g.stroke()
    }
    g.setLineDash([])
  })

  return (
    <Widget
      title="แอบดูผล (peeking) ทำให้ false positive พุ่ง"
      hint="จำลอง A/B test 200 ครั้ง กลุ่มละ 200 คนต่อวัน conversion rate เดิม 10% แต่ละเส้นคือค่า z ที่คำนวณจากข้อมูลสะสมถึงวันนั้น เส้นประคือ ±1.96 (α = 0.05 สองทาง) เส้นสีส้มคือการทดลองที่เคยข้ามเส้นประ “สักวัน” ถ้าแอบดูทุกวันแล้วหยุดทันทีที่ significant การทดลองเหล่านี้จะถูกสรุปว่า “มีผล” ทั้งหมด"
    >
      <ButtonRow>
        <button onClick={() => setLift(0)} style={lift === 0 ? active : undefined}>
          A/A: ไม่มีความต่างจริง
        </button>
        <button onClick={() => setLift(0.015)} style={lift !== 0 ? active : undefined}>
          มีความต่างจริง (+1.5 pp)
        </button>
        <button onClick={() => setSeed(newSeed())}>🎲 จำลองใหม่</button>
      </ButtonRow>
      <Controls>
        <Slider label="จำนวนวัน (= จำนวนครั้งที่แอบดู)" value={days} min={5} max={60} step={1} onChange={setDays} />
      </Controls>
      <PlotCanvas canvasRef={ref} label="ค่า z สะสมรายวันของการทดลอง 200 ครั้ง" height={300} />
      <Readout>
        แอบดูทุกวัน หยุดเมื่อ |z| &gt; 1.96: ปฏิเสธ H₀ <b>{(peekRate * 100).toFixed(1)}%</b> &nbsp;·&nbsp; ดูครั้งเดียวตอนจบ: ปฏิเสธ H₀{' '}
        <b>{(endRate * 100).toFixed(1)}%</b>
        <br />
        <span className="small">
          {lift === 0
            ? 'ไม่มีความต่างจริง ทุกการปฏิเสธคือ false positive ดูตอนจบจะได้ใกล้ 5% ตามสัญญา แต่การแอบดูทำให้สูงกว่านั้นหลายเท่า (สไลด์: 22.4% เทียบกับ 6.4%)'
            : 'มีความต่างจริง ทั้งสองแบบปฏิเสธ H₀ ได้เกือบหมด การแอบดูจึงไม่ได้ช่วยอะไร แต่ทำให้พังในกรณีที่ไม่มีผลจริง'}
        </span>
      </Readout>
    </Widget>
  )
}

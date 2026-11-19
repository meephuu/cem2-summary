import { useMemo, useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { fmt } from '../../lib/math'
import { cssVar, drawFrame } from '../../lib/plot'
import { mulberry32, newSeed } from '../../lib/random'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

const COUNT = 100
const LEVELS = [
  { label: '90%', z: 1.645 },
  { label: '95%', z: 1.96 },
  { label: '99%', z: 2.576 },
]

/** Run the same poll 100 times; each run gives an interval. About 95% of them catch the true p. */
export function ConfidenceIntervalSim() {
  const [p0, setP0] = useState(0.6)
  const [n, setN] = useState(100)
  const [level, setLevel] = useState(1)
  const [seed, setSeed] = useState(newSeed)
  const z = LEVELS[level].z

  const intervals = useMemo(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: COUNT }, () => {
      let s = 0
      for (let i = 0; i < n; i++) s += rand() < p0 ? 1 : 0
      const ph = s / n
      const m = z * Math.sqrt((ph * (1 - ph)) / n)
      return { ph, lo: ph - m, hi: ph + m, hit: ph - m <= p0 && p0 <= ph + m }
    })
  }, [p0, n, z, seed])
  const hits = intervals.filter((x) => x.hit).length

  const ref = useCanvas((g, w, h) => {
    const f = drawFrame(g, w, h, { xlo: 0, xhi: 1, ymax: COUNT + 1, xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1] })
    const acc = cssVar('--accent')
    const miss = cssVar('--warn')
    intervals.forEach((iv, i) => {
      const y = f.Y(i + 1)
      g.strokeStyle = iv.hit ? acc : miss
      g.lineWidth = iv.hit ? 1.4 : 2.2
      g.beginPath()
      g.moveTo(f.X(Math.max(0, iv.lo)), y)
      g.lineTo(f.X(Math.min(1, iv.hi)), y)
      g.stroke()
    })
    g.strokeStyle = cssVar('--text')
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.X(p0), f.top)
    g.lineTo(f.X(p0), f.bottom)
    g.stroke()
  })

  return (
    <Widget
      title="ความหมายของ Confidence Interval"
      hint="จำลองการทำโพลแบบเดิม 100 ครั้ง (ครั้งละ n คน) แต่ละครั้งได้ช่วง p̂ ± z·√(p̂(1−p̂)/n) หนึ่งเส้น เส้นตั้งสีดำคือค่าจริง p ที่ปกติเราไม่มีวันรู้ ช่วงสีส้มคือช่วงที่พลาด ไม่ครอบค่าจริง"
    >
      <Controls>
        <Slider label="p ค่าจริงของประชากร" value={p0} min={0.1} max={0.9} step={0.05} onChange={setP0} />
        <Slider label="n (คนต่อโพล)" value={n} min={10} max={1000} step={10} onChange={setN} />
      </Controls>
      <ButtonRow>
        {LEVELS.map((l, i) => (
          <button
            key={l.label}
            onClick={() => setLevel(i)}
            style={i === level ? { borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 600 } : undefined}
          >
            {l.label}
          </button>
        ))}
        <button onClick={() => setSeed(newSeed())}>🎲 ทำโพลใหม่ 100 ครั้ง</button>
      </ButtonRow>
      <PlotCanvas canvasRef={ref} label="ช่วงความเชื่อมั่น 100 ช่วงเทียบกับค่าจริง" height={360} />
      <Readout>
        ครอบค่าจริง p = {fmt(p0)} ได้ <b>{hits} จาก {COUNT} ช่วง</b> (คาดไว้ประมาณ {LEVELS[level].label}) &nbsp;·&nbsp;
        ความกว้างช่วงเฉลี่ย ≈ ±{(z * Math.sqrt((p0 * (1 - p0)) / n)).toFixed(3)}
        <br />
        <span className="small">n มากขึ้น ช่วงจะแคบลง ส่วนระดับความเชื่อมั่นสูงขึ้น ช่วงจะกว้างขึ้น แต่สัดส่วนที่ครอบค่าจริงยังคงที่ตามระดับที่เลือก</span>
      </Readout>
    </Widget>
  )
}

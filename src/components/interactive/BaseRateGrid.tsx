import { useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { cssVar, withAlpha } from '../../lib/plot'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

const TOTAL = 100

/** 100 drugs: how many "significant" results are real? (base rate fallacy) */
export function BaseRateGrid() {
  const [base, setBase] = useState(0.1)
  const [power, setPower] = useState(0.8)
  const [alpha, setAlpha] = useState(0.05)

  // expected counts (exact) for the readout
  const works = TOTAL * base
  const tp = works * power
  const fp = (TOTAL - works) * alpha
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0

  // rounded counts for the picture
  const W = Math.round(works)
  const TP = Math.min(W, Math.round(W * power))
  const FP = Math.min(TOTAL - W, Math.round((TOTAL - W) * alpha))

  const ref = useCanvas((g, w, h) => {
    g.clearRect(0, 0, w, h)
    const ok = cssVar('--ex')
    const bad = cssVar('--warn')
    const muted = cssVar('--muted')
    const cols = 20
    const rows = TOTAL / cols
    const cell = Math.min((w - 8) / cols, (h - 8) / rows)
    const ox = (w - cell * cols) / 2
    const oy = (h - cell * rows) / 2
    for (let i = 0; i < TOTAL; i++) {
      // order: works & detected, works & missed, false positive, true negative
      const kind = i < TP ? 'tp' : i < W ? 'fn' : i < W + FP ? 'fp' : 'tn'
      const x = ox + (i % cols) * cell + cell / 2
      const y = oy + Math.floor(i / cols) * cell + cell / 2
      const r = cell * 0.38
      g.beginPath()
      g.arc(x, y, r, 0, 2 * Math.PI)
      if (kind === 'tp') g.fillStyle = ok
      else if (kind === 'fp') g.fillStyle = bad
      else g.fillStyle = withAlpha(muted, kind === 'fn' ? 0.15 : 0.12)
      g.fill()
      if (kind === 'fn') {
        g.strokeStyle = ok
        g.lineWidth = 2
        g.stroke()
      }
    }
  })

  return (
    <Widget
      title="Base rate fallacy: ยา 100 ตัว"
      hint="แต่ละวงคือยาหนึ่งตัวที่นำไปทดสอบ วงเขียวทึบ = ยาที่ได้ผลจริงและการทดสอบจับได้ (true positive) วงขอบเขียว = ได้ผลจริงแต่ทดสอบพลาด (Type II) วงส้ม = ยาที่ไม่ได้ผลแต่ผลทดสอบออกมา significant (Type I) วงจาง = ไม่ได้ผลและทดสอบไม่ผ่าน ถ้า base rate ต่ำ วงส้มจะมีสัดส่วนสูงจนน่าตกใจ"
    >
      <Controls>
        <Slider label="base rate P(ยาได้ผลจริง)" value={base} min={0.01} max={0.5} step={0.01} onChange={setBase} />
        <Slider label="power" value={power} min={0.1} max={1} step={0.05} onChange={setPower} />
        <Slider label="α" value={alpha} min={0.01} max={0.2} step={0.01} onChange={setAlpha} />
      </Controls>
      <ButtonRow>
        <button
          onClick={() => {
            setBase(0.1)
            setPower(0.8)
            setAlpha(0.05)
          }}
        >
          ตัวอย่างในสไลด์ (0.1, 0.8, 0.05)
        </button>
        <button
          onClick={() => {
            setBase(1 / 16)
            setPower(0.8)
            setAlpha(0.01)
          }}
        >
          ข้อสอบ 2024 ข้อ 1.4 (1/16, 0.8, 0.01)
        </button>
      </ButtonRow>
      <PlotCanvas canvasRef={ref} label="ตารางยา 100 ตัว แยกตามผลจริงและผลทดสอบ" height={200} />
      <Readout>
        ได้ผลจริง {works.toFixed(1)} ตัว → จับได้ {tp.toFixed(2)} ตัว &nbsp;·&nbsp; ไม่ได้ผล {(TOTAL - works).toFixed(1)} ตัว → significant
        ผิดๆ {fp.toFixed(2)} ตัว
        <br />
        ในบรรดาผลที่ “significant” ทั้งหมด เป็นของจริงแค่ P(ได้ผล | significant) ={' '}
        <b>
          {tp.toFixed(2)}/({tp.toFixed(2)} + {fp.toFixed(2)}) = {(precision * 100).toFixed(1)}%
        </b>
      </Readout>
    </Widget>
  )
}

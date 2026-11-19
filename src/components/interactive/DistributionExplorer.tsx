import { useState } from 'react'
import { DISTRIBUTIONS, initialParams, type Distribution } from '../../lib/distributions'
import { useCanvas } from '../../lib/hooks'
import { fmt } from '../../lib/math'
import { cssVar, drawFrame, drawMarker, withAlpha } from '../../lib/plot'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

interface Props {
  /** id from DISTRIBUTIONS to show first */
  initial?: string
  /** restrict the menu to these ids */
  only?: string[]
}

/** Pick a distribution, move its parameters, see pmf/pdf (and optionally the CDF), mean and variance. */
export function DistributionExplorer({ initial = 'binomial', only }: Props) {
  const list = only ? DISTRIBUTIONS.filter((d) => only.includes(d.id)) : DISTRIBUTIONS
  const [dist, setDist] = useState<Distribution>(list.find((d) => d.id === initial) ?? list[0])
  const [raw, setRaw] = useState(() => initialParams(dist))
  const [showCdf, setShowCdf] = useState(false)

  const params = dist.kind === 'continuous' && dist.normalize ? dist.normalize(raw) : raw
  const mean = dist.mean(params)
  const variance = dist.variance(params)

  const ref = useCanvas((g, w, h) => {
    const acc = cssVar('--accent')
    const cdfColor = cssVar('--warn')
    if (dist.kind === 'discrete') {
      const ks = dist.support(params)
      const ps = ks.map((k) => dist.pmf(k, params))
      const xlo = ks[0] - 0.7
      const xhi = ks[ks.length - 1] + 0.7
      const every = Math.max(1, Math.ceil(ks.length / 14))
      const f = drawFrame(g, w, h, {
        xlo,
        xhi,
        ymax: Math.max(...ps) * 1.15,
        xTicks: ks.filter((_, i) => i % every === 0),
        rightAxis: showCdf,
      })
      const bw = Math.max(2, Math.min(30, (f.X(1) - f.X(0)) * 0.7))
      g.fillStyle = acc
      ks.forEach((k, i) => {
        const y = f.Y(ps[i])
        g.fillRect(f.X(k) - bw / 2, y, bw, f.bottom - y)
      })
      if (showCdf) {
        let c = 0
        g.strokeStyle = cdfColor
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(f.X(xlo), f.Yunit(0))
        ks.forEach((k, i) => {
          g.lineTo(f.X(k), f.Yunit(c))
          c += ps[i]
          g.lineTo(f.X(k), f.Yunit(c))
        })
        g.lineTo(f.X(xhi), f.Yunit(c))
        g.stroke()
      }
      drawMarker(g, f, mean, 'E[X]')
    } else {
      const [lo, hi] = dist.xRange
      const N = 500
      const xs = Array.from({ length: N + 1 }, (_, i) => lo + ((hi - lo) * i) / N)
      const ys = xs.map((x) => dist.pdf(x, params))
      const f = drawFrame(g, w, h, { xlo: lo, xhi: hi, ymax: Math.max(...ys) * 1.15, rightAxis: showCdf })
      g.beginPath()
      g.moveTo(f.X(lo), f.bottom)
      xs.forEach((x, i) => g.lineTo(f.X(x), f.Y(ys[i])))
      g.lineTo(f.X(hi), f.bottom)
      g.closePath()
      g.fillStyle = withAlpha(acc, 0.22)
      g.fill()
      g.beginPath()
      xs.forEach((x, i) => (i ? g.lineTo(f.X(x), f.Y(ys[i])) : g.moveTo(f.X(x), f.Y(ys[i]))))
      g.strokeStyle = acc
      g.lineWidth = 2.2
      g.stroke()
      if (showCdf) {
        g.beginPath()
        xs.forEach((x, i) => {
          const y = f.Yunit(dist.cdf(x, params))
          if (i) g.lineTo(f.X(x), y)
          else g.moveTo(f.X(x), y)
        })
        g.strokeStyle = cdfColor
        g.lineWidth = 2
        g.stroke()
      }
      drawMarker(g, f, mean, 'E[X]')
    }
  })

  return (
    <Widget
      title="Distribution Explorer"
      hint="เลือกการแจกแจงแล้วเลื่อนพารามิเตอร์ดูว่ารูปร่าง ค่าเฉลี่ย (เส้นประ) และ variance เปลี่ยนไปอย่างไร ติ๊ก “แสดง CDF” เพื่อดูเส้นสะสมควบคู่ (แกนขวา 0–1)"
    >
      <ButtonRow>
        <select
          aria-label="เลือกการแจกแจง"
          value={dist.id}
          onChange={(e) => {
            const d = list.find((x) => x.id === e.target.value)!
            setDist(d)
            setRaw(initialParams(d))
          }}
        >
          {list.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <label>
          <input type="checkbox" checked={showCdf} onChange={(e) => setShowCdf(e.target.checked)} /> แสดง CDF
        </label>
      </ButtonRow>
      <Controls>
        {dist.params.map((p) => (
          <Slider
            key={dist.id + p.key}
            label={p.label}
            value={params[p.key]}
            min={p.min}
            max={p.max}
            step={p.step}
            onChange={(v) => setRaw((r) => ({ ...r, [p.key]: v }))}
          />
        ))}
      </Controls>
      <PlotCanvas canvasRef={ref} label={`กราฟของ ${dist.name}`} />
      <Readout>
        <b>E[X]</b> = {fmt(mean)} &nbsp;·&nbsp; <b>Var(X)</b> = {fmt(variance)} &nbsp;·&nbsp; <b>SD</b> ={' '}
        {fmt(Math.sqrt(variance))}
        <br />
        <span className="small">{dist.note}</span>
      </Readout>
    </Widget>
  )
}

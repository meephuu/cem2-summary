import { useState } from 'react'
import { Slider } from './Slider'
import { Controls, Readout, Widget } from './Widget'
import styles from './MAPExplorer.module.css'

const TYPES = [
  { name: 'A (ง่าย)', p: 0.8, prior: 0.4 },
  { name: 'B (กลาง)', p: 0.5, prior: 0.4 },
  { name: 'C (ยาก)', p: 0.4, prior: 0.2 },
]

function choose(n: number, k: number) {
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return r
}

/** The acorn example from the slides: posterior ∝ likelihood × prior over three possible p. */
export function MAPExplorer() {
  const [priors, setPriors] = useState(TYPES.map((t) => t.prior))
  const [n, setN] = useState(5)
  const [kRaw, setK] = useState(2)
  const k = Math.min(kRaw, n)

  const total = priors.reduce((a, b) => a + b, 0) || 1
  const prior = priors.map((x) => x / total)
  const like = TYPES.map((t) => choose(n, k) * t.p ** k * (1 - t.p) ** (n - k))
  const joint = like.map((l, i) => l * prior[i])
  const evidence = joint.reduce((a, b) => a + b, 0)
  const post = joint.map((j) => (evidence ? j / evidence : 0))
  const mapI = post.indexOf(Math.max(...post))
  const mleI = like.indexOf(Math.max(...like))
  const predictive = TYPES.reduce((a, t, i) => a + t.p * post[i], 0)

  return (
    <Widget
      title="MAP: จุดซ่อนลูกโอ๊กของ Boss"
      hint="ตั้ง prior (นิสัยการซ่อนของ Boss) และผลการค้นหา แล้วดูว่า posterior เปลี่ยนไปอย่างไร ค่า prior จะถูกปรับให้รวมเป็น 1 อัตโนมัติ ลองตั้ง prior ของ A เป็น 1 ที่เหลือเป็น 0 (ตัวอย่างที่ 5) แล้วดูว่าข้อมูลแทบไม่มีผลเลย"
    >
      <Controls>
        {TYPES.map((t, i) => (
          <Slider
            key={t.name}
            label={`prior ${t.name}`}
            value={priors[i]}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => setPriors((ps) => ps.map((x, j) => (j === i ? v : x)))}
          />
        ))}
        <Slider label="ค้นทั้งหมด n ครั้ง" value={n} min={1} max={30} step={1} onChange={setN} />
        <Slider label="เจอลูกโอ๊ก k ครั้ง" value={k} min={0} max={n} step={1} onChange={setK} />
      </Controls>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ประเภทจุด</th>
              <th>p</th>
              <th>prior P(θ)</th>
              <th>likelihood P(D|θ)</th>
              <th>posterior P(θ|D)</th>
            </tr>
          </thead>
          <tbody>
            {TYPES.map((t, i) => (
              <tr key={t.name} className={i === mapI ? styles.best : undefined}>
                <td>
                  {t.name}
                  {i === mapI && <span className={styles.tag}>MAP</span>}
                  {i === mleI && <span className={`${styles.tag} ${styles.mle}`}>MLE*</span>}
                </td>
                <td>{t.p}</td>
                <td>
                  <Bar value={prior[i]} muted />
                </td>
                <td>{like[i].toFixed(4)}</td>
                <td>
                  <Bar value={post[i]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Readout>
        P(D) = Σ likelihood × prior = <b>{evidence.toFixed(4)}</b> &nbsp;·&nbsp; θ̂<sub>MAP</sub> ={' '}
        <b>{TYPES[mapI].p}</b> &nbsp;·&nbsp; MLE แบบต่อเนื่อง k/n = <b>{(k / n).toFixed(2)}</b>
        <br />
        โอกาสเจอลูกโอ๊กในการค้นครั้งถัดไป = Σ p × posterior = <b>{predictive.toFixed(4)}</b>
        <br />
        <span className="small">MLE* = ประเภทที่ likelihood สูงสุดเมื่อไม่สน prior</span>
      </Readout>
    </Widget>
  )
}

function Bar({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <div className={styles.barCell}>
      <div className={`${styles.bar} ${muted ? styles.muted : ''}`} style={{ width: `${value * 100}%` }} />
      <span>{value.toFixed(3)}</span>
    </div>
  )
}

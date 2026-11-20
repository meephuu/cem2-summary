import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAutoHideScrollbar } from '../../lib/hooks'
import { chi2Cdf, invertCdf, normalCdf, tCdf } from '../../lib/math'
import styles from './DistTablesPanel.module.css'

type Tab = 'z' | 't' | 'chi2' | 'common'
const TABS: { id: Tab; label: string }[] = [
  { id: 'z', label: 'Z (Φ)' },
  { id: 't', label: 't' },
  { id: 'chi2', label: 'χ²' },
  { id: 'common', label: 'ค่าที่ใช้บ่อย' },
]
const STORE_KEY = 'cem2:dist-tab'

function loadTab(): Tab {
  try {
    const v = localStorage.getItem(STORE_KEY)
    if (v && TABS.some((t) => t.id === v)) return v as Tab
  } catch {
    /* storage blocked: use default */
  }
  return 'z'
}

/** Floating button (bottom right) that opens the z / t / χ² tables. */
export function DistTablesPanel() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>(loadTab)
  const bodyRef = useRef<HTMLDivElement>(null)
  useAutoHideScrollbar(bodyRef)

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, tab)
    } catch {
      /* ignore */
    }
    bodyRef.current?.scrollTo({ top: 0 })
  }, [tab])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`} onClick={() => setOpen(false)} aria-hidden />
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-label="ตารางการแจกแจง"
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.title}>ตารางการแจกแจง</span>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="ปิด">
              ✕
            </button>
          </div>
          <div className={styles.tabs} role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === tab}
                className={t.id === tab ? styles.tabActive : undefined}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.body} ref={bodyRef}>
          {open && (tab === 'z' ? <ZTab /> : tab === 't' ? <TTab /> : tab === 'chi2' ? <Chi2Tab /> : <CommonTab />)}
        </div>
      </div>
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'ปิดตารางการแจกแจง' : 'เปิดตารางการแจกแจง'}
      >
        <span className={styles.fabIcon} aria-hidden>
          {open ? '✕' : <TableIcon />}
        </span>
        <span className={styles.fabLabel}>ตาราง z / t / χ²</span>
      </button>
    </>
  )
}

function TableIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 10h18M3 15h18M9 4v16" />
    </svg>
  )
}

/* ---------------- shared bits ---------------- */

function Note({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>
}

function NumInput({ label, value, onChange, step = 0.01, min, max }: {
  label: ReactNode
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === '' ? NaN : +e.target.value)}
      />
    </label>
  )
}

const f4 = (v: number) => (Number.isFinite(v) ? (v < 0.0001 ? '< 0.0001' : v.toFixed(4)) : '–')

/** Table with row/column highlight on hover. */
function Grid({ corner, cols, colsSub, rows }: {
  corner: ReactNode
  cols: ReactNode[]
  colsSub?: ReactNode[]
  rows: { label: ReactNode; cells: string[]; strong?: boolean }[]
}) {
  const [hover, setHover] = useState<[number, number] | null>(null)
  return (
    <div className={styles.gridWrap}>
      <table className={styles.grid} onMouseLeave={() => setHover(null)}>
        <thead>
          <tr>
            <th className={styles.corner} rowSpan={colsSub ? 2 : 1}>
              {corner}
            </th>
            {cols.map((c, j) => (
              <th key={j} className={hover?.[1] === j ? styles.hl : undefined}>
                {c}
              </th>
            ))}
          </tr>
          {colsSub && (
            <tr className={styles.subHead}>
              {colsSub.map((c, j) => (
                <th key={j} className={hover?.[1] === j ? styles.hl : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={r.strong ? styles.strongRow : undefined}>
              <th className={hover?.[0] === i ? styles.hl : undefined}>{r.label}</th>
              {r.cells.map((v, j) => (
                <td
                  key={j}
                  onMouseEnter={() => setHover([i, j])}
                  className={
                    hover && hover[0] === i && hover[1] === j
                      ? styles.cellHit
                      : hover && (hover[0] === i || hover[1] === j)
                        ? styles.cellLine
                        : undefined
                  }
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------------- Z ---------------- */

function ZTab() {
  const [neg, setNeg] = useState(false)
  const [z, setZ] = useState(1.96)
  const [a, setA] = useState(0.05)
  const rows = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => {
        const base = i / 10
        return {
          label: (neg ? '−' : '') + base.toFixed(1),
          cells: Array.from({ length: 10 }, (_, j) => {
            const v = base + j / 100
            return normalCdf(neg ? -v : v).toFixed(4)
          }),
        }
      }),
    [neg],
  )
  const zA = invertCdf(normalCdf, 1 - a)
  const zA2 = invertCdf(normalCdf, 1 - a / 2)
  return (
    <>
      <Note>
        ค่าในตาราง = <b>Φ(z) = P(Z ≤ z)</b> พื้นที่ทาง<b>ซ้าย</b>ของ z · แถว = หลักหน่วยกับทศนิยมตำแหน่งแรก, คอลัมน์ = ทศนิยมตำแหน่งที่สอง
        (เช่น z = 1.96 → แถว 1.9 คอลัมน์ .06) · หางขวา P(Z &gt; z) = 1 − Φ(z) · Φ(−z) = 1 − Φ(z)
      </Note>
      <div className={styles.calc}>
        <NumInput label="z" value={z} onChange={setZ} />
        <span>
          Φ(z) = <b>{f4(normalCdf(z))}</b> · P(Z &gt; z) = <b>{f4(1 - normalCdf(z))}</b> · สองทาง 2P(Z &gt; |z|) ={' '}
          <b>{f4(2 * (1 - normalCdf(Math.abs(z))))}</b>
        </span>
      </div>
      <div className={styles.calc}>
        <NumInput label="α" value={a} onChange={setA} step={0.005} min={0.0001} max={0.5} />
        <span>
          {a > 0 && a < 1 ? (
            <>
              หางเดียว z<sub>α</sub> = <b>{zA.toFixed(3)}</b> · สองทาง z<sub>α/2</sub> = <b>±{zA2.toFixed(3)}</b>
            </>
          ) : (
            'ใส่ α ระหว่าง 0 ถึง 1'
          )}
        </span>
      </div>
      <div className={styles.toggle}>
        <button className={!neg ? styles.tabActive : undefined} onClick={() => setNeg(false)}>
          z ≥ 0
        </button>
        <button className={neg ? styles.tabActive : undefined} onClick={() => setNeg(true)}>
          z ≤ 0
        </button>
      </div>
      <Grid
        corner="z"
        cols={Array.from({ length: 10 }, (_, j) => `.0${j}`)}
        rows={rows}
      />
    </>
  )
}

/* ---------------- t ---------------- */

const T_ALPHAS = [0.1, 0.05, 0.025, 0.01, 0.005, 0.001, 0.0005]
const T_DFS = [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 60, 120, Infinity]

function TTab() {
  const [t, setT] = useState(2.2)
  const [df, setDf] = useState(8)
  const rows = useMemo(
    () =>
      T_DFS.map((d) => ({
        label: Number.isFinite(d) ? String(d) : '∞',
        strong: !Number.isFinite(d),
        cells: T_ALPHAS.map((a) =>
          (Number.isFinite(d) ? invertCdf((x) => tCdf(x, d), 1 - a, 0, 700) : invertCdf(normalCdf, 1 - a, 0, 10)).toFixed(3),
        ),
      })),
    [],
  )
  const ok = Number.isFinite(t) && df >= 1
  const p1 = ok ? 1 - tCdf(t, df) : NaN
  return (
    <>
      <Note>
        ค่าในตาราง = <b>t<sub>α, df</sub></b> ที่ทำให้ P(T &gt; t) = α (พื้นที่<b>หางขวา</b>) · ทดสอบสองทางที่ระดับ α ให้ดูคอลัมน์ α/2
        (แถวล่างของหัวตาราง) · แถว <b>∞ = ค่า z</b> · df ไม่มีในตาราง ใช้แถวที่ df น้อยกว่า
      </Note>
      <div className={styles.calc}>
        <NumInput label="t" value={t} onChange={setT} />
        <NumInput label="df" value={df} onChange={(v) => setDf(Math.max(1, Math.round(v)))} step={1} min={1} />
        <span>
          P(T &gt; t) = <b>{f4(p1)}</b> · P(T &lt; t) = <b>{f4(1 - p1)}</b> · สองทาง ={' '}
          <b>{f4(ok ? 2 * (1 - tCdf(Math.abs(t), df)) : NaN)}</b>
        </span>
      </div>
      <Grid
        corner="df"
        cols={T_ALPHAS.map((a) => `${a}`)}
        colsSub={T_ALPHAS.map((a) => `${+(2 * a).toFixed(4)}`)}
        rows={rows}
      />
      <Note>
        หัวบน = α หางเดียว · หัวล่าง (สีจาง) = α สองทาง · ⚠️ ตาราง t ท้ายข้อสอบปี 2024 หัวคอลัมน์ที่ 3 เป็นต้นไปพิมพ์เลื่อน (คอลัมน์ “0.01”
        จริงๆ คือ 0.025) เทียบกับแถว ∞ ทุกครั้ง · ค่าในตารางนี้คำนวณจริง อาจต่างจากตารางข้อสอบที่ทศนิยมตำแหน่งที่ 3 (ปัดต่างกัน)
      </Note>
    </>
  )
}

/* ---------------- χ² ---------------- */

const C_ALPHAS = [0.1, 0.05, 0.025, 0.01, 0.005]
const C_DFS = Array.from({ length: 30 }, (_, i) => i + 1)

function Chi2Tab() {
  const [x, setX] = useState(4.45)
  const [df, setDf] = useState(1)
  const rows = useMemo(
    () =>
      C_DFS.map((d) => ({
        label: String(d),
        cells: C_ALPHAS.map((a) => invertCdf((v) => chi2Cdf(v, d), 1 - a, 0, 200).toFixed(3)),
      })),
    [],
  )
  return (
    <>
      <Note>
        ค่าในตาราง = <b>χ²<sub>α, df</sub></b> ที่ทำให้ P(χ² &gt; ค่านี้) = α (หางขวา) · χ² test ปฏิเสธ H₀ เมื่อค่าที่คำนวณได้<b>มากกว่า</b>ค่าในตาราง ·
        goodness of fit ใช้ df = k − 1 · McNemar ใช้ df = 1
      </Note>
      <div className={styles.calc}>
        <NumInput label="χ²" value={x} onChange={setX} />
        <NumInput label="df" value={df} onChange={(v) => setDf(Math.max(1, Math.round(v)))} step={1} min={1} />
        <span>
          p = P(χ² &gt; x) = <b>{f4(Number.isFinite(x) && df >= 1 ? 1 - chi2Cdf(x, df) : NaN)}</b>
        </span>
      </div>
      <Grid corner="df" cols={C_ALPHAS.map((a) => `${a}`)} rows={rows} />
    </>
  )
}

/* ---------------- common values ---------------- */

function CommonTab() {
  const zRows = [0.1, 0.05, 0.01].map((a) => ({
    label: `α = ${a}`,
    cells: [invertCdf(normalCdf, 1 - a).toFixed(3), '±' + invertCdf(normalCdf, 1 - a / 2).toFixed(3)],
  }))
  return (
    <>
      <Note>critical value ของ z ที่ใช้บ่อยที่สุด (จำไว้ใช้ทั้ง z-test, two-proportion z และ t ที่ df ใหญ่)</Note>
      <Grid corner="" cols={['หางเดียว z_α', 'สองทาง ±z_α/2']} rows={zRows} />
      <Note>
        <b>กฎ 68–95–99.7:</b> P(|Z| ≤ 1) ≈ 0.683 · P(|Z| ≤ 2) ≈ 0.954 · P(|Z| ≤ 3) ≈ 0.997
      </Note>
      <Grid
        corner="z"
        cols={['Φ(z)', 'หางขวา 1 − Φ(z)']}
        rows={[1, 1.282, 1.645, 1.96, 2, 2.326, 2.576, 3].map((z) => ({
          label: String(z),
          cells: [normalCdf(z).toFixed(4), (1 - normalCdf(z)).toFixed(4)],
        }))}
      />
      <Note>
        <b>สรุปการใช้:</b> one-sided ขวา → ปฏิเสธเมื่อ stat &gt; ค่าในตาราง · one-sided ซ้าย → stat &lt; −ค่าในตาราง · two-sided → |stat| &gt; ค่าที่คอลัมน์ α/2
      </Note>
    </>
  )
}

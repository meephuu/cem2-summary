import styles from './Diagram.module.css'

/** How the common distributions relate (from the slide), plus the Binomial → Poisson limit as an extra. */
export function DistributionRelations() {
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox="0 0 700 250" role="img" aria-label="แผนภาพความสัมพันธ์ระหว่างการแจกแจง">
        <defs>
          <marker id="dr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path className={styles.head} d="M0,0 L10,5 L0,10 z" />
          </marker>
        </defs>
        <Node x={10} y={105} label="Bernoulli" />
        <Node x={270} y={20} label="Binomial" />
        <Node x={270} y={190} label="Geometric" />
        <Node x={530} y={20} label="Poisson" />
        <Node x={530} y={190} label="Exponential" />

        <path className={styles.edge} d="M140,118 L268,50" markerEnd="url(#dr-arrow)" />
        <Label x={160} y={52} lines={['ทำซ้ำ n ครั้ง', 'นับจำนวนที่สำเร็จ']} />
        <path className={styles.edge} d="M140,136 L268,204" markerEnd="url(#dr-arrow)" />
        <Label x={190} y={196} lines={['ทำจนกว่าจะสำเร็จ']} />
        <path className={styles.edge} d="M410,212 L528,212" markerEnd="url(#dr-arrow)" />
        <Label x={470} y={202} lines={['เวอร์ชันต่อเนื่อง']} />
        <path className={styles.edge} d="M600,66 L600,188" markerEnd="url(#dr-arrow)" markerStart="url(#dr-arrow)" />
        <Label x={545} y={122} lines={['นับจำนวน', 'เหตุการณ์']} />
        <Label x={658} y={122} lines={['เวลารอ', 'ระหว่างกัน']} />
        <path className={styles.edge} d="M410,42 L528,42" markerEnd="url(#dr-arrow)" strokeDasharray="4 4" />
        <Label x={470} y={32} lines={['n ใหญ่, p เล็ก']} />
      </svg>
      <figcaption className="small">
        เส้นประ (Binomial → Poisson เมื่อ n ใหญ่ p เล็ก โดย np = λ) เป็นความรู้เสริม ไม่ได้อยู่ในสไลด์
      </figcaption>
    </figure>
  )
}

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  const w = x === 10 ? 130 : 140
  return (
    <g>
      <rect className={styles.node} x={x} y={y} width={w} height={44} rx={10} />
      <text className={styles.nodeText} x={x + w / 2} y={y + 27}>
        {label}
      </text>
    </g>
  )
}

function Label({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return (
    <>
      {lines.map((t, i) => (
        <text key={t} className={styles.label} x={x} y={y + i * 16}>
          {t}
        </text>
      ))}
    </>
  )
}

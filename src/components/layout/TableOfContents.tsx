import type { Heading } from '../../lib/hooks'
import { useActiveHeading } from '../../lib/hooks'
import styles from './TableOfContents.module.css'

interface Props {
  headings: Heading[]
  onPick?: () => void
}

/** "ในบทนี้": the current chapter's sections, highlighting the one on screen. */
export function TableOfContents({ headings, onPick }: Props) {
  const active = useActiveHeading(headings)
  if (!headings.length) return null
  return (
    <nav aria-label="หัวข้อในบทนี้" className={styles.toc}>
      <div className={styles.heading}>ในบทนี้</div>
      <ol className={styles.list}>
        {headings.map((h, i, all) => (
          <li key={h.id}>
            <button
              className={`${styles.link} ${active === h.id ? styles.active : ''}`}
              onClick={() => {
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
                onPick?.()
              }}
            >
              <span className={styles.num}>{h.label ?? all.slice(0, i + 1).filter((x) => !x.label).length}.</span> {h.text}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

import { CHAPTERS } from '../../chapters/registry'
import { navigate } from '../../lib/hooks'
import styles from './ChapterMenu.module.css'

interface Props {
  currentId: string
  onPick?: () => void
}

/** List of every chapter; chapters without content yet are shown but disabled. */
export function ChapterMenu({ currentId, onPick }: Props) {
  return (
    <nav aria-label="เลือกบท">
      <div className={styles.heading}>บทเรียน</div>
      <ul className={styles.list}>
        {CHAPTERS.map((c) => {
          const ready = Boolean(c.Content)
          const active = c.id === currentId
          return (
            <li key={c.id}>
              <button
                className={`${styles.item} ${active ? styles.active : ''}`}
                disabled={!ready && !active}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  navigate(c.id)
                  onPick?.()
                }}
              >
                <span className={styles.no}>{c.no}</span>
                <span className={styles.text}>
                  <span className={styles.title}>{c.subtitle}</span>
                  {!ready && <span className={styles.soon}>เร็วๆ นี้</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

import { useRef, useState, type ReactNode } from 'react'
import { chapterLabel, type Chapter } from '../../chapters/registry'
import { useAutoHideScrollbar, type Heading } from '../../lib/hooks'
import { ChapterMenu } from './ChapterMenu'
import { DistTablesPanel } from './DistTablesPanel'
import { ReadingProgress } from './ReadingProgress'
import { TableOfContents } from './TableOfContents'
import styles from './AppShell.module.css'

interface Props {
  chapter: Chapter
  headings: Heading[]
  children: ReactNode
}

/** Page layout: sidebar (chapter menu + TOC) on desktop, top bar with a drawer on mobile. */
export function AppShell({ chapter, headings, children }: Props) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const sidebarRef = useRef<HTMLElement>(null)
  useAutoHideScrollbar(sidebarRef)
  useAutoHideScrollbar('document')

  const sidebar = (
    <>
      <div className={styles.brandRow}>
        <div className={styles.brand}>สรุปสถิติ CEM II</div>
        <div className={styles.course}>2110203 COMP ENG MATH II · ไฟนอล</div>
      </div>
      <ChapterMenu currentId={chapter.id} onPick={close} />
      <TableOfContents headings={headings} onPick={close} />
    </>
  )

  return (
    <>
      <ReadingProgress />
      <div className={styles.topbar} data-topbar data-noprint>
        <button className={styles.menuButton} onClick={() => setOpen(true)} aria-label="เปิดเมนู">
          ☰
        </button>
        <span className={styles.topTitle}>
          {chapter.group === 'extra' ? chapter.subtitle : `${chapterLabel(chapter)} · ${chapter.subtitle}`}
        </span>
      </div>
      {open && <div className={styles.scrim} onClick={close} />}
      <div className={styles.layout}>
        <aside data-noprint ref={sidebarRef} className={`${styles.sidebar} ${open ? styles.open : ''}`}>{sidebar}</aside>
        <main className={styles.main}>{children}</main>
      </div>
      <div data-noprint>
        <DistTablesPanel />
      </div>
    </>
  )
}

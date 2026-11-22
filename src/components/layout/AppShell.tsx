import { useEffect, useRef, useState, type ReactNode } from 'react'
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

const COLLAPSED_KEY = 'cem2:sidebar-collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Page layout: sidebar (chapter menu + TOC) on desktop, top bar with a drawer on mobile.
 * On desktop the sidebar can be folded away; the choice is remembered in this browser.
 */
export function AppShell({ chapter, headings, children }: Props) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readCollapsed)
  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      /* storage unavailable: keep it for this visit only */
    }
  }, [collapsed])
  const close = () => setOpen(false)
  const sidebarRef = useRef<HTMLElement>(null)
  useAutoHideScrollbar(sidebarRef)
  useAutoHideScrollbar('document')

  const sidebar = (
    <>
      <div className={styles.brandRow}>
        <div>
          <div className={styles.brand}>สรุปสถิติ CEM II</div>
          <div className={styles.course}>2110203 COMP ENG MATH II · ไฟนอล</div>
        </div>
        <button
          className={styles.collapseButton}
          onClick={() => setCollapsed(true)}
          aria-label="ซ่อนแถบด้านข้าง"
          title="ซ่อนแถบด้านข้าง"
        >
          <PanelIcon />
        </button>
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
      {collapsed && (
        <button
          className={styles.expandButton}
          data-noprint
          onClick={() => setCollapsed(false)}
          aria-label="แสดงแถบด้านข้าง"
          title="แสดงแถบด้านข้าง"
        >
          <PanelIcon />
          <span>เมนู</span>
        </button>
      )}
      <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
        <aside data-noprint ref={sidebarRef} className={`${styles.sidebar} ${open ? styles.open : ''}`}>{sidebar}</aside>
        <main className={styles.main}>{children}</main>
      </div>
      <div data-noprint>
        <DistTablesPanel />
      </div>
    </>
  )
}

/** Sidebar-panel glyph used by both the hide and show buttons. */
function PanelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M9 4v16" />
    </svg>
  )
}

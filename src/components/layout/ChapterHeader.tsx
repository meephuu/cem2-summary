import { chapterLabel, type Chapter } from '../../chapters/registry'
import { CalloutLegend } from '../content/Callout'
import styles from './ChapterHeader.module.css'

export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return (
    <header className={styles.header}>
      <div className={styles.kicker}>{chapterLabel(chapter)}</div>
      <h1 className={styles.title}>{chapter.title}</h1>
      {chapter.group === 'extra' ? (
        <p className={styles.lead}>{chapter.blurb}</p>
      ) : (
        <>
          <p className={styles.lead}>
            สรุปจากสไลด์ <code>{chapter.source}</code> เขียนให้คนที่ไม่เคยเรียนมาก่อนอ่านเข้าใจได้
          </p>
          {chapter.Content && <CalloutLegend />}
        </>
      )}
    </header>
  )
}

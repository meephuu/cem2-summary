import styles from './DownloadPdfButton.module.css'

/** File built by scripts/cheatsheet-pdf.mjs in CI, served next to index.html. */
const PDF = './cem2-cheat-sheet.pdf'

/**
 * Cheat sheet only: downloads the ready-made A4 PDF (2 sheets, both sides).
 * Opened from disk there is no PDF beside the page, so fall back to the print dialog,
 * which produces the same layout (styles/cheatsheet.css).
 */
export function DownloadPdfButton() {
  return (
    <div className={styles.bar} data-noprint>
      <a
        className={styles.button}
        href={PDF}
        download
        onClick={(e) => {
          if (location.protocol === 'file:') {
            e.preventDefault()
            window.print()
          }
        }}
      >
        ⬇ ดาวน์โหลด PDF
      </a>
    </div>
  )
}

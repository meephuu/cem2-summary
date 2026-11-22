import styles from './PrintButton.module.css'

/** Cheat sheet only: prints the page as A4 (the print layout lives in styles/cheatsheet.css). */
export function PrintButton() {
  return (
    <div className={styles.bar} data-noprint>
      <button className={styles.button} onClick={() => window.print()}>
        🖨️ พิมพ์ / บันทึก PDF
      </button>
      <span className={styles.note}>
        ตอนพิมพ์จะจัดเป็น A4 สองคอลัมน์ ได้ 4 หน้า = 2 แผ่นหน้า-หลัง · ตั้งค่า: กระดาษ A4, Scale = Default (100%), เปิด
        “Background graphics” ถ้าอยากได้สีพื้นกล่อง
      </span>
    </div>
  )
}

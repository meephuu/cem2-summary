# สรุปสถิติ CEM II (ไฟนอล)

เว็บออนไลน์: https://meephuu.github.io/cem2-summary/

เว็บสรุปเนื้อหาสถิติของวิชา 2110203 COMP ENG MATH II เขียนด้วย React + Vite + MDX

## เปิดอ่านเลย (ไม่ต้องติดตั้งอะไร)

ดับเบิลคลิก `dist/index.html` ได้เลย ไฟล์นี้รวมทุกอย่างไว้ในไฟล์เดียว (ฟอนต์ Google Sans, สูตร KaTeX, กราฟ) จึงเปิดได้แม้ไม่มีเน็ต

## พัฒนาต่อ

ต้องมี Node.js 20 ขึ้นไป

```bash
npm install      # ครั้งแรกครั้งเดียว
npm run dev      # เปิดเซิร์ฟเวอร์ แก้ไฟล์แล้วหน้าเว็บอัปเดตทันที
npm run build    # สร้าง dist/index.html ใหม่
```

> สคริปต์ใน `package.json` เรียก `node node_modules/vite/bin/vite.js` ตรงๆ แทนคำสั่ง `vite`
> เพราะ node_modules ชุดแรกติดตั้งด้วย `--no-bin-links` ถ้าลบ node_modules แล้ว `npm install` ใหม่บน Windows ก็ใช้ได้เหมือนเดิม

## โครงสร้าง

```
src/
├── chapters/
│   ├── registry.ts              ← รายชื่อบททั้งหมด (เมนูเลือกบทอ่านจากที่นี่)
│   └── 00-probability/
│       └── content.mdx          ← เนื้อหาบท (Markdown + สูตร $...$ + component)
├── components/
│   ├── layout/                  ← AppShell, ChapterMenu, TableOfContents, ChapterHeader, ReadingProgress
│   ├── content/                 ← Callout (Def/Example/Warn/Tip), Solution, Compare, mdxComponents
│   ├── interactive/             ← Widget, Slider, DistributionExplorer, NormalArea
│   └── diagrams/                ← DistributionRelations
├── lib/                         ← math (erf, Φ, …), plot (วาดแกน canvas), hooks, distributions
└── styles/                      ← theme.css (สีทั้งหมด), fonts.css, global.css, prose.css
```

## เพิ่มบทใหม่

1. สร้าง `src/chapters/01-lln-clt/content.mdx`
2. ใน `src/chapters/registry.ts` เพิ่ม `Content: lazy(() => import('./01-lln-clt/content.mdx'))` ให้บทนั้น
3. หัวข้อ `##` จะกลายเป็นสารบัญด้านข้างและมีเลขให้อัตโนมัติ

## Component ที่ใช้ใน MDX ได้เลย (ไม่ต้อง import)

| Component | ใช้ทำอะไร |
|---|---|
| `<Def>` `<Example>` `<Warn>` `<Tip>` | กล่องนิยาม / ตัวอย่าง / ข้อควรระวัง / ทิปสอบ (ใส่ `title="..."` ได้) |
| `<Solution>` | วิธีทำแบบกดเปิด (`label="เฉลย"` เปลี่ยนข้อความได้) |
| `<Compare>` + `<CompareItem title>` | การ์ดเทียบสองฝั่ง |
| `<DistributionExplorer initial="normal" />` | กราฟการแจกแจงที่ปรับพารามิเตอร์ได้ |
| `<NormalArea />` | พื้นที่ใต้กราฟ Normal + ค่า z |
| `<DistributionRelations />` | แผนภาพความสัมพันธ์ของการแจกแจง |

เพิ่ม component ใหม่ที่ `src/components/...` แล้วลงทะเบียนใน `src/components/content/mdxComponents.ts`

ข้อควรระวังเวลาเขียน MDX: ข้อความที่มี `<` หรือ `{` นอกสูตรต้อง escape (`\<`) และเนื้อหาในกล่อง component ต้องเว้นบรรทัดว่างก่อนและหลัง

## Deploy (GitHub Pages)

ทุกครั้งที่ `git push` ขึ้น branch `main` GitHub Actions จะ build และอัปเดตเว็บให้เอง (`.github/workflows/deploy.yml`)
ดูสถานะได้ที่แท็บ **Actions** ของ repo ใช้เวลาประมาณ 1–2 นาที

```bash
git add .
git commit -m "เพิ่มบท ..."
git push
```

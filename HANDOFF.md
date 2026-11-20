# HANDOFF – สรุปสถิติ CEM II

อ่านไฟล์นี้ก่อนทำงานต่อในเซสชันใหม่ (สำหรับ Claude และเจ้าของโปรเจกต์)

## โปรเจกต์คืออะไร

เว็บสรุปเนื้อหาสถิติสำหรับสอบไฟนอลวิชา 2110203 COMP ENG MATH II (CEM II) ไฟนอลออกสัปดาห์ 11–15:
Probability recap, LLN/CLT, Sampling & Estimation, Hypothesis Testing, A/B Testing (Multi-arm bandits ไม่ออก)

- โฟลเดอร์ในเครื่อง: `D:\Work-Uni\year3\CEM2\summary-web`
- GitHub: https://github.com/meephuu/cem2-summary (public)
- เว็บ: https://meephuu.github.io/cem2-summary/ (deploy อัตโนมัติด้วย GitHub Actions ทุกครั้งที่ push `main`)
- สไลด์ต้นฉบับอยู่ใน claude.ai Project "CEM2" (`slide stat/*.pdf`, `past-exam-2024.pdf`, `final-exam-practice-problem.pdf`)

## สถานะบท

| # | id | บท | สไลด์ | สถานะ |
|---|---|---|---|---|
| 0 | `probability` | Probability Recap | 00_STATS_PROB_REVIEW | ✅ |
| 1 | `lln-clt` | LLN & CLT | 01A_LLN_CLT | ✅ |
| 2 | `estimation` | Sampling & Estimation | 01B_Estimation | ✅ |
| 3 | `testing` | Hypothesis Testing (รวม 3A+3B เป็นบทเดียวตามที่เจ้าของสั่ง) | 02_TESTING ทั้ง 82 หน้า | ✅ |
| 4 | `ab-testing` | A/B Testing | L03_ABtest | ✅ |

### บท 4 ทำแล้ว (บทสุดท้ายของไฟนอล)
widget บท 4: SampleSizeCalculator, PeekingSimulator · เดินตาม 6 ขั้นของสไลด์ + design journal ซองเมล็ดทานตะวัน · มีแนวคำตอบข้อสอบ 2024 ข้อ 6 และโจทย์ฝึก W1–W4
การบ้าน 12 ข้อที่ต้องส่ง (1, 2, 3, 9, 10) ไม่ได้เฉลยในเว็บ ใช้แค่ข้อแบบฝึกเสริม (5, 7, 8, 11)
ไอเดียถัดไป (ยังไม่ทำ): หน้า cheat sheet สำหรับจดโน้ต 2 แผ่น

### บท 3 ทำแล้ว (เดิมวางแผนแยก 3A/3B ด้านล่าง เจ้าของสั่งให้รวมเป็นบทใหญ่บทเดียว)
widget บท 3: PValueExplorer, RejectionPowerExplorer, BaseRateGrid · `lib/math.ts` มี tCdf/tPdf/betaInc/logGamma/invertCdf แล้ว
ข้อสังเกต: ตาราง t ท้ายข้อสอบ 2024 หัวคอลัมน์ที่ 3 เป็นต้นไปเลื่อน (ใส่ Warn ไว้ในบท 3 แล้ว)

#### เนื้อหาบท 3 ส่วนแรก
ทำไมต้องทดสอบ (ยา COVID A/B) · H₀/Hₐ · องค์ประกอบ NHST (test statistic, null distribution, rejection region, critical value, α, p-value, one/two-sided) · Type I/II, power · ขั้นตอนออกแบบ 6 ขั้น · Z-test · one-sample t · two-sample t (pooled, df n+m−2, ควิซ GCC vs Clang) · paired t · two-proportion z (ตัวอย่างยา p=0.396 / 0.102, เงื่อนไข ≥5) · เลือก α ตามต้นทุน (ช็อกโกแลต 0.1, ลายนิ้วมือ 0.01) · Cohen's d · ตัวอย่าง Instagram subtitles · Practice 1–3 (ส่วนสูง t=5.011, ข้าว z=1.988, ร้านอาหาร t=0.685)

#### เนื้อหาบท 3 ส่วนหลัง
p ใหญ่ = สรุปไม่ได้ (4 สาเหตุ) · misconceptions + edge cases (practical vs statistical significance) · p-hacking (xkcd) · base rate fallacy (ยา 100 ตัว) · low power · 2 fallacies · Bonferroni / Benjamini-Hochberg (+ตัวอย่าง 0.003…0.053) · χ² GoF, McNemar, Wilcoxon, Fisher transformation, Shapiro-Wilk/Levene, ANOVA/Welch · เลือก test (3 คำถาม, flowchart, Which test? 1–3) · causation, confounder, RCT · good practice

### ข้อสอบเน้นอะไร (จาก past exam 2024)
Testing เป็นหลัก: ตั้ง H₀/Hₐ → one/two-sided → เลือก test → critical value (ตาราง t แจกในห้อง, แถว ∞ = z) → สรุป ·
A/B test design เป็นข้อเขียน 10 คะแนน · MLE 1 ข้อ · ข้อสั้น: pdf/E[X], correlation, CI, base rate ·
สอบจดโน้ตเข้าได้ 2 แผ่น หน้า-หลัง (อาจทำหน้า cheat sheet ตอนท้าย)

## สไตล์การเขียน (เจ้าของชอบแบบนี้ ใช้เหมือนเดิมทุกบท)

- ดูตัวอย่างจากบทเก่าเสมอ เอามาทำสไตล์เดียวกัน
- ภาษาไทย อ่านง่าย คนไม่เคยเรียนก็เข้าใจ อธิบายสัญชาตญาณก่อนสูตร
- ทุกหัวข้อ `##` = หนึ่งส่วนใหญ่ (มีเลขและสารบัญอัตโนมัติ), ใช้ `###` แบ่งย่อย ห้ามใส่เลขเอง
- ใช้กล่อง: `<Def>` นิยาม · `<Example>` ตัวอย่าง (วิธีทำซ่อนใน `<Solution>`) · `<Warn>` จุดที่คนพลาด · `<Tip>` ทิปสอบ/สูตรสำเร็จ
- ใส่ตัวอย่างจากสไลด์ทุกตัวพร้อมเฉลย และโยงกับข้อสอบปีก่อนเมื่อเกี่ยวข้อง
- มี widget เล่นได้ 2–3 ตัวต่อบท
- ปิดบทด้วย `## สรุปสูตร + แบบฝึกหัด` (ตารางสูตร + แบบฝึกหัด 5 ข้อมีเฉลย + `<Tip title="บทต่อไป">`)
- ตัวอย่างที่ดีที่สุดให้ดู: `src/chapters/02-estimation/content.mdx`

## โครงสร้างโค้ด

React 19 + Vite + MDX (remark-math/rehype-katex render สูตรตอน build) + vite-plugin-singlefile → `dist/index.html` ไฟล์เดียว เปิดได้ offline

```
src/chapters/registry.ts          รายชื่อบท (เมนูอ่านจากที่นี่) เพิ่มบท = เพิ่ม Content: lazy(() => import(...))
src/chapters/NN-xxx/content.mdx   เนื้อหาแต่ละบท
src/components/content/           Callout (Def/Example/Warn/Tip), Solution, Compare/CompareItem, mdxComponents.ts (ลงทะเบียน component ให้ MDX)
src/components/interactive/       Widget/Controls/ButtonRow/Readout/PlotCanvas, Slider, DistributionExplorer, NormalArea,
                                  LLNSimulator, CLTSimulator, ConfidenceIntervalSim, InverseTransformDemo, LikelihoodExplorer, MAPExplorer
src/components/layout/            AppShell, ChapterMenu, TableOfContents, ReadingPosition (จำตำแหน่งอ่าน), ReadingProgress, StatIcon (ใช้แค่ favicon)
src/lib/                          math (erf, normalCdf, fmt…), plot (drawFrame, drawMarker, cssVar), hooks (useCanvas, routing),
                                  distributions, populations, random (mulberry32), readingPosition
src/styles/theme.css              สีทั้งหมด (dark mode พื้นหลังดำ #0a0b0d ตามที่เจ้าของขอ)
```

widget ใหม่: ใช้ `useCanvas` + `drawFrame` + `Widget` เหมือนตัวเดิม แล้วลงทะเบียนใน `mdxComponents.ts`

### ข้อควรระวัง MDX
- `<` และ `{ }` นอกสูตรต้อง escape (`\<`) หรือย้ายเข้าสูตร `$…$`
- เนื้อหาใน component ต้องเว้นบรรทัดว่างก่อน/หลัง และห้ามย่อหน้าด้วย space
- `title="…"` ของกล่องเป็น string ธรรมดา ห้ามมีสูตร `$`
- ในตาราง GFM ห้ามใช้ `|` ในสูตร ใช้ `\mid` หรือ `\lvert \rvert`
- `%` ในสูตรต้องเป็น `\%`
- เวอร์ชัน `katex` ต้องตรงกับที่ rehype-katex ใช้ (0.16.x) ไม่งั้นตัวห้อย/ตัวยกเพี้ยน

## วิธี build / ตรวจ / ส่งงาน (สำหรับ Claude)

1. เขียนไฟล์ลงโฟลเดอร์ในเครื่องผ่าน device tools (ขอสิทธิ์โฟลเดอร์ + สิทธิ์ลบ ให้ git ลบ lock file ได้)
2. ใน VM: `npm run typecheck` แล้ว `npm run build` (ถ้าไม่มีสิทธิ์ลบ ให้ `npm run build -- --outDir /tmp/out --emptyOutDir` แล้ว `cp` ทับ `dist/index.html`)
3. ตรวจ: stage `dist/index.html` มาเปิดด้วย Playwright (desktop 1280 + mobile 390) เช็ก `.katex-error` = 0, `scrollWidth` มือถือ = 390, ดูภาพ widget
4. Git (เจ้าของอยากให้ commit ในเครื่องก่อนแล้วค่อย push จะได้ไม่ต้อง pull):
   - commit ใน VM ด้วย author ของเจ้าของ: `git -c user.name="Phu" -c user.email="phu.anuntaworasakul@gmail.com" commit …` (ใส่บรรทัด Co-Authored-By ตาม attribution)
   - `git bundle create .git/x.bundle origin/main..main` → stage bundle → ใน container: clone/fetch repo (`add_repo` meephuu/cem2-summary, access push) → `git fetch bundle main:refs/bundle/main` → `git push origin refs/bundle/main:refs/heads/main`
   - ลบ bundle แล้ว `git fetch origin` ใน VM ให้ `main...origin/main` ตรงกัน
   - เช็ก deploy: `gh run list -R meephuu/cem2-summary -L 1`
5. scripts ใน package.json เรียก `node node_modules/vite/bin/vite.js` ตรงๆ (node_modules ติดตั้งจาก VM ด้วย `--no-bin-links --os=win32`) อย่าเปลี่ยนเป็น `vite` เฉยๆ

## สิ่งที่เจ้าของเคยบอก
- ไม่เอาไอคอนข้างชื่อเว็บ (ใช้แค่ favicon แว่นขยาย+กราฟแท่งสีฟ้า)
- ไอเดียที่พักไว้: ไฮไลท์ข้อความด้วยคลิกขวา (เก็บ localStorage, sync ข้ามเครื่องต้องมี backend เช่น Supabase) – ยังไม่ทำ

# CLAUDE.md – สรุปสถิติ CEM II (summary-web)

เว็บสรุปเนื้อหาสถิติสำหรับสอบไฟนอลวิชา **2110203 COMP ENG MATH II (CEM II)** ของ Meephu (Phu, วิศวะคอมฯ จุฬาฯ)
คุยกับเจ้าของเป็น**ภาษาไทย**เสมอ สถานะงานล่าสุดและแผนบทถัดไปอยู่ใน `HANDOFF.md` (อ่านคู่กัน)

- โฟลเดอร์ในเครื่อง: `D:\Work-Uni\year3\CEM2\summary-web` (โฟลเดอร์แม่ `D:\Work-Uni\year3\CEM2` มี `CLAUDE.md` อธิบายภาพรวมอีกไฟล์)
- GitHub: https://github.com/meephuu/cem2-summary (public) · เว็บ: https://meephuu.github.io/cem2-summary/
- Deploy: GitHub Actions (`.github/workflows/deploy.yml`) build แล้วขึ้น GitHub Pages ทุกครั้งที่ push `main`

## เอกสารต้นฉบับ (สไลด์ / ข้อสอบเก่า / การบ้าน) อยู่ที่ไหน

เนื้อหาทุกบท**ต้องอิงจากสไลด์จริง** ห้ามแต่งตัวอย่างหรือตัวเลขในสไลด์ขึ้นเอง ตัวอย่างเพิ่มเติมที่แต่งเองต้องคำนวณตรวจก่อนใส่

**ที่เก็บ 2 แห่ง (ไฟล์ชุดเดียวกัน):**
1. **ในเครื่อง** `D:\Work-Uni\year3\CEM2\slide stat\` – อ่านผ่าน device tools (`device_stage_files` แล้วเปิด PDF ดูเป็นภาพได้ เหมาะกับหน้าที่มีกราฟ/ตาราง)
2. **claude.ai Project "CEM2"** – โฟลเดอร์ `slide stat/…` อ่านด้วย Projects tool (`project_read` ได้ข้อความที่ extract แล้ว เร็วกว่า, `project_search` ค้นหา) ถ้าข้อความ extract ไม่พอ (รูป, สูตรเพี้ยน) ใช้ `original: true` หรือเปิดไฟล์ในเครื่องแทน

| ไฟล์ | เนื้อหา | ใช้ทำบท |
|---|---|---|
| `00_STATS_PROB_REVIEW_….pdf` | Probability recap | 0 |
| `01A_LLN_CLT_….pdf` | LLN, CLT, confidence interval | 1 |
| `01B_Estimation_….pdf` | Inverse transform sampling, MLE, MAP, Bayesian vs Frequentist | 2 |
| `02_TESTING_….pdf` (82 หน้า) | Hypothesis testing ทั้งหมด | 3A, 3B |
| `L03_ABtest-….pdf` | A/B testing in the wild | 4 (A/B) |
| `L04_MultiArm_bandits-….pdf` | Multi-armed bandits | **ไม่ออกไฟนอล** ไม่ต้องทำ |
| `past-exam-2024.pdf` | ข้อสอบไฟนอลปี 2024 (ข้อความ extract เริ่มหน้า 2/5) | ดูว่าข้อสอบเน้นอะไร, ทำทิป/แบบฝึกหัด |
| `final-exam-practice-problem.pdf` | โจทย์ฝึกข้อเขียน (A/B test โพสต์ Facebook, ร้านกาแฟ, ครูจับโค้ด AI) | บท Testing / A/B |
| `hw/CEM2-HW10.pdf/.docx` | การบ้าน 10: Prob & simulation | บท 0–2 |
| `hw/CEM2_Homework11_….pdf` + `CEM_II_Homework_11_…ipynb` | การบ้าน 11: Testing (+ คำตอบของเจ้าของ) | บท 3 |
| `hw/CEM2_Homework12_….pdf` | การบ้าน 12: A/B testing | บท A/B |

`D:\Work-Uni\year3\CEM2\not in final\` = งาน Optimization (assignment 3) **ไม่อยู่ในขอบเขตไฟนอล** ไม่ต้องใช้

**ขอบเขตไฟนอล:** สัปดาห์ 11–15 = Probability recap, CLT/LLN/Sampling/Estimation, Testing, A/B testing
**กติกาสอบ:** จดโน้ตเข้าห้องได้ 2 แผ่น หน้า-หลัง · แจกตาราง t (แถว ∞ = ค่า z)

**ข้อสอบปี 2024 เน้น:** Testing (ตั้ง H₀/Hₐ → one/two-sided → เลือก test → critical value → สรุป) 3–4 ข้อ ·
A/B test design ข้อเขียน 10 คะแนน · MLE 1 ข้อ (mixture เหรียญ+ลูกเต๋า) · ข้อสั้น: pdf/E[X], correlation, CI, base rate

## สไตล์เนื้อหา (ใช้เหมือนเดิมทุกบท – เปิดบทเก่าดูเป็นแบบก่อนเขียนเสมอ)

ตัวอย่างอ้างอิงที่ดีที่สุด: `src/chapters/02-estimation/content.mdx`

- ภาษาไทย อ่านง่าย คนไม่เคยเรียนก็เข้าใจ อธิบายสัญชาตญาณก่อนสูตร ศัพท์เทคนิคใส่อังกฤษในวงเล็บ
- ชื่อบท (title ใน `registry.ts`) เป็น**ภาษาอังกฤษ**
- `##` = ส่วนใหญ่ (มีเลขและสารบัญอัตโนมัติ ห้ามใส่เลขเอง) · `###` = หัวข้อย่อย
- กล่อง: `<Def>` นิยาม · `<Example>` ตัวอย่าง (วิธีทำซ่อนใน `<Solution>`) · `<Warn>` จุดที่คนพลาด · `<Tip>` ทิปสอบ/สูตรสำเร็จ · `<Compare>/<CompareItem>` เทียบสองฝั่ง
- ใส่ตัวอย่างจากสไลด์ครบพร้อมเฉลย และโยงข้อสอบปีก่อนเมื่อเกี่ยวข้อง
- widget เล่นได้ 2–3 ตัวต่อบท
- ปิดบทด้วย `## สรุปสูตร + แบบฝึกหัด` (ตารางสูตร, แบบฝึกหัด 5 ข้อมีเฉลย, `<Tip title="บทต่อไป">`)

## โค้ด

React 19 + Vite 8 + TypeScript + MDX (`remark-math` + `rehype-katex` render สูตรตอน build) + `vite-plugin-singlefile`
→ `dist/index.html` ไฟล์เดียว รวมฟอนต์ Google Sans (ไทย/อังกฤษ/กรีก) และ KaTeX เปิดได้ offline

```
src/chapters/registry.ts            รายชื่อบท + เมนู (เพิ่มบท: Content: lazy(() => import('./NN-xxx/content.mdx')))
src/chapters/NN-xxx/content.mdx     เนื้อหาแต่ละบท
src/components/content/             Callout(Def/Example/Warn/Tip), Solution, Compare, mdxComponents.ts ← ลงทะเบียน component ให้ MDX ที่นี่
src/components/interactive/         Widget/Controls/ButtonRow/Readout/PlotCanvas, Slider + widget ของแต่ละบท
src/components/layout/              AppShell, ChapterMenu, TableOfContents, ChapterHeader, ReadingPosition (จำตำแหน่งที่อ่าน), ReadingProgress
src/lib/                            math, plot (drawFrame/drawMarker/cssVar), hooks (useCanvas, hash routing), distributions, populations, random, readingPosition
src/styles/theme.css                สีทั้งหมด (light/dark; dark bg #0a0b0d)
```

widget ใหม่: ใช้ `useCanvas` + `drawFrame` + `<Widget>` แบบตัวเดิม แล้วลงทะเบียนใน `mdxComponents.ts`
routing เป็น hash (`#/lln-clt`) เพื่อให้เปิดไฟล์จากดิสก์ได้

### ข้อควรระวัง MDX
- `<` และ `{ }` นอกสูตรต้อง escape (`\<`) หรือใส่ในสูตร `$…$`
- เนื้อหาใน component เว้นบรรทัดว่างก่อน/หลัง ห้ามย่อหน้าด้วย space
- `title="…"` เป็น string ธรรมดา ห้ามมีสูตร
- ตาราง GFM: ห้ามมี `|` ในสูตร (ใช้ `\mid`, `\lvert…\rvert`) · `%` ในสูตรต้องเป็น `\%`
- `katex` ต้องเป็น 0.16.x ให้ตรงกับ rehype-katex ไม่งั้นตัวห้อย/ตัวยกเพี้ยน

## คำสั่ง

```bash
npm run dev        # dev server
npm run build      # สร้าง dist/index.html
npm run typecheck
```
scripts เรียก `node node_modules/vite/bin/vite.js` ตรงๆ เพราะ node_modules ติดตั้งจาก Linux VM ด้วย `--no-bin-links --os=win32` อย่าเปลี่ยนเป็น `vite`

## Workflow ของ Claude (สำคัญ)

1. **แก้ไฟล์ในเครื่องเจ้าของ** ผ่าน device tools (ขอสิทธิ์โฟลเดอร์ และ**สิทธิ์ลบ**ไว้ก่อน เพราะ git ต้องลบ lock file ของตัวเอง)
2. Build ใน VM: ถ้า unlink `dist/index.html` ไม่ได้ ใช้ `npm run build -- --outDir /tmp/out --emptyOutDir` แล้ว `cp` ทับ
3. **ตรวจก่อนส่ง:** stage `dist/index.html` มาเปิดด้วย Playwright (1280px + มือถือ 390px) → `.katex-error` = 0, `scrollWidth` มือถือ = 390, ดูภาพ widget, ตรวจตัวเลขเทียบสไลด์
4. **Git: commit ในเครื่องก่อน แล้วค่อย push** (เจ้าของไม่อยากต้อง pull)
   - commit ใน VM: `git -c user.name="Phu" -c user.email="phu.anuntaworasakul@gmail.com" commit …` + บรรทัด Co-Authored-By
   - commit เฉพาะไฟล์ที่ตัวเองแก้ ไฟล์ที่เจ้าของแก้ค้างไว้ (เช่น `HANDOFF.md`) อย่า commit ให้
   - `git bundle create .git/x.bundle origin/main..main` → stage → ใน container ใช้ `add_repo meephuu/cem2-summary` (access: push) แล้ว `git fetch <bundle> main:refs/bundle/main` + `git push origin refs/bundle/main:refs/heads/main`
   - ลบ bundle, `git fetch origin` ใน VM ให้ `main...origin/main` ตรงกัน, เช็ก `gh run list -R meephuu/cem2-summary -L 1`
5. สรุปให้เจ้าของสั้นๆ เป็นภาษาไทย

## สิ่งที่เจ้าของเคยตัดสินใจ
- ไม่เอาไอคอนข้างชื่อเว็บ (ไอคอนแว่นขยาย+กราฟแท่งใช้แค่ favicon)
- dark mode พื้นหลังดำ
- ไอเดียที่พักไว้: ไฮไลท์ข้อความด้วยคลิกขวา (localStorage; sync ข้ามเครื่องต้องมี backend) – ยังไม่ทำ

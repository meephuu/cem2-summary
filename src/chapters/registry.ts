import type { ComponentType, LazyExoticComponent } from 'react'
import type { MDXProps } from 'mdx/types'
import { lazy } from 'react'

export interface Chapter {
  /** used in the URL: #/<id> */
  id: string
  /** number shown in the menu ('C' for the cheat sheet) */
  no: number | string
  /** 'lesson' = regular chapter, 'extra' = pages in the second menu group (cheat sheet) */
  group?: 'lesson' | 'extra'
  title: string
  subtitle: string
  /** slide file the summary is based on */
  source: string
  /** what the chapter covers, one line */
  blurb: string
  /** undefined → not written yet (shown as "เร็วๆ นี้") */
  Content?: LazyExoticComponent<ComponentType<MDXProps>>
}

/**
 * All chapters in the final exam (weeks 11–15).
 * To add a chapter: create chapters/<folder>/content.mdx and set `Content` below.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: 'probability',
    no: 0,
    title: 'Probability Recap',
    subtitle: 'Probability Recap',
    source: '00_STATS_PROB_REVIEW',
    blurb: 'Bayes, pmf/pdf/cdf, E และ Var, Covariance, การแจกแจงยอดนิยม, Normal',
    Content: lazy(() => import('./00-probability/content.mdx')),
  },
  {
    id: 'lln-clt',
    no: 1,
    title: 'Law of Large Numbers & Central Limit Theorem',
    subtitle: 'LLN & CLT',
    source: '01A_LLN_CLT',
    blurb: 'LLN, CLT, confidence interval',
    Content: lazy(() => import('./01-lln-clt/content.mdx')),
  },
  {
    id: 'estimation',
    no: 2,
    title: 'Sampling & Estimation',
    subtitle: 'Sampling & Estimation',
    source: '01B_Estimation',
    blurb: 'Inverse transform sampling, MLE, MAP, Bayesian vs Frequentist',
    Content: lazy(() => import('./02-estimation/content.mdx')),
  },
  {
    id: 'testing',
    no: 3,
    title: 'Hypothesis Testing',
    subtitle: 'Hypothesis Testing',
    source: '02_TESTING',
    blurb: 'NHST, z/t-test, power, p-value, multiple testing, เลือก test',
    Content: lazy(() => import('./03-testing/content.mdx')),
  },
  {
    id: 'ab-testing',
    no: 4,
    title: 'A/B Testing',
    subtitle: 'A/B Testing in the Wild',
    source: 'L03_ABtest',
    blurb: 'Metric, การแบ่งกลุ่ม, MDE และขนาดตัวอย่าง, peeking, sanity check',
    Content: lazy(() => import('./04-ab-testing/content.mdx')),
  },
  {
    id: 'cheat-sheet',
    no: 'C',
    group: 'extra',
    title: 'Cheat Sheet',
    subtitle: 'Cheat Sheet',
    source: 'ทุกบท',
    blurb: 'สูตรและทิปสำคัญจากทุกบท สำหรับจดโน้ต 2 แผ่นเข้าห้องสอบ',
    Content: lazy(() => import('./cheat-sheet/content.mdx')),
  },
]

/** Header kicker: "บทที่ 3" for chapters, the menu group name for extra pages. */
export const chapterLabel = (c: Chapter) => (c.group === 'extra' ? 'ทบทวนก่อนสอบ' : `บทที่ ${c.no}`)

export const findChapter = (id: string) => CHAPTERS.find((c) => c.id === id)
export const firstReady = () => CHAPTERS.find((c) => c.Content)!

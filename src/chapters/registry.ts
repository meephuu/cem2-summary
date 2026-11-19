import type { ComponentType, LazyExoticComponent } from 'react'
import type { MDXProps } from 'mdx/types'
import { lazy } from 'react'

export interface Chapter {
  /** used in the URL: #/<id> */
  id: string
  /** number shown in the menu */
  no: number
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
    title: 'ทบทวนความน่าจะเป็น',
    subtitle: 'Probability Recap',
    source: '00_STATS_PROB_REVIEW',
    blurb: 'Bayes, pmf/pdf/cdf, E และ Var, Covariance, การแจกแจงยอดนิยม, Normal',
    Content: lazy(() => import('./00-probability/content.mdx')),
  },
  {
    id: 'lln-clt',
    no: 1,
    title: 'กฎจำนวนมากและทฤษฎีบทลิมิตกลาง',
    subtitle: 'LLN & CLT',
    source: '01A_LLN_CLT',
    blurb: 'LLN, CLT, confidence interval',
    Content: lazy(() => import('./01-lln-clt/content.mdx')),
  },
  {
    id: 'estimation',
    no: 2,
    title: 'การสุ่มตัวอย่างและการประมาณค่า',
    subtitle: 'Sampling & Estimation',
    source: '01B_Estimation',
    blurb: 'Inverse transform sampling, MLE, MAP, Bayesian vs Frequentist',
    Content: lazy(() => import('./02-estimation/content.mdx')),
  },
  {
    id: 'testing',
    no: 3,
    title: 'การทดสอบสมมติฐาน',
    subtitle: 'Hypothesis Testing',
    source: '02_TESTING',
    blurb: 'NHST, z/t-test, power, p-value, multiple testing',
  },
  {
    id: 'ab-testing',
    no: 4,
    title: 'A/B Testing',
    subtitle: 'A/B Testing in the Wild',
    source: 'L03_ABtest',
    blurb: 'Metric, การแบ่งกลุ่ม, stopping criteria, peeking, sanity check',
  },
]

export const findChapter = (id: string) => CHAPTERS.find((c) => c.id === id)
export const firstReady = () => CHAPTERS.find((c) => c.Content)!

import { logFactorial, normalCdf, normalPdf, range } from './math'

export interface Param {
  key: string
  label: string
  min: number
  max: number
  step: number
  initial: number
}

type P = Record<string, number>

interface Base {
  id: string
  name: string
  params: Param[]
  mean: (p: P) => number
  variance: (p: P) => number
  /** one-line intuition shown under the chart */
  note: string
}

export interface DiscreteDist extends Base {
  kind: 'discrete'
  support: (p: P) => number[]
  pmf: (k: number, p: P) => number
}

export interface ContinuousDist extends Base {
  kind: 'continuous'
  /** fixed x-axis so parameter changes are visible as movement */
  xRange: [number, number]
  pdf: (x: number, p: P) => number
  cdf: (x: number, p: P) => number
  /** fix invalid combinations, e.g. b must be > a */
  normalize?: (p: P) => P
}

export type Distribution = DiscreteDist | ContinuousDist

export const DISTRIBUTIONS: Distribution[] = [
  {
    id: 'bernoulli',
    name: 'Bernoulli(p)',
    kind: 'discrete',
    params: [{ key: 'p', label: 'p', min: 0.01, max: 0.99, step: 0.01, initial: 0.3 }],
    support: () => [0, 1],
    pmf: (k, { p }) => (k ? p : 1 - p),
    mean: ({ p }) => p,
    variance: ({ p }) => p * (1 - p),
    note: 'ทดลอง 1 ครั้ง: ได้ 1 (สำเร็จ) ด้วยโอกาส p และได้ 0 ด้วยโอกาส 1−p',
  },
  {
    id: 'binomial',
    name: 'Binomial(n, p)',
    kind: 'discrete',
    params: [
      { key: 'n', label: 'n (จำนวนครั้ง)', min: 1, max: 40, step: 1, initial: 10 },
      { key: 'p', label: 'p', min: 0.01, max: 0.99, step: 0.01, initial: 0.5 },
    ],
    support: ({ n }) => range(0, n),
    pmf: (k, { n, p }) =>
      Math.exp(logFactorial(n) - logFactorial(k) - logFactorial(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p)),
    mean: ({ n, p }) => n * p,
    variance: ({ n, p }) => n * p * (1 - p),
    note: 'นับจำนวนครั้งที่สำเร็จจาก n ครั้ง ถ้า p = 0.5 กราฟจะสมมาตร ส่วน p ที่เล็กหรือใหญ่จะทำให้เบ้',
  },
  {
    id: 'geometric',
    name: 'Geometric(p)',
    kind: 'discrete',
    params: [{ key: 'p', label: 'p', min: 0.05, max: 0.95, step: 0.01, initial: 0.3 }],
    support: ({ p }) => range(0, Math.min(40, Math.max(8, Math.ceil(Math.log(0.005) / Math.log(1 - p))))),
    pmf: (k, { p }) => (1 - p) ** k * p,
    mean: ({ p }) => (1 - p) / p,
    variance: ({ p }) => (1 - p) / (p * p),
    note: 'จำนวนครั้งที่ล้มเหลวก่อนสำเร็จครั้งแรก แท่งจะลดลงเป็นสัดส่วนคงที่ (1−p) ทุกขั้น',
  },
  {
    id: 'poisson',
    name: 'Poisson(λ)',
    kind: 'discrete',
    params: [{ key: 'l', label: 'λ (อัตราเฉลี่ย)', min: 0.5, max: 20, step: 0.1, initial: 4 }],
    support: ({ l }) => range(0, Math.max(10, Math.ceil(l + 4 * Math.sqrt(l) + 3))),
    pmf: (k, { l }) => Math.exp(k * Math.log(l) - l - logFactorial(k)),
    mean: ({ l }) => l,
    variance: ({ l }) => l,
    note: 'จำนวนเหตุการณ์ในช่วงเวลาหนึ่ง สังเกตว่า mean = variance = λ',
  },
  {
    id: 'uniform',
    name: 'Uniform(a, b) แบบต่อเนื่อง',
    kind: 'continuous',
    xRange: [-5, 9],
    params: [
      { key: 'a', label: 'a', min: -4, max: 4, step: 0.1, initial: 0 },
      { key: 'b', label: 'b', min: -3.9, max: 8, step: 0.1, initial: 3 },
    ],
    normalize: (p) => (p.b < p.a + 0.1 ? { ...p, b: +(p.a + 0.1).toFixed(1) } : p),
    pdf: (x, { a, b }) => (x >= a && x <= b ? 1 / (b - a) : 0),
    cdf: (x, { a, b }) => (x < a ? 0 : x > b ? 1 : (x - a) / (b - a)),
    mean: ({ a, b }) => (a + b) / 2,
    variance: ({ a, b }) => (b - a) ** 2 / 12,
    note: 'ความสูงเป็น 1/(b−a) เพื่อให้พื้นที่เท่ากับ 1 ช่วงแคบลงกราฟจึงสูงขึ้น (สูงเกิน 1 ได้!)',
  },
  {
    id: 'exponential',
    name: 'Exponential(λ)',
    kind: 'continuous',
    xRange: [0, 8],
    params: [{ key: 'l', label: 'λ (อัตรา)', min: 0.2, max: 3, step: 0.05, initial: 1 }],
    pdf: (x, { l }) => (x < 0 ? 0 : l * Math.exp(-l * x)),
    cdf: (x, { l }) => (x < 0 ? 0 : 1 - Math.exp(-l * x)),
    mean: ({ l }) => 1 / l,
    variance: ({ l }) => 1 / (l * l),
    note: 'เวลารอจนเหตุการณ์ถัดไป λ มากแปลว่าเหตุการณ์เกิดถี่ จึงรอสั้น (mean = 1/λ)',
  },
  {
    id: 'normal',
    name: 'Normal(μ, σ²)',
    kind: 'continuous',
    xRange: [-10, 10],
    params: [
      { key: 'mu', label: 'μ', min: -5, max: 5, step: 0.1, initial: 0 },
      { key: 'sd', label: 'σ', min: 0.3, max: 4, step: 0.1, initial: 1 },
    ],
    pdf: (x, { mu, sd }) => normalPdf(x, mu, sd),
    cdf: (x, { mu, sd }) => normalCdf((x - mu) / sd),
    mean: ({ mu }) => mu,
    variance: ({ sd }) => sd * sd,
    note: 'σ มากขึ้น กราฟจะกว้างและเตี้ยลง เพราะพื้นที่ต้องเป็น 1 เสมอ',
  },
]

export function initialParams(d: Distribution): P {
  return Object.fromEntries(d.params.map((p) => [p.key, p.initial]))
}

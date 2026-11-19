import type { MDXComponents } from 'mdx/types'
import { DistributionRelations } from '../diagrams/DistributionRelations'
import { CLTSimulator } from '../interactive/CLTSimulator'
import { ConfidenceIntervalSim } from '../interactive/ConfidenceIntervalSim'
import { DistributionExplorer } from '../interactive/DistributionExplorer'
import { InverseTransformDemo } from '../interactive/InverseTransformDemo'
import { LikelihoodExplorer } from '../interactive/LikelihoodExplorer'
import { LLNSimulator } from '../interactive/LLNSimulator'
import { MAPExplorer } from '../interactive/MAPExplorer'
import { NormalArea } from '../interactive/NormalArea'
import { Callout, Def, Example, Tip, Warn } from './Callout'
import { Compare, CompareItem } from './Compare'
import { Solution } from './Solution'

/**
 * Components every chapter's MDX can use without importing them.
 * Register new shared components here.
 */
export const mdxComponents: MDXComponents = {
  Callout,
  Def,
  Example,
  Warn,
  Tip,
  Solution,
  Compare,
  CompareItem,
  DistributionExplorer,
  NormalArea,
  DistributionRelations,
  LLNSimulator,
  CLTSimulator,
  ConfidenceIntervalSim,
  InverseTransformDemo,
  LikelihoodExplorer,
  MAPExplorer,
}

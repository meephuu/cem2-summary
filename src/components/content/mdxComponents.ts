import type { MDXComponents } from 'mdx/types'
import { DistributionRelations } from '../diagrams/DistributionRelations'
import { DistributionExplorer } from '../interactive/DistributionExplorer'
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
}

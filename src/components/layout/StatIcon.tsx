import { useId } from 'react'

/** App logo (currently only used as the favicon in index.html; kept for reuse): a magnifying glass over bar-chart bars. Same drawing is used as the favicon (index.html). */
export function StatIcon({ size = 28 }: { size?: number }) {
  const clip = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ flex: 'none' }}>
      <defs>
        <clipPath id={clip}>
          <circle cx="13" cy="13" r="8" />
        </clipPath>
      </defs>
      <g fill="none" stroke="var(--accent)" strokeLinecap="round">
        <circle cx="13" cy="13" r="9.5" strokeWidth="3" />
        <path d="M20.2 20.2 L28 28" strokeWidth="4.5" />
      </g>
      <g fill="var(--accent)" clipPath={`url(#${clip})`}>
        <rect x="7.6" y="11" width="2.8" height="12" rx="1.4" />
        <rect x="11.6" y="7.2" width="2.8" height="16" rx="1.4" />
        <rect x="15.6" y="12.4" width="2.8" height="11" rx="1.4" />
      </g>
    </svg>
  )
}

import * as React from 'react'
import {
  framerComponentRegistry,
  getFramerRegisteredComponent,
  type FramerComponentRegistryEntry,
} from './component-registry'

export function FramerRegisteredComponentPreview(props: {
  name: string
  fallback?: React.ReactNode
}) {
  const entry = getFramerRegisteredComponent(props.name)
  if (!entry) return <>{props.fallback ?? null}</>
  const Component = entry.Component
  return <Component />
}

export function FramerComponentRegistryPreview() {
  const entries = Object.entries(framerComponentRegistry) as Array<
    [string, FramerComponentRegistryEntry]
  >

  if (entries.length === 0) {
    return (
      <div style={{ opacity: 0.64 }}>No Framer component modules detected.</div>
    )
  }

  return (
    <section
      data-framer-component-registry="true"
      style={{ display: 'grid', gap: '1rem' }}
    >
      {entries.map(([name, entry]) => {
        const Component = entry.Component
        return (
          <article
            key={name}
            style={{
              display: 'grid',
              gap: '0.75rem',
              border: '1px solid rgb(24 24 27 / 0.1)',
              borderRadius: '1rem',
              background: 'white',
              padding: '1rem',
            }}
          >
            <header style={{ display: 'grid', gap: '0.25rem' }}>
              <strong>{name}</strong>
              <code style={{ color: '#71717a', fontSize: '0.8rem' }}>
                {entry.meta.source}
              </code>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}
              >
                {entry.meta.isDefaultExport ? (
                  <span
                    style={{
                      border: '1px solid rgb(24 24 27 / 0.08)',
                      borderRadius: '999px',
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.7rem',
                    }}
                  >
                    default export
                  </span>
                ) : null}
                {entry.meta.isVariant ? (
                  <span
                    style={{
                      border: '1px solid rgb(24 24 27 / 0.08)',
                      borderRadius: '999px',
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.7rem',
                    }}
                  >
                    {entry.meta.isPrimaryVariant
                      ? 'variant primary'
                      : 'variant'}
                  </span>
                ) : null}
                {entry.meta.breakpoint ? (
                  <span
                    style={{
                      border: '1px solid rgb(24 24 27 / 0.08)',
                      borderRadius: '999px',
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.7rem',
                    }}
                  >
                    {entry.meta.breakpoint}
                  </span>
                ) : null}
                {entry.meta.gesture ? (
                  <span
                    style={{
                      border: '1px solid rgb(24 24 27 / 0.08)',
                      borderRadius: '999px',
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.7rem',
                    }}
                  >
                    {entry.meta.gesture}
                  </span>
                ) : null}
              </div>
              {entry.meta.variantName || entry.meta.inheritsFromId ? (
                <div
                  style={{
                    color: '#52525b',
                    fontSize: '0.75rem',
                    display: 'grid',
                    gap: '0.125rem',
                  }}
                >
                  {entry.meta.variantName ? (
                    <div>Variant name: {entry.meta.variantName}</div>
                  ) : null}
                  {entry.meta.inheritsFromId ? (
                    <div>Inherits from: {entry.meta.inheritsFromId}</div>
                  ) : null}
                </div>
              ) : null}
            </header>
            <div>
              <Component />
            </div>
          </article>
        )
      })}
    </section>
  )
}

export const hasFramerRegisteredComponents = false as const

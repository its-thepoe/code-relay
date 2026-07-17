import * as React from 'react'
import {
  framerComponentFamilies,
  getFramerComponentFamilyById,
  type FramerComponentFamilyMeta,
} from './component-families'

type Trigger =
  | 'click'
  | 'tap'
  | 'hover-start'
  | 'hover-end'
  | 'focus'
  | 'timeout'

function normalizeTrigger(value: string | undefined): Trigger | undefined {
  switch (value) {
    case 'click':
    case 'tap':
    case 'hover-start':
    case 'hover-end':
    case 'focus':
    case 'timeout':
      return value
    default:
      return undefined
  }
}

function nextVariantIdForFamily(
  family: FramerComponentFamilyMeta,
  currentVariantId: string,
) {
  const transition = family.transitions.find(
    (entry) => entry.fromVariantId === currentVariantId && entry.toVariantId,
  )
  if (transition?.toVariantId) return transition.toVariantId
  const variants = family.variants ?? []
  const currentIndex = variants.findIndex(
    (entry) => entry.id === currentVariantId,
  )
  if (currentIndex >= 0 && variants.length > 1) {
    return (
      variants[(currentIndex + 1) % variants.length]?.id ?? currentVariantId
    )
  }
  return family.primaryVariantId
}

function labelForTrigger(value: string | undefined) {
  const normalized = normalizeTrigger(value)
  return normalized === 'tap'
    ? 'Tap'
    : normalized === 'click'
      ? 'Click'
      : normalized === 'hover-start'
        ? 'Hover start'
        : normalized === 'hover-end'
          ? 'Hover end'
          : normalized === 'focus'
            ? 'Focus'
            : normalized === 'timeout'
              ? 'Timeout'
              : 'Advance'
}

export function FramerComponentFamilyStateMachine(props: {
  familyId: string
  initialVariantId?: string
  placement?: 'route' | 'gallery'
  familyName?: string
}) {
  const family = getFramerComponentFamilyById(props.familyId)
  const initialVariantId = props.initialVariantId ?? family?.primaryVariantId
  const [currentVariantId, setCurrentVariantId] =
    React.useState(initialVariantId)

  React.useEffect(() => {
    setCurrentVariantId(initialVariantId)
  }, [initialVariantId])

  if (!family) {
    return <div style={{ opacity: 0.64 }}>Unknown family {props.familyId}</div>
  }

  const currentVariant =
    family.variants.find((entry) => entry.id === currentVariantId) ??
    family.variants.find((entry) => entry.id === family.primaryVariantId) ??
    family.variants[0]
  const availableTransitions = family.transitions.filter(
    (entry) => entry.fromVariantId === currentVariant?.id,
  )

  return (
    <article
      data-framer-component-family={family.id}
      data-framer-component-family-name={props.familyName ?? family.name}
      data-framer-component-family-placement={props.placement ?? 'gallery'}
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
        <strong>{family.name}</strong>
        <div
          data-framer-current-variant={
            currentVariant?.id ?? family.primaryVariantId
          }
          style={{ color: '#52525b', fontSize: '0.8rem' }}
        >
          Current variant:{' '}
          <code>
            {currentVariant?.name ??
              currentVariant?.id ??
              family.primaryVariantId}
          </code>
        </div>
        <div style={{ color: '#71717a', fontSize: '0.75rem' }}>
          Provenance: {family.provenance}
        </div>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {(family.variants ?? []).map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => setCurrentVariantId(variant.id)}
            data-framer-variant-button={variant.id}
            style={{
              border:
                variant.id === currentVariant?.id
                  ? '1px solid #18181b'
                  : '1px solid rgb(24 24 27 / 0.1)',
              borderRadius: '999px',
              padding: '0.3rem 0.65rem',
              background:
                variant.id === currentVariant?.id ? '#18181b' : 'white',
              color: variant.id === currentVariant?.id ? 'white' : '#18181b',
              cursor: 'pointer',
            }}
          >
            {variant.name}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gap: '0.5rem',
          borderRadius: '0.75rem',
          background: 'rgb(24 24 27 / 0.04)',
          padding: '0.75rem',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: '#3f3f46' }}>
          Variant metadata
        </div>
        <div
          style={{
            display: 'grid',
            gap: '0.2rem',
            fontSize: '0.8rem',
            color: '#18181b',
          }}
        >
          {currentVariant?.gesture ? (
            <div>Gesture: {currentVariant.gesture}</div>
          ) : null}
          {currentVariant?.variantName ? (
            <div>Variant name: {currentVariant.variantName}</div>
          ) : null}
          {currentVariant?.inheritsFromId ? (
            <div>Inherits from: {currentVariant.inheritsFromId}</div>
          ) : null}
          {currentVariant?.breakpoint ? (
            <div>Breakpoint: {currentVariant.breakpoint}</div>
          ) : null}
          {!currentVariant?.gesture &&
          !currentVariant?.variantName &&
          !currentVariant?.inheritsFromId &&
          !currentVariant?.breakpoint ? (
            <div>No additional variant metadata.</div>
          ) : null}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {availableTransitions.length > 0 ? (
          availableTransitions.map((transition, index) => (
            <button
              key={`${transition.fromVariantId}-${transition.trigger ?? 'advance'}-${index}`}
              type="button"
              onClick={() =>
                setCurrentVariantId(
                  transition.toVariantId ??
                    nextVariantIdForFamily(
                      family,
                      currentVariant?.id ?? family.primaryVariantId,
                    ),
                )
              }
              data-framer-transition-trigger={transition.trigger ?? 'advance'}
              data-framer-transition-target={
                transition.toVariantId ??
                nextVariantIdForFamily(
                  family,
                  currentVariant?.id ?? family.primaryVariantId,
                )
              }
              style={{
                border: '1px solid rgb(24 24 27 / 0.1)',
                borderRadius: '0.75rem',
                padding: '0.45rem 0.75rem',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {labelForTrigger(transition.trigger)}
            </button>
          ))
        ) : (
          <button
            type="button"
            onClick={() =>
              setCurrentVariantId(
                nextVariantIdForFamily(
                  family,
                  currentVariant?.id ?? family.primaryVariantId,
                ),
              )
            }
            data-framer-transition-trigger="advance"
            data-framer-transition-target={nextVariantIdForFamily(
              family,
              currentVariant?.id ?? family.primaryVariantId,
            )}
            style={{
              border: '1px solid rgb(24 24 27 / 0.1)',
              borderRadius: '0.75rem',
              padding: '0.45rem 0.75rem',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Advance
          </button>
        )}
      </div>
    </article>
  )
}

export function FramerComponentFamilyGallery() {
  if (framerComponentFamilies.length === 0) {
    return (
      <div style={{ opacity: 0.64 }}>
        No Framer component families detected.
      </div>
    )
  }

  return (
    <section
      data-framer-component-families="true"
      style={{ display: 'grid', gap: '1rem' }}
    >
      {framerComponentFamilies.map((family) => (
        <FramerComponentFamilyStateMachine
          key={family.id}
          familyId={family.id}
          placement="gallery"
          familyName={family.name}
        />
      ))}
    </section>
  )
}

export const hasFramerComponentFamilies = false as const

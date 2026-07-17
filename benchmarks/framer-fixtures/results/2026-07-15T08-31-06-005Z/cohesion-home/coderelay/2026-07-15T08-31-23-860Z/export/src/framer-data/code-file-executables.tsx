import * as React from 'react'
import { FramerAdapterProvider } from './framer-adapter'

type ExecutableEntry = {
  Component: React.ComponentType<any>
  exportName: string
  compatibility:
    | 'portable'
    | 'portable-with-adapter'
    | 'portable-with-dependencies'
}

class FramerExecutableCodeFileErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

export const framerCodeFileExecutables: Record<string, ExecutableEntry> = {}

export function getFramerExecutableCodeFileByName(name: string) {
  return framerCodeFileExecutables[name]
}

export function FramerExecutableCodeFilePreview(props: {
  name: string
  fallback?: React.ReactNode
}) {
  const entry = getFramerExecutableCodeFileByName(props.name)
  if (!entry) return <>{props.fallback ?? null}</>
  const Component = entry.Component
  const fallback = (
    <div data-framer-code-file-executable-fallback={props.name}>
      {props.fallback ?? (
        <div style={{ opacity: 0.72 }}>
          Executable preview failed for <code>{props.name}</code>.
        </div>
      )}
    </div>
  )

  return (
    <FramerExecutableCodeFileErrorBoundary fallback={fallback}>
      <FramerAdapterProvider target="preview">
        <div
          data-framer-code-file-executable={props.name}
          data-framer-code-file-export={entry.exportName}
        >
          <Component />
        </div>
      </FramerAdapterProvider>
    </FramerExecutableCodeFileErrorBoundary>
  )
}

export const hasFramerExecutableCodeFiles = false as const

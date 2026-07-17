import * as React from 'react'
export * from 'framer-motion'
export { motion } from 'framer-motion'

type RenderTargetValue = 'canvas' | 'preview' | 'export'

const renderTargetState: {
  current: RenderTargetValue
} = {
  current: typeof window === 'undefined' ? 'export' : 'preview',
}

export const RenderTarget = {
  canvas: 'canvas' as const,
  preview: 'preview' as const,
  export: 'export' as const,
  current() {
    return renderTargetState.current
  },
}

export function FramerAdapterProvider(props: {
  target?: RenderTargetValue
  children: React.ReactNode
}) {
  const target =
    props.target ?? (typeof window === 'undefined' ? 'export' : 'preview')
  renderTargetState.current = target

  React.useEffect(() => {
    renderTargetState.current = target
    return () => {
      renderTargetState.current =
        typeof window === 'undefined' ? 'export' : 'preview'
    }
  }, [target])

  return <>{props.children}</>
}

export function addPropertyControls<T = unknown>(
  _component: unknown,
  _controls: PropertyControls<T>,
) {
  return undefined
}

export const ControlType = {
  String: 'String',
  Boolean: 'Boolean',
  Number: 'Number',
  Color: 'Color',
  Enum: 'Enum',
  Array: 'Array',
  Object: 'Object',
  File: 'File',
  Image: 'Image',
  ResponsiveImage: 'ResponsiveImage',
  Transition: 'Transition',
  Font: 'Font',
  BorderRadius: 'BorderRadius',
  Padding: 'Padding',
  FusedNumber: 'FusedNumber',
  SegmentedEnum: 'SegmentedEnum',
  EventHandler: 'EventHandler',
  ComponentInstance: 'ComponentInstance',
} as const

export type PropertyControls<T = unknown> = Record<string, unknown>
export type ControlDescription = Record<string, unknown>

export const Frame = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Frame(props, ref) {
  return <div ref={ref} {...props} />
})

export function Stack(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

export function useIsStaticRenderer() {
  return false
}

import * as React from 'react'

export type FramerComponentRegistryEntry = {
  Component: React.ComponentType<any>
  meta: {
    source: string
    isDefaultExport?: boolean
    isVariant?: boolean
    isPrimaryVariant?: boolean
    gesture?: string
    inheritsFromId?: string
    breakpoint?: string
    variantName?: string
  }
}

export const framerComponentRegistry = {} as const satisfies Record<
  string,
  FramerComponentRegistryEntry
>

export type FramerComponentRegistryKey = keyof typeof framerComponentRegistry
export type FramerComponentRegistryValue =
  (typeof framerComponentRegistry)[FramerComponentRegistryKey]

export function getFramerRegisteredComponent(
  name: string,
): FramerComponentRegistryEntry | undefined {
  return framerComponentRegistry[name as FramerComponentRegistryKey]
}

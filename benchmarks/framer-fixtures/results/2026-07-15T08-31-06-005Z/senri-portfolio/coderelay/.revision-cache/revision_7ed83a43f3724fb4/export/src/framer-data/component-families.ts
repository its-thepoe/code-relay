export type FramerComponentFamilyVariantMeta = {
  id: string
  name: string
  gesture?: string
  inheritsFromId?: string
  breakpoint?: string
  variantName?: string
  codeFileId?: string
}

export type FramerComponentFamilyInstanceMeta = {
  nodeId: string
  routePath?: string
  controls?: Record<string, unknown>
  initialVariantId?: string
}

export type FramerComponentFamilyTransitionMeta = {
  fromVariantId: string
  toVariantId?: string
  trigger?: string
  confidence: number
  provenance: 'plugin' | 'runtime' | 'source' | 'merged'
}

export type FramerComponentFamilyMeta = {
  id: string
  name: string
  primaryVariantId: string
  variants: FramerComponentFamilyVariantMeta[]
  instances: FramerComponentFamilyInstanceMeta[]
  transitions: FramerComponentFamilyTransitionMeta[]
  provenance: 'plugin' | 'runtime' | 'source' | 'merged'
}

export const framerComponentFamilies: ReadonlyArray<FramerComponentFamilyMeta> =
  []

export function getFramerComponentFamilyById(id: string) {
  return framerComponentFamilies.find((entry) => entry.id === id)
}

export function getFramerComponentFamilyByName(name: string) {
  return framerComponentFamilies.find((entry) => entry.name === name)
}

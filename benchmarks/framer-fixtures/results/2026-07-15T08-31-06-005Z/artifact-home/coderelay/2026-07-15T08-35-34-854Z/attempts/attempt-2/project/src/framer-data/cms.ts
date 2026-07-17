export const framerCmsCollections = [] as const

export type FramerCmsCollectionMeta = (typeof framerCmsCollections)[number]
export type FramerCmsItemMeta = FramerCmsCollectionMeta extends {
  items: readonly (infer Item)[]
}
  ? Item
  : never

export function getFramerCmsCollectionByName(name: string) {
  return framerCmsCollections.find((entry) => entry.name === name)
}

export function getFramerCmsCollectionById(id: string) {
  return framerCmsCollections.find((entry) => entry.id === id)
}

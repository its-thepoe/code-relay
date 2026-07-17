import * as React from 'react'
import { getFramerCmsCollectionById, getFramerCmsCollectionByName } from './cms'
import {
  FramerCmsCollectionList,
  FramerCmsField,
  FramerCmsImage,
  FramerCmsLink,
  FramerCmsRichText,
  FramerCmsText,
  getFramerCmsItems,
  getFramerCmsPlainText,
} from './cms-runtime'

export {}

export const framerCmsSectionRegistry = {} as const

export function getFramerCmsSectionComponent(name: string) {
  return framerCmsSectionRegistry[name as keyof typeof framerCmsSectionRegistry]
}

export function FramerCmsAutoSections() {
  const collections = []
    .map((name) => ({
      name,
      Component: getFramerCmsSectionComponent(name),
      itemCount: getFramerCmsItems({ name }).length,
    }))
    .filter((entry) => entry.itemCount > 0)

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {collections.map((entry) => {
        const Component = entry.Component
        return <Component key={entry.name} />
      })}
    </div>
  )
}

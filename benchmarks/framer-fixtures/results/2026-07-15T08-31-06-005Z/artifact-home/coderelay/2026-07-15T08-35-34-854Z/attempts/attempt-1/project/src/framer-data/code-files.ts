export type FramerCodeFileCompatibility =
  | 'portable'
  | 'portable-with-adapter'
  | 'portable-with-dependencies'
  | 'runtime-fallback-required'
  | 'unsupported'

export type FramerCodeFileMeta = {
  id?: string
  name: string
  path?: string
  versionId?: string
  exports?: string[]
  exportDetails?: ReadonlyArray<Record<string, unknown>>
  insertURL?: string
  source?: string
  content?: string
  contentHash?: string
  contentByteLength?: number
  hasContent?: boolean
  compatibility?: FramerCodeFileCompatibility
  compatibilityReasons?: string[]
  dependencyNames?: string[]
  unadaptedComponentPath?: string
  unadaptedMetadataPath?: string
}

export const framerCodeFiles: ReadonlyArray<FramerCodeFileMeta> = []

export function getFramerCodeFileByName(name: string) {
  return framerCodeFiles.find((entry) => entry.name === name)
}

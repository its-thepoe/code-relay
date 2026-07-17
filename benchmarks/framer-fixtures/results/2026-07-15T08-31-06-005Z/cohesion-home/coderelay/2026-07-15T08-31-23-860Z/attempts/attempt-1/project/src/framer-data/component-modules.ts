export const framerComponentModules = [] as const

export type FramerComponentModuleMeta = (typeof framerComponentModules)[number]

export function getFramerComponentModuleByName(name: string) {
  return framerComponentModules.find((entry) => entry.name === name)
}

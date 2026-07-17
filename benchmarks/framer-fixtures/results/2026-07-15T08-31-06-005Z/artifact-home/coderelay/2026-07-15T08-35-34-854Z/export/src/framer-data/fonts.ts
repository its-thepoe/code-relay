export const framerFonts = [
  {
    name: 'sans-serif',
    family: 'sans-serif',
    source: 'runtime',
  },
  {
    name: 'Inter',
    family: 'Inter, "Inter Placeholder", sans-serif',
    source: 'runtime',
  },
  {
    name: 'Inter Medium',
    family:
      '"Inter Medium", Inter, Inter, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    source: 'runtime',
  },
  {
    name: 'Inter',
    family: 'Inter, sans-serif',
    source: 'runtime',
  },
  {
    name: 'Rock Salt',
    family: '"Rock Salt", sans-serif',
    source: 'runtime',
  },
] as const

export type FramerFontMeta = (typeof framerFonts)[number]

export function getFramerFontByFamily(family: string) {
  return framerFonts.find((entry) => entry.family === family)
}

export function getFramerFontByName(name: string) {
  return framerFonts.find((entry) => entry.name === name)
}

export const framerFontFamilies = framerFonts.map((entry) => entry.family)

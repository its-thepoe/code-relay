export const framerFonts = [
  {
    name: 'sans-serif',
    family: 'sans-serif',
    source: 'runtime',
  },
  {
    name: 'Geist Mono',
    family: '"Geist Mono", monospace',
    source: 'runtime',
  },
  {
    name: 'DM Mono',
    family: '"DM Mono", monospace',
    source: 'runtime',
  },
  {
    name: 'Playfair Display',
    family: '"Playfair Display", "Playfair Display Placeholder", serif',
    source: 'runtime',
  },
  {
    name: 'Fragment Mono',
    family: '"Fragment Mono", monospace',
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

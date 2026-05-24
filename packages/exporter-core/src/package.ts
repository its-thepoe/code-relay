import archiver from 'archiver'
import fs from 'node:fs'
import { mkdirp } from 'fs-extra'
import path from 'node:path'

export async function zipDirectory(sourceDir: string, zipPath: string) {
  await mkdirp(path.dirname(zipPath))

  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve())
    archive.on('error', reject)

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize().catch(reject)
  })
}

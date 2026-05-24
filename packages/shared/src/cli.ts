export type CliArgs = {
  url?: string
  outDir?: string
  name?: string
  selector?: string
  maxAttempts?: number
  targetFidelity?: number
}

export function parseCliArgs(args: string[]): CliArgs {
  const parsed: CliArgs = {}

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    const next = args[index + 1]

    if (arg === '--url') {
      parsed.url = next
      index += 1
    } else if (arg === '--out-dir') {
      parsed.outDir = next
      index += 1
    } else if (arg === '--name') {
      parsed.name = next
      index += 1
    } else if (arg === '--selector') {
      parsed.selector = next
      index += 1
    } else if (arg === '--max-attempts') {
      parsed.maxAttempts = Number(next)
      index += 1
    } else if (arg === '--target-fidelity') {
      parsed.targetFidelity = Number(next)
      index += 1
    }
  }

  return parsed
}

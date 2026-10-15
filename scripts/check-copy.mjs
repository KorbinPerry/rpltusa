// Fails if any source or built page contains an em dash, en dash or emoji.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

const ROOTS = ['app', 'shared', 'server', 'tests', 'README.md', 'nuxt.config.ts', '.output/public']
const EXTENSIONS = new Set(['.vue', '.ts', '.mjs', '.js', '.md', '.html', '.txt', '.json', '.xml'])
const SKIP_DIRS = new Set(['node_modules', '_nuxt', '_ipx', '.nuxt'])
const FORBIDDEN = new RegExp('[\\u2013\\u2014]|\\p{Extended_Pictographic}', 'u')

function* walk(path) {
  let stat
  try {
    stat = statSync(path)
  }
  catch {
    return
  }
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (!SKIP_DIRS.has(entry))
        yield* walk(join(path, entry))
    }
  }
  else if (EXTENSIONS.has(extname(path))) {
    yield path
  }
}

const problems = []
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      const match = line.match(FORBIDDEN)
      if (match)
        problems.push(`${file}:${i + 1}: "${match[0]}" in: ${line.trim().slice(0, 120)}`)
    })
  }
}

if (problems.length) {
  console.error(`Copy check failed (no em dashes, en dashes or emojis allowed):\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('Copy check passed: no em dashes, en dashes or emojis.')
